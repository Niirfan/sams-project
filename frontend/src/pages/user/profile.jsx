import React, { useState, useRef ,useEffect} from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";

export default function ProfilePage() {

  // ================== STATE ==================
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const fileInputRef = useRef(null);

  // ================== LOAD USER FROM BACKEND ==================
  useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    alert("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
    return;
  }

  const user = JSON.parse(storedUser);

  fetch(`http://127.0.0.1:8000/users?emp_code=${user.emp_code}`)
    .then(res => res.json())
    .then(data => {

      console.log("PROFILE DATA:", JSON.stringify(data, null, 2));

      setUserData({
        name: data.full_name,
        position: data.position,
        branch: data.branch_id,
        employeeId: data.emp_code,
        phone: data.phone,
        email: data.email,
      });

    })
    .catch(err => {
      console.error(err);
      alert("โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
    });

}, []);

  // ================== IMAGE ==================
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // ================== LOADING ==================
  if (!userData) {
    return <div className="p-10">กำลังโหลดข้อมูลผู้ใช้...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        
        {/* --- Header Section --- */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-black text-white flex items-center justify-center shadow-md">
            <FaUserCircle size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">บัญชีของฉัน</h1>
            <p className="text-xs text-gray-500 mt-0.5">ข้อมูลบัญชีและการตั้งค่า</p>
          </div>
        </div>

        {/* --- Main Content Section --- */}
        <div className="rounded-3xl bg-white p-12 shadow-sm border border-gray-50 flex flex-col items-center">
          
          {/* ส่วนรูปโปรไฟล์ */}
          <div className="relative mb-4">
            <div className="h-40 w-40 rounded-full border-4 border-[#72C1D1] p-1 overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="h-full w-full rounded-full object-cover" />
              ) : (
                <FaUserCircle className="h-full w-full text-gray-300" />
              )}
            </div>
          </div>

          {/* ช่องเลือกไฟล์ที่ซ่อนไว้ */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={triggerFileInput}
            className="text-[#8BC34A] font-bold text-sm mb-12 hover:underline"
          >
            แก้ไขโปรไฟล์
          </button>

          {/* ส่วนข้อมูลรายละเอียด */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            
            {/* ข้อมูลผู้ใช้ */}
            {/* <div className="rounded-2xl bg-gray-50/50 p-8 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-6 border-b pb-2 inline-block border-black text-left">ข้อมูลผู้ใช้</h2>
              <div className="space-y-4"> */}
            <InfoBox title="ข้อมูลผู้ใช้">
              <InfoItem label="ชื่อ-นามสกุล" value={userData.name} />
              <InfoItem label="ตำแหน่ง" value={userData.position} />
              <InfoItem label="สาขา" value={userData.branch} />
              <InfoItem label="รหัสพนักงาน" value={userData.employeeId} />
            </InfoBox>
              
            <InfoBox title="ข้อมูลติดต่อ">
              <InfoItem label="เบอร์โทรศัพท์" value={userData.phone} />
              <InfoItem label="อีเมล" value={userData.email} />
            </InfoBox>
            
          </div>
        </div>
      </div>
    </div>
  );
}

// ================== COMPONENTS ==================
function InfoBox({ title, children }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-8 border">
      <h2 className="font-bold mb-6 border-b pb-2">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between text-sm border-b pb-2">
      <span className="text-gray-500">{label} :</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
