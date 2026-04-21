"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/login/auth_utils.py
หน้าที่: รวมฟังก์ชันตัวช่วยสำหรับระบบ Login (เช่น การเข้ารหัส, การสร้าง Token)

✅ สิ่งที่เขียนได้ดี:
- โค้ดสะอาดมาก มีฟังก์ชันแบบ Single Responsibility (1 ฟังก์ชันทำ 1 หน้าที่)
- เลือกระบบเข้ารหัสแบบ bcrypt ซึ่งถือว่ามาตรฐานและปลอดภัยที่สุด

⚠️ สิ่งที่ควรปรับปรุงเพื่อขึ้นระบบจริง (Production):
1. ตัวแปร `SECRET_KEY` ไม่ควรพิมพ์เป็นข้อความตรงๆ ในโค้ด (Hardcode) 
   เพราะถ้าใครได้ไฟล์นี้ไปความปลอดภัยจะถูกเจาะทันที! แนะนำให้ดึงมาจากไฟล์ .env ทันทีที่ขึ้น Production 
   (เช่นใช้ `os.getenv("SECRET_KEY")`)
2. ตัวแปร `ACCESS_TOKEN_EXPIRE_MINUTES` อาจจะย้ายไปไว้ใน .env ด้วยเพื่อให้แก้ไขง่ายขึ้น
=============================================================================
"""
#ไฟล์นี้คือ API Router ที่จะรอรับ Username / Password จากหน้าเว็บ 
# สังเกตว่าโค้ดจะสั้นและสะอาดมาก เพราะเรายกของยากๆ ไปไว้ในไฟล์ auth_utils.py หมดแล้ว
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone

# load_dotenv()

# 🔑 กุญแจลับสำหรับแกะ Token (ของจริงควรเอาไปซ่อนในไฟล์ .env)
SECRET_KEY = os.getenv("SECRET_KEY", "sams_secret_key_minimalist_super_safe") 
ALGORITHM = "HS256"

# ⚠️ เวลาดึงตัวเลขจาก .env มันจะมาเป็นข้อความ (String) เลยต้องครอบด้วย int() ก่อนครับ
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 120))

# ตั้งค่าระบบเข้ารหัสแบบ bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 1. ฟังก์ชันเช็กรหัสผ่าน (เทียบรหัสที่พิมพ์มา กับรหัสในฐานข้อมูล)
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 2. ฟังก์ชันเข้ารหัสผ่าน (แปลง '1234' เป็นตัวอักษรมั่วๆ ก่อนลง Database)
def get_password_hash(password):
    return pwd_context.hash(password)

# 3. ฟังก์ชันสร้างบัตรผ่าน (JWT Token)
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # เสกข้อมูลทั้งหมดรวมกันเป็น String ยาวๆ ด้วยกุญแจลับ
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt