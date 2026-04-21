"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/models/users.py
หน้าที่: โครงสร้างตารางข้อมูลผู้ใช้งาน (พนักงาน)

🌟 [อัปเดตล่าสุด]: มีการเพิ่มคอลัมน์ `is_active = Column(Boolean, default=True)` เรียบร้อย 
โครงสร้างตารางตอนนี้เป็นแบบ Soft Delete สมบูรณ์แบบ รองรับการระงับสิทธิ์โดยไม่ต้องลบข้อมูลบัญชีทิ้งจริงครับ!
=============================================================================
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Boolean # <-- เพิ่ม import
from backend.database import Base

class User(Base):
    __tablename__ = "sams_users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    emp_code = Column(String(10), unique=True, index=True, nullable=False)
    
    # 1. คืนชีพ full_name ให้ตรงกับ Database เดิม
    full_name = Column(String(50), nullable=False)
    
    position = Column(String(50), nullable=False)
    
    # 2. ปรับ branch_id ให้เป็น String ให้ตรงกับตาราง sams_branch
    branch_id = Column(String(5), ForeignKey("sams_branch.branch_id"), nullable=False)
    service_point_id = Column(Integer, ForeignKey("sams_service.service_point_id"), nullable=True)
    
    # 3. คืนค่าความยาวให้ตรงกับ Data Dictionary
    phone = Column(String(10), nullable=False)
    email = Column(String(50), nullable=False)
    
    # 4. Enum ของคุณใช้งานได้ดีเยี่ยมครับ!
    user_role = Column(Enum("User", "Admin", "Superadmin", name="role_enum"), default="User")
    
    profile_image = Column(String(50), nullable=True)
    password = Column(String(255), nullable=False)
    is_active=Column(Boolean, default=True)