"""
SQLAlchemy ORM Models for Maanak Drishti
Defines schema for Consumer Grievance Reports and Inspector Audit Trails.
"""

from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Report(Base):
    __tablename__ = "consumer_reports"

    id = Column(String(64), primary_key=True, index=True)
    product_name = Column(String(255), nullable=False)
    manufacturer = Column(String(500), default="Not declared")
    mrp = Column(String(100), default="Not declared")
    net_quantity = Column(String(100), default="Not declared")
    mfg_date = Column(String(100), default="Not declared")
    consumer_care = Column(String(500), default="Not declared")
    reason = Column(String(255), nullable=False)
    reason_category = Column(String(100), default="packaging_declaration")
    description = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    extracted_details = Column(JSON, nullable=True)
    compliance_findings = Column(JSON, nullable=True)
    consumer_name = Column(String(255), default="Anonymous Consumer")
    consumer_email = Column(String(255), default="")
    consumer_phone = Column(String(50), default="")
    status = Column(String(50), default="Pending Review", index=True)
    priority = Column(String(20), default="Medium", index=True)
    investigation_notes = Column(Text, default="")
    rejection_reason = Column(Text, default="")
    submitted_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    audits = relationship("InspectorAudit", back_populates="report", cascade="all, delete-orphan")

class InspectorAudit(Base):
    __tablename__ = "inspector_audits"

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_id = Column(String(64), ForeignKey("consumer_reports.id", ondelete="CASCADE"), nullable=False, index=True)
    inspector_id = Column(String(100), default="OFFICER-INSPECTOR")
    action = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("Report", back_populates="audits")
