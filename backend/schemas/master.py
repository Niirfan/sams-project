"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/schemas/master.py
หน้าที่: โครงสร้างตรวจสอบข้อมูลสำหรับ สาขา และ ประเภทวัสดุ

✅ สิ่งที่เขียนได้ดี:
- โครงสร้างเรียบง่าย กระชับ เหมาะกับการดึงไปทำ Dropdown ตัวเลือกบนหน้าเว็บครับ 
- แบ่ง Schema ให้รองรับเวลาดึงข้อมูลไปโชว์ (Response) และสร้างข้อมูลใหม่ (Create) ออกจากกันตามมาตรฐานที่ควรจะเป็น
=============================================================================
"""
#ไฟล์นี้จะจัดการข้อมูล สาขา และ ประเภทวัสดุ (ข้อมูลพวกนี้มักจะมีแค่ให้ดึงไปแสดงผล)
from pydantic import BaseModel, ConfigDict
from typing import Optional

# --- สาขา (Branch) ---
class BranchBase(BaseModel):
    branch_id: str
    branch_name: str

class BranchResponse(BranchBase):
    model_config = ConfigDict(from_attributes=True)

# --- ประเภทวัสดุ (Material Type) ---
class MaterialTypeBase(BaseModel):
    mat_type_name: str

class MaterialTypeCreate(MaterialTypeBase):
    pass

class MaterialTypeResponse(MaterialTypeBase):
    mat_type_id: int
    model_config = ConfigDict(from_attributes=True)