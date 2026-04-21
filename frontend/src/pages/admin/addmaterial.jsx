import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AddMaterial() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [materialTypes, setMaterialTypes] = useState([]);

  const [formData, setFormData] = useState({
    mat_code: "",
    mat_name: "",
    mat_type_id: "",
    unit_pack: "",
    qty_per_pack: "",
    unit_sub: "",
    price_per_pack: "",
    stock_qty: ""
  });

  useEffect(() => {
    loadMaterialTypes();
  }, []);

  const loadMaterialTypes = async () => {
    try {
      const res = await api.get("/material-type");
      setMaterialTypes(res.data);
    } catch (err) {
      console.error(err);
      alert("โหลดประเภทวัสดุไม่สำเร็จ");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      mat_code: formData.mat_code.trim(),
      mat_name: formData.mat_name.trim(),
      mat_type_id: Number(formData.mat_type_id),
      unit_pack: formData.unit_pack.trim(),
      qty_per_pack: Number(formData.qty_per_pack),
      unit_sub: formData.unit_sub.trim(),
      price_per_pack: Number(formData.price_per_pack)
    };

    if (!payload.mat_code || !payload.mat_name || !payload.mat_type_id) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      setLoading(true);

      // create material (master data only)
      await api.post("/materials", payload);

      alert("เพิ่มวัสดุสำเร็จ");
      navigate("/admin/materials", { replace: true });

    } catch (err) {
      console.error(err);
      alert("เพิ่มข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
    };


  return (
    /* เปลี่ยนจาก h-full เป็น min-h-screen และเอา overflow-hidden ออกเพื่อให้เลื่อนได้ */
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      
      {/* Container สำหรับการ์ดสีขาวที่รวมทุกอย่างไว้ข้างในตามรูป */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 max-w-[95%] mx-auto">
        
        {/* Header ส่วนหัว - ย้ายเข้ามาอยู่ในการ์ดสีขาวแล้ว */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-black p-3 rounded-xl text-white shadow-lg">
            <FaHome size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">เพิ่มรายการวัสดุสำนักงาน</h1>
            <p className="text-sm text-gray-500">เพิ่มและแก้ไขข้อมูลวัสดุสำนักงาน</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* แถว: รหัสวัสดุ */}
          <div className="max-w-4xl">
            <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">รหัสวัสดุ</label>
            <input 
              type="text"
              name="mat_code"
              placeholder="กรอกรหัสวัสดุ"
              value={formData.mat_code}
              onChange={handleChange}
              className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-blue-400 outline-none transition-all text-sm placeholder:text-gray-300"
            />
          </div>

          {/* แถว: ชื่อวัสดุ */}
          <div className="max-w-4xl">
            <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">ชื่อวัสดุ</label>
            <input
              type="text"
              name="mat_name"
              placeholder="กรอกชื่อวัสดุ"
              value={formData.mat_name}
              onChange={handleChange}
              className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-blue-400 outline-none transition-all text-sm placeholder:text-gray-300"
            />
          </div>

          {/* แถว: ประเภทวัสดุ */}
          <div className="relative max-w-4xl">
            <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">
              ประเภทวัสดุ
            </label>

            <div className="relative">
              <select
                name="mat_type_id"
                value={formData.mat_type_id}
                onChange={handleChange}
                required
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100
                          focus:bg-white focus:border-blue-400 outline-none appearance-none cursor-pointer transition-all text-sm placeholder:text-gray-300"      
              >
                <option value="" disabled hidden>
                  เลือกประเภท
                </option>

                {materialTypes.map((type) => (
                  <option
                    key={type.mat_type_id}
                    value={type.mat_type_id}
                  >
                    {type.mat_type_name}
                  </option>
                ))}
              </select>

              <HiChevronDown
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>


          {/* แถว 3 ช่อง: หน่วย, หน่วยละ, หน่วยนับ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">หน่วย</label>
              <input
                type="text"
                name="unit_pack"
                placeholder="กรอกหน่วย"
                value={formData.unit_pack}
                onChange={handleChange}
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-blue-400 outline-none transition-all text-sm placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">หน่วยละ</label>
              <input
                type="number"
                name="qty_per_pack"
                placeholder="กรอกหน่วยละ"
                value={formData.qty_per_pack}
                onChange={handleChange}
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-blue-400 outline-none transition-all text-sm placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">หน่วยนับ</label>
              <input
                type="text"
                name="unit_sub"
                placeholder="กรอกหน่วยนับ"
                value={formData.unit_sub}
                onChange={handleChange}
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-blue-400 outline-none transition-all text-sm placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* แถว 2 ช่อง: ราคาหน่วยละ, จำนวนที่นำเข้า */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">ราคาหน่วยละ</label>
              <input
                type="number"
                name="price_per_pack"
                placeholder="กรอกราคาหน่วยละ"
                value={formData.price_per_pack}
                onChange={handleChange}
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-blue-400 outline-none transition-all text-sm placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">จำนวนที่นำเข้า</label>
              <input
                type="number"
                name="stock_qty"
                placeholder="กรอกจำนวนที่นำเข้า"
                value={formData.stock_qty}
                onChange={handleChange}
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-blue-400 outline-none transition-all text-sm placeholder:text-gray-300"
              />
            </div>
          </div>
          
          {/* ปุ่มกดยืนยัน */}
          <div className="flex items-center gap-4 pt-6">
            <button
              type="submit"
              className="px-10 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-md active:scale-95"
            >
              บันทึกข้อมูล
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-10 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              ย้อนกลับ
            </button>
          </div>
        </form>
      </div>
    </div>
);
}