"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/models/master.py
หน้าที่: สร้างพิมพ์เขียวจำลอง (Model) ของตารางฐานข้อมูลส่วนข้อมูลพื้นฐาน

✅ สิ่งที่เขียนได้ดี:
- การตั้งชื่อ Class พิมพ์ใหญ่ ตารางพิมพ์เล็ก ชัดเจนและอ่านเข้าใจง่าย (เช่น ServicePoint -> sams_service)
- กำหนดขนาดตัวอักษรเพื่อประหยัด Database (เช่น String(5)) ได้เหมาะสม

💡 ไอเดียเพิ่มเติม (Tips):
- ในอนาคต สาขาหรือประเภทวัสดุอาจจะไม่ได้ถูกลบทิ้ง แต่ถูก "ยกเลิกการใช้งาน" (Soft Delete)
- ควรพิจารณาเพิ่ม Field: `is_active = Column(Boolean, default=True)` 
- หรืออาจจะเพิ่มเวลาแก้ไขข้อมูล: `updated_at = Column(DateTime)` เพื่อให้ตรวจสอบย้อนหลังได้ (Audit)
=============================================================================
"""
#กลุ่มข้อมูลพื้นฐานเพื่อเก็บข้อมูล สาขา, จุดบริการ และประเภทวัสดุ
from sqlalchemy import Column, Integer, String, ForeignKey
from backend.database import Base

class Branch(Base):
    __tablename__ = "sams_branch"
    branch_id = Column(String(5), primary_key=True) # รหัสสาขา [cite: 347]
    branch_name = Column(String(50), nullable=False)

class ServicePoint(Base):
    __tablename__ = "sams_service"
    service_point_id = Column(Integer, primary_key=True)
    service_point_name = Column(String(50), nullable=False)
    branch_id = Column(String(5), ForeignKey("sams_branch.branch_id")) # เชื่อมกับสาขา [cite: 349]
    service_point_code = Column(String(10))

class MaterialType(Base):
    __tablename__ = "material_type"
    mat_type_id = Column(Integer, primary_key=True)
    mat_type_name = Column(String(50), nullable=False) # ชื่อประเภทวัสดุ [cite: 355]