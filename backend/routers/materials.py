"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/routers/materials.py
หน้าที่: API จัดการระบบวัสดุ (CRUD Operations)

✅ สิ่งที่เขียนได้ดี:
- โค้ดส่วนดึงข้อมูล (`get_materials`) มีการกรองเฉพาะ `is_active == True` เป็นการทำ Soft Delete ที่ถูกต้อง
- การสร้างข้อมูลใหม่มีการใช้ `**material.model_dump()` ช่วยให้ไม่ต้องมา Map ตัวแปรทีละตัว โค้ดจึงสะอาด
- การอัปเดตข้อมูลใช้ `setattr()` ในการวนลูป ถือเป็นท่ายากที่เขียนได้ฉลาดและกระชับบรรทัดได้มากครับ
=============================================================================
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.models.material import Material
from backend.schemas.material import MaterialCreate, MaterialResponse
from backend.login.dependencies import get_current_user, verify_admin

# สร้าง Router (พนักงานรับออเดอร์) ประจำแผนกวัสดุ
router = APIRouter(prefix="/materials", tags=["Materials"])

# ---------------------------------------------------------
# 🟢 1. API: ดูรายชื่อวัสดุทั้งหมด (เข้าได้ทั้ง User และ Admin)
# ---------------------------------------------------------
@router.get("/", response_model=List[MaterialResponse])
def get_materials(
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user) # 👮‍♂️ ยามคนที่ 1 (เช็กแค่ว่าล็อกอินแล้ว)
):
    # ดึงเฉพาะวัสดุที่ยังเปิดใช้งานอยู่ (is_active == True)
    materials = db.query(Material).filter(Material.is_active == True).all()
    return materials


# ---------------------------------------------------------
# 🔴 2. API: เพิ่มวัสดุใหม่ (เข้าได้เฉพาะ Admin เท่านั้น!)
# ---------------------------------------------------------
@router.post("/", response_model=MaterialResponse)
def create_material(
    material: MaterialCreate, # รับข้อมูลหน้ากากตอนสร้าง
    db: Session = Depends(get_db),
    admin_user: dict = Depends(verify_admin) # 🕵️‍♂️ ยามคนที่ 2 (เช็กว่าเป็น Admin ไหม)
):
    # 2.1 ตรวจสอบก่อนว่า "รหัสวัสดุ" (mat_code) ซ้ำกับในระบบไหม?
    existing_mat = db.query(Material).filter(Material.mat_code == material.mat_code).first()
    if existing_mat:
        raise HTTPException(status_code=400, detail="รหัสวัสดุนี้มีในระบบแล้ว ไม่สามารถเพิ่มซ้ำได้")

    # 2.2 แปลงข้อมูลจาก Pydantic Schema ให้กลายเป็น SQLAlchemy Model
    # ทริค: **material.model_dump() เป็นการแตกข้อมูล JSON ออกมาใส่ Model อัตโนมัติ (ไม่ต้องพิมพ์จับคู่ทีละบรรทัด)
    new_material = Material(**material.model_dump())
    
    # 2.3 บันทึกลงฐานข้อมูล
    db.add(new_material)
    db.commit()
    db.refresh(new_material) # ดึงข้อมูลล่าสุด (เช่น mat_id ที่เพิ่งถูกสร้าง) กลับมา
    
    return new_material

    # ---------------------------------------------------------
# 🟡 3. API: แก้ไขข้อมูลวัสดุ (เข้าได้เฉพาะ Admin)
# ---------------------------------------------------------
@router.put("/{mat_id}", response_model=MaterialResponse)
def update_material(
    mat_id: int, 
    material_update: MaterialCreate, # ใช้หน้ากากเดิมรับข้อมูลที่แก้แล้ว
    db: Session = Depends(get_db),
    admin_user: dict = Depends(verify_admin) # 🕵️‍♂️ ยามเช็กว่าเป็น Admin
):
    # 3.1 ค้นหาวัสดุที่ต้องการแก้
    db_material = db.query(Material).filter(Material.mat_id == mat_id).first()
    if not db_material:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลวัสดุที่ต้องการแก้ไข")

    # 3.2 เอาข้อมูลใหม่มาทับข้อมูลเดิม
    update_data = material_update.model_dump()
    for key, value in update_data.items():
        setattr(db_material, key, value) # อัปเดตทีละฟิลด์

    # 3.3 บันทึกการเปลี่ยนแปลง
    db.commit()
    db.refresh(db_material)
    return db_material


# ---------------------------------------------------------
# 🔴 4. API: ลบวัสดุ (Soft Delete - เข้าได้เฉพาะ Admin)
# ---------------------------------------------------------
@router.delete("/{mat_id}")
def delete_material(
    mat_id: int,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(verify_admin) # 🕵️‍♂️ ยามเช็กว่าเป็น Admin
):
    # 4.1 ค้นหาวัสดุที่ต้องการลบ
    db_material = db.query(Material).filter(Material.mat_id == mat_id).first()
    if not db_material:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลวัสดุที่ต้องการลบ")

    # 4.2 ทำการ "ลบหลอกๆ" (Soft Delete) โดยเปลี่ยนสถานะเป็น False
    db_material.is_active = False
    db.commit()
    
    return {"message": f"ระงับการใช้งานวัสดุรหัส {db_material.mat_code} เรียบร้อยแล้ว"}