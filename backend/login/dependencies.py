"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/login/dependencies.py
หน้าที่: เป็นชั้นคัดกรอง (Middleware) หรืองานยามรักษาความปลอดภัย เช็กสิทธิ์ก่อนเข้าใช้งาน API

🌟 [อัปเดตล่าสุด]: คุณได้แก้ไข `get_current_user` ให้วิ่งไปเช็ก Database สดๆ เพื่อดักจับ `user_db.is_active` ได้สำเร็จแล้ว! 
โค้ดตอนนี้มีความปลอดภัยระดับสูง สามารถเตะพนักงานที่โดนระงับสิทธิ์ออกจากระบบได้ทันที ยอดเยี่ยมมากครับ!
=============================================================================
"""

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.users import User
from backend.login.auth_utils import SECRET_KEY, ALGORITHM

# 👮‍♂️ เปลี่ยนระบบยาม ให้รับบัตรผ่าน (Token) ตรงๆ ด้วย HTTPBearer
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials # ดึง Token ออกมาจาก Header
    try:
        # ลองแกะข้อมูลจากบัตรผ่าน
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        emp_code: str = payload.get("sub")
        role: str = payload.get("role")
        
        if emp_code is None:
            raise HTTPException(status_code=401, detail="บัตรผ่านไม่ถูกต้อง")

        # 🟢 วิ่งไปเช็กใน Database สดๆ ว่าบัญชีนี้ยังมีตัวตนอยู่ไหม
        user_db = db.query(User).filter(User.emp_code == emp_code).first()
        if not user_db:
            raise HTTPException(status_code=401, detail="ไม่พบรหัสบัญชีนี้ในสารบบ (อาจถูกลบหรือลาออก)")
            
        # 🟢 เอาเครื่องหมาย # ออกจาก 2 บรรทัดนี้ครับ
        if not getattr(user_db, "is_active", True):
             raise HTTPException(status_code=403, detail="บัญชีของคุณถูกระงับสิทธิ์ใช้งาน")

        
        return {"emp_code": emp_code, "role": role}
        
    except JWTError:
        raise HTTPException(status_code=401, detail="บัตรผ่านหมดอายุหรือปลอมแปลง")

# 🕵️‍♂️ ยามคนที่ 2: ตรวจว่าเป็นแอดมินไหม
def verify_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["Admin", "Superadmin"]:
        raise HTTPException(status_code=403, detail="คุณไม่มีสิทธิ์เข้าถึง! (เฉพาะผู้ดูแลระบบเท่านั้น)")
    return current_user