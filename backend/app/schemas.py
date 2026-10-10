"""
Pydantic Schemas for Request & Response Data Validation
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ReportCreate(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=255, alias="productName")
    manufacturer: Optional[str] = Field("Not declared", max_length=500)
    mrp: Optional[str] = Field("Not declared", max_length=100)
    net_quantity: Optional[str] = Field("Not declared", max_length=100, alias="netQuantity")
    mfg_date: Optional[str] = Field("Not declared", max_length=100, alias="mfgDate")
    consumer_care: Optional[str] = Field("Not declared", max_length=500, alias="consumerCare")
    reason: Optional[str] = Field("Reported Packaging Concern", min_length=1, max_length=255)
    reason_category: Optional[str] = Field("packaging_declaration", alias="reasonCategory")
    description: str = Field(..., min_length=2)
    image_url: Optional[str] = Field(None, alias="imageUrl")
    extracted_details: Optional[Dict[str, Any]] = Field(None, alias="extractedDetails")
    compliance_findings: Optional[Dict[str, Any]] = Field(None, alias="complianceFindings")
    consumer_name: Optional[str] = Field("Anonymous Consumer", alias="consumerName")
    consumer_email: Optional[str] = Field("", alias="consumerEmail")
    consumer_phone: Optional[str] = Field("", alias="consumerPhone")

    class Config:
        populate_by_name = True

class ReportUpdate(BaseModel):
    status: Optional[str] = None
    investigation_notes: Optional[str] = Field(None, alias="investigationNotes")
    rejection_reason: Optional[str] = Field(None, alias="rejectionReason")
    inspector_id: Optional[str] = Field("OFFICER-INSPECTOR", alias="inspectorId")
    note: Optional[str] = None

    class Config:
        populate_by_name = True

class AuditResponse(BaseModel):
    action: str
    inspector_id: str = Field(alias="inspectorId")
    notes: Optional[str] = None
    created_at: datetime = Field(alias="timestamp")

    class Config:
        populate_by_name = True
        from_attributes = True

class ReportResponse(BaseModel):
    id: str
    product_name: str = Field(alias="productName")
    manufacturer: Optional[str] = None
    mrp: Optional[str] = None
    net_quantity: Optional[str] = Field(None, alias="netQuantity")
    mfg_date: Optional[str] = Field(None, alias="mfgDate")
    consumer_care: Optional[str] = Field(None, alias="consumerCare")
    reason: str
    reason_category: Optional[str] = Field(None, alias="reasonCategory")
    description: str
    image_url: Optional[str] = Field(None, alias="imageUrl")
    extracted_details: Optional[Dict[str, Any]] = Field(None, alias="extractedDetails")
    compliance_findings: Optional[Dict[str, Any]] = Field(None, alias="complianceFindings")
    consumer_name: Optional[str] = Field(None, alias="consumerName")
    consumer_email: Optional[str] = Field(None, alias="consumerEmail")
    consumer_phone: Optional[str] = Field(None, alias="consumerPhone")
    status: str
    priority: str
    investigation_notes: Optional[str] = Field(None, alias="investigationNotes")
    rejection_reason: Optional[str] = Field(None, alias="rejectionReason")
    submitted_at: datetime = Field(alias="submittedAt")
    updated_at: datetime = Field(alias="updatedAt")
    audit_trail: Optional[List[Dict[str, Any]]] = Field([], alias="inspectorAuditTrail")

    class Config:
        populate_by_name = True
        from_attributes = True

class ReportStatsResponse(BaseModel):
    total: int
    pending: int
    underInvestigation: int
    resolved: int
    rejected: int

class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    database: Dict[str, Any]
    timestamp: datetime
