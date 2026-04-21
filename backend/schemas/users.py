"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/schemas/users.py
หน้าที่: โครงสร้างตรวจสอบข้อมูลผู้ใช้ ระบบ Token และ Login

🌟 [อัปเดตล่าสุด]: เพิ่ม `is_active: bool = True` ใน Schema หลักแล้ว ทำให้การรับส่งข้อมูลกับหน้าเว็บมีตัวแปรตรงกับ Database ตลอดเวลา ระบบตรวจสอบข้อมูลสมบูรณ์แล้วครับ!
=============================================================================
"""

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from enum import Enum

# 1. กำหนดตัวเลือกของสิทธิ์ผู้ใช้งานให้ตรงกับ Database
class UserRole(str, Enum):
    ADMIN = "Admin"
    USER = "User"
    SUPERADMIN = "Superadmin"

# 2. Schema พื้นฐาน (โครงสร้างข้อมูลผู้ใช้)
class UserBase(BaseModel):
    emp_code: str
    full_name: str
    position: str
    branch_id: str
    service_point_id: Optional[int] = None
    phone: str
    email: EmailStr
    user_role: UserRole = UserRole.USER
    profile_image: Optional[str] = None
    is_active: bool = True

# 3. สำหรับรับข้อมูลตอน Login
class UserLogin(BaseModel):
    emp_code: str
    password: str

# 4. สำหรับส่งข้อมูลกลับไปที่หน้าเว็บ (ซ่อนรหัสผ่านแน่นอน 100%)
class UserResponse(UserBase):
    user_id: int
    
    # เปิดโหมดให้ Pydantic อ่านข้อมูลจาก SQLAlchemy Model ได้ (v2 style)
    model_config = ConfigDict(from_attributes=True)

# 5. สำหรับส่ง Token กลับไปเมื่อ Login สำเร็จ
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    emp_code: Optional[str] = None