"""
=============================================================================
📝 รีวิวโค้ดโดย Antigravity (Code Review)
ไฟล์: backend/routers/admin_requests.py
หน้าที่: จัดการการอนุมัติ/ปฏิเสธ ใบเบิกวัสดุ (สำหรับ Admin)

✅ สิ่งที่เขียนได้ดี:
- **สุดยอดมาก!** มีการจัดการ Database Transaction ด้วย `Try/Except` และ `db.rollback()` ได้อย่างถูกต้อง เพราะตอนกดอนุมัติมีการอัปเดตถึง 4 ตารางพร้อมกัน ถ้ามีอันไหนพังก็จะได้คืนค่าป้องกันข้อมูลเละ
- เขียน Logic ตัดสต็อก จ่ายของ และเก็บประวัติ Audit Log เรียงลำดับได้ดีและรัดกุมมากครับ

💪 สรุป: ไฟล์นี้แสดงถึงความเข้าใจในการออกแบบระบบคลังสินค้าที่ยอดเยี่ยมครับ
=============================================================================
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from backend.database import get_db
from backend.models.users import User
from backend.models.request import MaterialReq, MaterialReqDetail, MaterialReserved, MaterialIssue, MaterialHistory
from backend.login.dependencies import verify_admin

router = APIRouter(prefix="/admin/requests", tags=["Admin Approvals"])

# ---------------------------------------------------------
# 🔵 API: ดึงรายการใบเบิกที่ "รออนุมัติ" (Pending Requests)
# ---------------------------------------------------------
@router.get("/pending")
def get_pending_requests(
    db: Session = Depends(get_db),
    admin_user: dict = Depends(verify_admin) # 🕵️‍♂️ ยามเช็กว่าต้องเป็น Admin เท่านั้น!
):
    # ดึงเฉพาะใบที่สถานะ PENDING เรียงตามคิว (เก่าไปใหม่)
    requests = db.query(MaterialReq)\
        .filter(MaterialReq.req_status == "PENDING")\
        .order_by(MaterialReq.req_date.asc())\
        .all()
    return requests

# ---------------------------------------------------------
# 🟢 API: แอดมิน "อนุมัติ" ใบเบิกและตัดสต็อก (Approve)
# ---------------------------------------------------------
@router.post("/{mat_req_id}/approve")
def approve_request(
    mat_req_id: int,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(verify_admin) 
):
    # 1. ค้นหาข้อมูลแอดมินที่กำลังกดอนุมัติ (เพื่อเอา user_id ไปบันทึกว่าใครเป็นคนจ่ายของ)
    admin = db.query(User).filter(User.emp_code == admin_user["emp_code"]).first()

    # 2. ค้นหาใบเบิกที่ต้องการ
    req = db.query(MaterialReq).filter(MaterialReq.mat_req_id == mat_req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="ไม่พบใบเบิกนี้ในระบบ")
    if req.req_status != "PENDING":
        raise HTTPException(status_code=400, detail="ใบเบิกนี้ถูกดำเนินการไปแล้ว (ไม่ใช่สถานะรออนุมัติ)")

    try:
        # 3. เปลี่ยนสถานะใบเบิกเป็น "อนุมัติแล้ว"
        req.req_status = "APPROVED"

        # 4. ดึงรายการวัสดุทั้งหมดในใบเบิกนี้มาจัดการทีละชิ้น
        details = db.query(MaterialReqDetail).filter(MaterialReqDetail.mat_req_id == mat_req_id).all()
        
        for detail in details:
            detail.approve_qty = detail.req_qty

            # 4.1 ค้นหาข้อมูลการจอง แล้วเปลี่ยนสถานะเป็น "จ่ายแล้ว"
            reserved = db.query(MaterialReserved).filter(
                MaterialReserved.req_id == mat_req_id,
                MaterialReserved.mat_id == detail.mat_id
            ).first()
            if reserved:
                reserved.status = "ISSUED"

            # 4.2 สร้างเอกสารการจ่ายของ (Issue) ว่าใครเป็นคนจ่าย
            new_issue = MaterialIssue(
                mat_id=detail.mat_id,
                quantity=detail.approve_qty,
                issued_by=admin.user_id, 
                mat_req_id=mat_req_id,
                status="ISSUED"
            )
            db.add(new_issue)

            # 4.3 จดบันทึกประวัติ (Audit Log) ว่ามีการนำของ "ออก (OUT)" 
            new_history = MaterialHistory(
                mat_id=detail.mat_id,
                action_type="OUT",
                quantity=detail.approve_qty,
                balance_after=0, # ปล่อยเป็น 0 ไว้ให้ Database Trigger คำนวณสต็อกใส่ทับทีหลัง
                ref_table="material_req",
                ref_id=mat_req_id
            )
            db.add(new_history)

        # 5. สั่ง Save ทุกอย่างพร้อมกัน (Transaction)
        db.commit()
        return {"message": "✅ อนุมัติใบเบิกเรียบร้อยแล้ว", "req_code": req.mat_req_code}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"ไม่สามารถอนุมัติได้: {str(e)}")


# ---------------------------------------------------------
# 🔴 API: แอดมิน "ไม่อนุมัติ/ยกเลิก" ใบเบิก (Reject Request)
# ---------------------------------------------------------
@router.post("/{mat_req_id}/reject")
def reject_request(
    mat_req_id: int,
    db: Session = Depends(get_db),
    admin_user: dict = Depends(verify_admin)
):
    # 1. หาใบเบิก
    req = db.query(MaterialReq).filter(MaterialReq.mat_req_id == mat_req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="ไม่พบใบเบิกนี้")
    if req.req_status != "PENDING":
        raise HTTPException(status_code=400, detail="ไม่สามารถยกเลิกได้ เพราะใบเบิกนี้ถูกดำเนินการไปแล้ว")

    try:
        # 2. เปลี่ยนสถานะใบเบิกเป็น REJECTED
        req.req_status = "REJECTED"

        # 3. ♻️ คืนของที่จองไว้กลับเข้าคลัง! (เปลี่ยนสถานะ RESERVED เป็น CANCELLED)
        reserved_items = db.query(MaterialReserved).filter(MaterialReserved.req_id == mat_req_id).all()
        for item in reserved_items:
            item.status = "CANCELLED" 

        db.commit()
        return {"message": "❌ ปฏิเสธและยกเลิกใบเบิกเรียบร้อยแล้ว", "req_code": req.mat_req_code}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาด: {str(e)}")