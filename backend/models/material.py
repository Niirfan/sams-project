"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/models/material.py
หน้าที่: โครงสร้างตารางจัดการข้อมูลวัสดุและสต็อกคงเหลือ

✅ สิ่งที่เขียนได้ดี:
- มีการรวมทั้งข้อมูลพื้นฐานของวัสดุ (หน่วย, ราคา, การเตือนสต็อกขั้นต่ำ) ไว้ชัดเจน รองรับการเติบโตอารมณ์คล้ายๆ ERP ได้เลย
- ใช้ `Numeric(10, 2)` สำหรับเก็บราคา ช่วยให้เก็บจุดทศนิยมของราคาได้เป๊ะมากๆ ป้องกันปัญหาบัญชีคลาดเคลื่อน
=============================================================================
"""
#กลุ่มข้อมูลวัสดุและสต็อกสำหรับจัดการตัววัสดุและประวัติการรับเข้า
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Numeric, ForeignKey
from backend.database import Base
from datetime import datetime

class Material(Base):
    __tablename__ = "sams_material"
    mat_id = Column(Integer, primary_key=True)
    mat_code = Column(String(10), unique=True)
    mat_name = Column(String(50), nullable=False)
    mat_type_id = Column(Integer, ForeignKey("material_type.mat_type_id")) # [cite: 353]
    unit_pack = Column(String(20)) # หน่วยบรรจุ เช่น กล่อง [cite: 353]
    qty_per_pack = Column(Integer)
    unit_sub = Column(String(20)) # หน่วยย่อย เช่น ชิ้น [cite: 353]
    price_per_pack = Column(Integer)
    is_active = Column(Boolean, default=True)
    min_qty = Column(Integer, default=10) # จำนวนขั้นต่ำเพื่อแจ้งเตือน [cite: 353]

class MaterialStock(Base):
    __tablename__ = "material_stock"
    stock_id = Column(Integer, primary_key=True)
    mat_id = Column(Integer, ForeignKey("sams_material.mat_id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2))
    import_date = Column(DateTime, default=datetime.utcnow) # วันที่นำเข้า [cite: 357]