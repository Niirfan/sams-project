"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/schemas/stock.py
หน้าที่: โครงสร้างข้อมูลสำหรับการเคลื่อนไหวของสต็อก

🌟 [อัปเดตล่าสุด]: นำเครื่องมือ `Literal["IN", "OUT", "ADJUST"]` มาติดตั้งใน `HistoryBase` แล้ว!
ตอนนี้เราโยนภาระให้ FastAPI ดักจับคำแปลกปลอมแบบอัตโนมัติ API ของคุณจะไม่รับขยะเข้าสู่ Database ในส่วนนี้อีกต่อไป เจ๋งมากครับ!
=============================================================================
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

# ---------------------------------------------------------
# 1. หน้ากากการจองวัสดุ (Material Reserved)
# ---------------------------------------------------------
class ReservedBase(BaseModel):
    mat_id: int
    req_id: int
    quantity: int
    status: str = "RESERVED"

class ReservedResponse(ReservedBase):
    reserve_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ---------------------------------------------------------
# 2. หน้ากากการจ่าย/ตัดสต็อกวัสดุ (Material Issue)
# ---------------------------------------------------------
class IssueBase(BaseModel):
    mat_id: int
    quantity: int
    issued_by: int
    mat_req_id: int
    note: Optional[str] = None
    status: str = "ISSUED"

class IssueResponse(IssueBase):
    issue_id: int
    issue_date: datetime
    model_config = ConfigDict(from_attributes=True)

# ---------------------------------------------------------
# 3. หน้ากากประวัติการเคลื่อนไหว (Material History)
# ---------------------------------------------------------
class HistoryBase(BaseModel):
    mat_id: int
    action_type: Literal["IN", "OUT", "ADJUST"]
    quantity: int
    balance_after: int
    ref_table: Optional[str] = None
    ref_id: Optional[int] = None

class HistoryResponse(HistoryBase):
    history_id: int
    created_at: datetime
    action_date: datetime
    model_config = ConfigDict(from_attributes=True)