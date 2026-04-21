"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/routers/requests.py
หน้าที่: API สำหรับให้พนักงานทั่วไปสร้างใบเบิก และดูประวัติของตัวเอง

✅ สิ่งที่เขียนได้ดี:
- ใช้ `uuid4()` มาช่วยรันรหัสใบเบิกแบบสุ่ม (`mat_req_code`) ป้องกันรหัสซ้ำได้ดี
- รู้จักการใช้ `db.flush()` เพื่อดึงรหัสใบเบิกที่เพิ่งสร้างเอาไปให้รายการย่อย (`mat_req_id`) ก่อนการ `commit()` เทคนิคระดับสูง!
- มีการตรวจเช็กสิทธิ์ `if req.user_id != ...` ช่วยป้องกันปัญหาข้อมูลรั่วไหลระหว่างพนักงานได้อย่างรัดกุม 
=============================================================================
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from backend.database import get_db
from backend.models.request import MaterialReq, MaterialReqDetail, MaterialReserved
from backend.schemas.request import RequestCreate, RequestResponse
from backend.login.dependencies import get_current_user

router = APIRouter(prefix="/requests", tags=["Material Requests"])

# ---------------------------------------------------------
# 🟢 API: สร้างใบเบิกวัสดุ (สำหรับพนักงานทั่วไป)
# ---------------------------------------------------------
@router.post("/", response_model=RequestResponse)
def create_material_request(
    request_data: RequestCreate, # รับข้อมูลตะกร้าสินค้าที่เป็น List (Array)
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) # 👮‍♂️ ยามเช็กว่าล็อกอินแล้ว
):
    # 1. สร้างรหัสใบเบิกแบบสุ่ม (เช่น REQ-12345...)
    unique_req_code = f"REQ-{str(uuid.uuid4())[:8].upper()}"

    # 2. สร้างหัวขั้วใบเบิก (Header)
    new_request = MaterialReq(
        mat_req_code=unique_req_code,
        user_id=current_user["emp_code"], # ดึงรหัสพนักงานจาก Token
        req_status="PENDING", # สถานะเริ่มต้นคือ "รออนุมัติ"
        total_price=0.0
    )
    
    db.add(new_request)
    db.flush() # บังคับให้ DB สร้าง mat_req_id ขึ้นมาก่อน

    try:
        # 3. วนลูปสร้างรายการย่อย (Detail) และ ทำการจอง (Reserved)
        for item in request_data.items:
            # 3.1 บันทึกว่าเบิกอะไรบ้าง
            new_detail = MaterialReqDetail(
                mat_req_id=new_request.mat_req_id,
                mat_id=item.mat_id,
                req_qty=item.req_qty,
                approve_qty=0
            )
            db.add(new_detail)

            # 3.2 บันทึกการจอง
            new_reserved = MaterialReserved(
                mat_id=item.mat_id,
                req_id=new_request.mat_req_id,
                quantity=item.req_qty,
                status="RESERVED"
            )
            db.add(new_reserved)

        # 4. ทุกอย่างสมบูรณ์แบบ กด Save
        db.commit()
        db.refresh(new_request)
        return new_request

    except Exception as e:
        db.rollback() 
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาดในการสร้างใบเบิก: {str(e)}")


# =========================================================
# 🆕 ส่วนที่เพิ่มใหม่ (ดึงประวัติการเบิก)
# =========================================================

# ---------------------------------------------------------
# 🟢 API: ดูประวัติการเบิกของตัวเอง (My Requests)
# ---------------------------------------------------------
@router.get("/mine")
def get_my_requests(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # ดึงเฉพาะใบเบิกที่ user_id ตรงกับคนที่ล็อกอินอยู่ เรียงจากใหม่ไปเก่า
    requests = db.query(MaterialReq)\
        .filter(MaterialReq.user_id == current_user["emp_code"])\
        .order_by(MaterialReq.req_date.desc())\
        .all()
    return requests

# ---------------------------------------------------------
# 🟢 API: ดูรายละเอียดใบเบิกแต่ละใบ (Request Detail)
# ---------------------------------------------------------
@router.get("/{req_id}")
def get_request_detail(
    req_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # 1. หาหัวขั้วใบเบิก
    req = db.query(MaterialReq).filter(MaterialReq.mat_req_id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="ไม่พบใบเบิกนี้")

    # 2. ป้องกันไม่ให้พนักงานแอบดูใบเบิกของคนอื่น (ยกเว้นแอดมินดูได้)
    if req.user_id != current_user["emp_code"] and current_user.get("role") not in ["Admin", "Superadmin"]:
        raise HTTPException(status_code=403, detail="คุณไม่มีสิทธิ์ดูใบเบิกของผู้อื่น")

    # 3. หารายการของที่เบิกในใบนั้น
    details = db.query(MaterialReqDetail).filter(MaterialReqDetail.mat_req_id == req_id).all()
    
    return {
        "header": req,
        "items": details
    }