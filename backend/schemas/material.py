"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/schemas/material.py
หน้าที่: เป็นหน้ากากคัดกรองข้อมูล (Validation) ขาเข้า-ขาออก ของวัสดุ

✅ สิ่งที่เขียนได้ดี:
- เยี่ยมมากที่มีการแยก `MaterialCreate` (ตอนรับเข้า) ออกจาก `MaterialResponse` (ตอนส่งออก)
- การตั้งค่าเริ่มต้น `is_active: bool = True` และ `min_qty: int = 10` ถือเป็น UX ฝั่ง Backend ที่ดี
- การเปิด `model_config = ConfigDict(from_attributes=True)` เป็นวิธีที่ถูกต้องของ Pydantic v2

💪 ข้อสรุป: 
ไฟล์นี้เขียนได้สมบูรณ์แบบ รูปแบบถูกต้องตามมาตรฐาน Best Practice เลยครับ!
=============================================================================
"""
#ไฟล์นี้สำคัญมาก เพราะเราต้องแยกหน้ากากตอน "สร้างวัสดุใหม่" กับตอน "ส่งข้อมูลวัสดุให้หน้าเว็บ" ออกจากกัน
from pydantic import BaseModel, ConfigDict
from typing import Optional

class MaterialBase(BaseModel):
    mat_code: str
    mat_name: str
    mat_type_id: int
    unit_pack: Optional[str] = None
    qty_per_pack: Optional[int] = None
    unit_sub: Optional[str] = None
    price_per_pack: Optional[int] = None
    is_active: bool = True
    min_qty: int = 10

# ตอนแอดมินกดเพิ่มวัสดุ จะใช้ Schema นี้
class MaterialCreate(MaterialBase):
    pass

# ตอนส่งข้อมูลไปโชว์ที่ตารางหน้าเว็บ จะใช้ Schema นี้ (มี mat_id แนบไปด้วย)
class MaterialResponse(MaterialBase):
    mat_id: int
    
    # เปิดให้แปลงจาก SQLAlchemy Model เป็น JSON อัตโนมัติ
    model_config = ConfigDict(from_attributes=True)