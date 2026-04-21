"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/database.py
หน้าที่: จัดการการเชื่อมต่อฐานข้อมูล SQLAlchemy

✅ สิ่งที่เขียนได้ดี:
- มีการใช้ `pool_size`, `max_overflow` และ `pool_pre_ping` ถือเป็นการตั้งค่าสำหรับ Production ที่ดีเยี่ยม ช่วยป้องกันปัญหา Database Connection ขาดหรือเต็มได้
- ใช้ `.env` สำหรับซ่อน URL Database ถูกต้องตามหลัก Security

⚠️ ข้อแนะนำเพิ่มเติม:
- ถ้า `DATABASE_URL` หาไม่เจอใน `.env` ตัว `create_engine` จะพังทันที 
  อาจเสริม `if not SQLALCHEMY_DATABASE_URL: raise ValueError("ไม่พบ DATABASE_URL ใน .env")` เพื่อให้รู้สาเหตุไวขึ้น
=============================================================================
"""
import os 
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()