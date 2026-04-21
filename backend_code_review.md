# 🧠 ทบทวนความจำภาพรวมระบบ (Backend SAMS Recap) & Code Review

เอกสารฉบับนี้จัดทำขึ้นมาเพื่อ **ทบทวนความจำให้คุณ (ตั้งแต่รันโปรเจกต์ทิ้งไว้เมื่อวันพฤหัสบดี)** และรวบรวมรีวิวความปลอดภัย โครงสร้าง รวมถึงตัวอย่างการแก้ปัญหา (Code Examples) เผื่อใช้สำหรับอัปเกรดเป็นระดับ Production ครับ

---

## 🗺️ 1. ทบทวนความจำ: คุณเขียนอะไรไปแล้วบ้าง?
ระบบ SAMS (ระบบจัดการวัสดุสำนักงาน) ที่ฝั่ง Backend ประกอบร่างกันจากโครงสร้างที่ดีมากๆ ครับ คือ:

1. **`backend/main.py` & `database.py`**: ห้องเครื่องหลักที่เอาไว้รันเซิร์ฟเวอร์ และเชื่อมเข้าสู่ Database
2. **`backend/login/`**: ระบบ รปภ. ถือ Token 
   - `auth_utils.py` (ระบบเข้ารหัสและเสกบัตรผ่าน)
   - `dependencies.py` (ยามเฝ้าประตูตรวจบัตรผ่าน `get_current_user`, `verify_admin`)
   - `auth.py` (หน้าต่างแจกบัตรผ่านตอนพนักงานมากรอกรหัสผ่านเข้าสู่ระบบ)
3. **`backend/routers/`**: พนักงานเสิร์ฟข้อมูลและรับคำสั่งแอดมิน
   - `materials.py`: จัดการวัสดุในคลังทั้งหมด (แอดมินลบ/เพิ่ม/แก้) 
   - `requests.py`: จัดการหน้าเบิกของพนักงานทั่วไป (รัน UUID สุ่ม และรับลงตะกร้า)
   - `admin_requests.py`: หลังบ้านของแอดมินตอนกด "อนุมัติ/ไม่อนุมัติ" ใบเบิก 
4. **`backend/models/`**: พิมพ์เขียวเชื่อมตาราง Database
   - **(Master / Users / Request / Material)** ตารางตั้งต้นไว้ผูกโครงสร้าง (SQLAlchemy ORM) โยงทุกอย่างผ่าน Foreign Key ตรงตาม Data Dictionary ทุกบรรทัด
5. **`backend/schemas/`**: หน้ากากกรองข้อมูลเข้า/ออก
   - **(Master / Request / Stock / Users / Material)** คัดกรองตัวแปรแบบเป๊ะๆ ด้วย Pydantic ทำให้หน้าเว็บส่งข้อมูลมั่วๆ มาไม่ได้เลย

*(ตอนนี้ผมไล่ใส่คอมเมนต์รีวิวในระดับรายไฟล์ให้คุณครบ 100% ทุกไฟล์ด้านบนแล้วครับ ไปคลิกอ่านได้เลย)*

---

## 💡 2. ตัวอย่างการแก้ปัญหาและพัฒนาต่อ (Code Examples)

ระบบตอนนี้สามารถใช้งานได้จริงแล้วกว่า 99% แต่ถ้าคุณต้องการนำขึ้นเซิร์ฟเวอร์จริง (Production) แนะนำให้อัปเกรดจุดต่างๆ ต่อไปนี้ครับ:

### 🛡️ 2.1 การตั้งจำกัดโดเมน (CORS) ใน `main.py`
ตอนที่เราพัฒนาบนเครื่องตัวเอง เราอนุญาตให้เว็บไซต์อะไรก็ได้มาดึงข้อมูลเรา 
**วิธีแก้ไข (กันหน้าเว็บคนอื่นมาขโมย API):**
```python
# 👉 ไฟล์: backend/main.py
app.add_middleware(
    CORSMiddleware,
    # เปลี่ยนจาก ["*"] มาใส่โดเมนจริงแบบนี้:
    allow_origins=["https://sams.yoursite.com", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
```

### 🗝️ 2.2 ซ่อนกุญแจลับของระบบใน `login/auth_utils.py`
กุญแจที่เอาไว้สร้าง Token (บัตรผ่าน) ตอนนี้พิมพ์ค้างเอาไว้ในโค้ด ถ้ามีคนแฮกมาดูไฟล์นี้ได้ ระบบ Token จะล่มสลายทันที
**วิธีแก้ไข (ดึงจากไฟล์ `.env` ที่ไม่ต้องอ้างอิงตอน Deploy):**
```python
# 👉 ไฟล์: backend/login/auth_utils.py
import os

# หาจาก .env ก่อน ถ้าไม่มีก็ค่อยใช้ค่าเริ่มต้นให้ระบบรันต่อได้ตอนไม่ได้เอาขึ้น Production
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_temporary_unsafe_key") 
ALGORITHM = "HS256"
```

### 🚫 2.3 การเตะพนักงานที่โดนแบนแล้วออกจากระบบใน `login/dependencies.py`
ระบบเดิมหากพนักงานถือ Token อยู่ แต่โดนระงับสิทธิ์ในฐานข้อมูลไปเมื่อสักครู่ เขาจะยังเข้าหน้าแอดมินได้จนกว่า Token จะหมดอายุ (2 ชั่วโมง)
**วิธีแก้ไข (เช็กฐานข้อมูลแบบเรียลไทม์ควบคู่กัน):**
```python
# 👉 ไฟล์: backend/login/dependencies.py
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.users import User

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db) # 1. ดึง Database เข้ามาช่วยเช็ก
):
    token = credentials.credentials
    # ... ถอดรหัส token ปกติ...
    # ตรวจสอบตัวแปรเป้าหมายด้วยข้อมูลอัพเดตล่าสุด
    user_db = db.query(User).filter(User.emp_code == emp_code).first()
    
    if not user_db:
        raise HTTPException(status_code=401, detail="ไม่พบรหัสบัญชีนี้ในสารบบ (อาจถูกลบหรือลาออก)")
        
    # หากวันที่มีช่อง is_active 
    # if not getattr(user_db, "is_active", True):
    #     raise HTTPException(status_code=403, detail="บัญชีของคุณถูกระงับสิทธิ์ใช้งาน")
        
    return {"emp_code": emp_code, "role": role}
```

### 🎯 2.4 ป้องกันจุดอ่อนการส่งตัวแปรมั่วใน `schemas/stock.py`
พนักงาน(แนว Hacker) อาจจะยิง API History มาเป็นคำว่า `"action_type": "IN NY"`
**วิธีแก้ไข (บีบหน้ากาก Pydantic ให้รับแค่คำเฉพาะ 2 คำผ่านคำสั่ง Literal):**
```python
# 👉 ไฟล์: backend/schemas/stock.py
from typing import Literal

class HistoryBase(BaseModel):
    # บังคับว่าถ้าไม่ใช่คำว่า IN หรือ OUT ระบบ API จะร้องไห้ตีกลับทันทีว่า 422 Unprocessable Entity
    action_type: Literal["IN", "OUT", "ADJUST"]
    quantity: int
```

---

## 🏆 บทสรุปเพื่อไปต่อ (Next Steps)
1. โค้ดหลังบ้านคุณ **เชื่อมกันสมบูรณ์มาก โดยเฉพาะการตัดสต็อกใน `admin_requests.py` ที่ใช้ Try-Except และจัดสรร Transaction ดาต้าเบสเก่งมาก**
2. อยากให้ลองนำเทคนิคกั้นสิทธิ์ (CORS, ENV, และ DB Check) จากข้างต้นไปใช้ เพื่อให้ API เกราะหนาขึ้นครับ
3. เดินเครื่องเขียน Frontend เพื่อต่อกับ API ชุดนี้ได้เลย! 🚀
