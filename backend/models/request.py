"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/models/request.py
หน้าที่: โครงสร้างตารางจัดการการเบิก ตัดสต็อก จ่ายของ และประวัติ 

✅ สิ่งที่เขียนได้ดี:
- ออกแบบตารางเพื่อแยก "ขั้วใบเบิก (Header)" กับ "รายการย่อย (Detail)" ชัดเจน
- มีตาราง History สำหรับเก็บ Log โดยเฉพาะ ทำให้สามารถตามรอย (Audit) ย้อนหลังได้ง่าย
- แผนผังความสัมพันธ์ (Foreign Key) ทำได้ครบถ้วน
=============================================================================
"""
#กลุ่มระบบการเบิกจ่าย (Requests & Transactions)เพื่อคุมระบบใบเบิกและการตัดสต็อกครับ
from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, Text
from backend.database import Base
from datetime import datetime, timezone

# ---------------------------------------------------------
# 1. กลุ่มใบเบิก (Request Header & Detail)
# ---------------------------------------------------------
class MaterialReq(Base):
    __tablename__ = "material_req"
    mat_req_id = Column(Integer, primary_key=True, index=True)
    mat_req_code = Column(String(10), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("sams_users.user_id"), nullable=False)
    req_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    total_price = Column(Numeric(10, 2), default=0.0)
    req_status = Column(String(20), default="PENDING")

class MaterialReqDetail(Base):
    __tablename__ = "material_req_detail"
    detail_id = Column(Integer, primary_key=True, index=True)
    mat_req_id = Column(Integer, ForeignKey("material_req.mat_req_id"), nullable=False)
    mat_id = Column(Integer, ForeignKey("sams_material.mat_id"), nullable=False)
    req_qty = Column(Integer, nullable=False) 
    approve_qty = Column(Integer, default=0) 

# ---------------------------------------------------------
# 2. กลุ่มการจองและตัดสต็อก (Reserved & Issue)
# ---------------------------------------------------------
class MaterialReserved(Base):
    __tablename__ = "material_reserved"
    reserve_id = Column(Integer, primary_key=True, index=True)
    mat_id = Column(Integer, ForeignKey("sams_material.mat_id"), nullable=False)
    req_id = Column(Integer, ForeignKey("material_req.mat_req_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(Text, default="RESERVED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class MaterialIssue(Base):
    __tablename__ = "material_issus" 
    issue_id = Column(Integer, primary_key=True, index=True)
    mat_id = Column(Integer, ForeignKey("sams_material.mat_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    issue_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # เติมคอลัมน์ที่ขาดไปให้ครบตาม Data Dictionary
    issued_by = Column(Integer, nullable=False)
    note = Column(String(50), nullable=True)
    status = Column(String(20), default="ISSUED")
    mat_req_id = Column(Integer, ForeignKey("material_req.mat_req_id"), nullable=False)

# ---------------------------------------------------------
# 3. กลุ่มประวัติการเคลื่อนไหว (History)
# ---------------------------------------------------------
class MaterialHistory(Base):
    __tablename__ = "material_history"
    history_id = Column(Integer, primary_key=True, index=True)
    mat_id = Column(Integer, ForeignKey("sams_material.mat_id"), nullable=False)
    action_type = Column(String(10), nullable=False) 
    quantity = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    
    # เติมจุดอ้างอิงให้รู้ว่าประวัตินี้มาจากใบเบิกไหน หรือการรับเข้าล็อตไหน
    ref_table = Column(String(50), nullable=True)
    ref_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    action_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))