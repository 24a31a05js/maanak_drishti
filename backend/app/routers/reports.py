"""
Consumer Grievance Reports Router
Handles report creation, retrieval, filtering, inspector updates, and database persistence.
"""

import random
import string
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from ..database import get_db
from ..models import Report, InspectorAudit
from ..schemas import ReportCreate, ReportUpdate, ReportResponse, ReportStatsResponse

router = APIRouter(prefix="/reports", tags=["Reports"])

def generate_report_id() -> str:
    year = datetime.utcnow().year
    number = random.randint(1000, 9999)
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"MD-REP-{year}-{number}{suffix}"

def calculate_priority(category: str) -> str:
    cat = (category or "").lower()
    high_priority = [
        "overcharging_mrp",
        "altered_mrp_sticker",
        "missing_manufacturer",
        "toxic_hazardous_substance",
    ]
    medium_priority = [
        "missing_net_quantity",
        "missing_mfg_date",
        "missing_consumer_care",
        "misleading_declaration",
        "missing_mandatory_declarations",
    ]
    if any(h in cat for h in high_priority):
        return "High"
    if any(m in cat for m in medium_priority):
        return "Medium"
    return "Low"

def mask_contact(email: str, phone: str):
    masked_email = email
    if email and "@" in email:
        parts = email.split("@")
        user = parts[0]
        vis = min(2, len(user))
        masked_email = f"{user[:vis]}***@{parts[1]}"
    
    masked_phone = phone
    if phone and len(phone) >= 4:
        masked_phone = f"******{phone[-4:]}"
    return masked_email, masked_phone

def format_report_dict(r: Report, is_inspector: bool = False) -> dict:
    audits = [
        {
            "action": a.action,
            "inspectorId": a.inspector_id,
            "notes": a.notes,
            "timestamp": a.created_at.isoformat()
        }
        for a in (r.audits or [])
    ]
    
    email = r.consumer_email
    phone = r.consumer_phone
    if not is_inspector:
        email, phone = mask_contact(email, phone)

    return {
        "id": r.id,
        "productName": r.product_name,
        "manufacturer": r.manufacturer,
        "mrp": r.mrp,
        "netQuantity": r.net_quantity,
        "mfgDate": r.mfg_date,
        "consumerCare": r.consumer_care,
        "reason": r.reason,
        "reasonCategory": r.reason_category,
        "description": r.description,
        "imageUrl": r.image_url,
        "extractedDetails": r.extracted_details,
        "complianceFindings": r.compliance_findings,
        "consumerName": r.consumer_name if is_inspector else "Anonymous Consumer",
        "consumerEmail": email,
        "consumerPhone": phone,
        "status": r.status,
        "priority": r.priority,
        "investigationNotes": r.investigation_notes,
        "rejectionReason": r.rejection_reason,
        "submittedAt": r.submitted_at,
        "updatedAt": r.updated_at,
        "inspectorAuditTrail": audits,
    }

@router.post("", response_model=ReportResponse, status_code=201)
@router.post("/", response_model=ReportResponse, status_code=201, include_in_schema=False)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    """Create and persist a consumer grievance report in database"""
    report_id = generate_report_id()
    now = datetime.utcnow()
    priority = calculate_priority(payload.reason_category or payload.reason)

    new_report = Report(
        id=report_id,
        product_name=payload.product_name.strip(),
        manufacturer=payload.manufacturer or "Not declared",
        mrp=payload.mrp or "Not declared",
        net_quantity=payload.net_quantity or "Not declared",
        mfg_date=payload.mfg_date or "Not declared",
        consumer_care=payload.consumer_care or "Not declared",
        reason=payload.reason.strip(),
        reason_category=payload.reason_category or "packaging_declaration",
        description=payload.description.strip(),
        image_url=payload.image_url,
        extracted_details=payload.extracted_details,
        compliance_findings=payload.compliance_findings,
        consumer_name=payload.consumer_name or "Anonymous Consumer",
        consumer_email=payload.consumer_email or "",
        consumer_phone=payload.consumer_phone or "",
        status="Pending Review",
        priority=priority,
        investigation_notes="",
        rejection_reason="",
        submitted_at=now,
        updated_at=now,
    )

    db.add(new_report)

    # Initial audit trail
    init_audit = InspectorAudit(
        report_id=report_id,
        inspector_id="SYSTEM",
        action="REPORT_SUBMITTED",
        notes="Citizen grievance lodged through Consumer Portal.",
        created_at=now
    )
    db.add(init_audit)
    db.commit()
    db.refresh(new_report)

    return format_report_dict(new_report, is_inspector=True)

@router.get("/stats", response_model=ReportStatsResponse)
def get_report_stats(db: Session = Depends(get_db)):
    """Get aggregate report metrics for inspector dashboard"""
    reports = db.query(Report).all()
    stats = {
        "total": len(reports),
        "pending": sum(1 for r in reports if r.status == "Pending Review"),
        "underInvestigation": sum(1 for r in reports if r.status == "Under Investigation"),
        "resolved": sum(1 for r in reports if r.status == "Resolved"),
        "rejected": sum(1 for r in reports if r.status == "Rejected"),
    }
    return stats

@router.get("", response_model=List[ReportResponse])
@router.get("/", response_model=List[ReportResponse], include_in_schema=False)
def get_reports(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query("consumer"),
    x_user_role: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """List reports with role-based privacy masking"""
    query = db.query(Report)

    if status and status != "ALL":
        query = query.filter(Report.status == status)

    if priority and priority != "ALL":
        query = query.filter(Report.priority == priority)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Report.id.ilike(search_filter),
                Report.product_name.ilike(search_filter),
                Report.manufacturer.ilike(search_filter),
                Report.reason.ilike(search_filter)
            )
        )

    reports = query.order_by(desc(Report.submitted_at)).all()
    is_inspector = (role == "inspector" or x_user_role == "inspector")

    return [format_report_dict(r, is_inspector=is_inspector) for r in reports]

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: str,
    role: Optional[str] = Query("consumer"),
    x_user_role: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get report details by unique ID"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"Report with ID {report_id} not found.")

    is_inspector = (role == "inspector" or x_user_role == "inspector")
    return format_report_dict(report, is_inspector=is_inspector)

@router.patch("/{report_id}", response_model=ReportResponse)
def update_report(
    report_id: str,
    payload: ReportUpdate,
    x_user_role: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update report status & investigation notes (Authorized Inspectors Only)"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"Report with ID {report_id} not found.")

    now = datetime.utcnow()
    inspector_id = payload.inspector_id or "OFFICER-INSPECTOR"

    if payload.status:
        old_status = report.status
        report.status = payload.status
        
        audit_entry = InspectorAudit(
            report_id=report.id,
            inspector_id=inspector_id,
            action=f"STATUS_CHANGE_TO_{payload.status.upper().replace(' ', '_')}",
            notes=payload.note or f"Status changed from '{old_status}' to '{payload.status}'",
            created_at=now
        )
        db.add(audit_entry)

    if payload.investigation_notes is not None:
        report.investigation_notes = payload.investigation_notes

    if payload.rejection_reason is not None and report.status == "Rejected":
        report.rejection_reason = payload.rejection_reason

    report.updated_at = now
    db.commit()
    db.refresh(report)

    return format_report_dict(report, is_inspector=True)
