import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import api from "../../services/api";

export default function EditMaterial() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [materialTypes, setMaterialTypes] = useState([]);

  const [formData, setFormData] = useState({
    mat_code: "",
    mat_name: "",
    mat_type_id: "",
    unit_pack: "",
    qty_per_pack: "",
    unit_sub: "",
    price_per_pack: ""
  });

  useEffect(() => {
    loadMaterialTypes();
  }, []);

  useEffect(() => {
    if (materialTypes.length > 0) {
      fetchMaterialDetail();
    }
  }, [materialTypes]);

  const loadMaterialTypes = async () => {
    try {
      const res = await api.get("/material-type");
      setMaterialTypes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMaterialDetail = async () => {
    try {
      const res = await api.get(`/materials/${id}`);
      console.log("material detail:", res.data);

      const d = res.data;

      setFormData({
        mat_code: d.mat_code ?? "",
        mat_name: d.mat_name ?? "",
        mat_type_id: String(d.mat_type_id ?? ""),
        unit_pack: d.unit_pack ?? "",
        qty_per_pack: d.qty_per_pack?.toString() ?? "",
        unit_sub: d.unit_sub ?? "",
        price_per_pack: d.price_per_pack?.toString() ?? ""
      });

      setLoading(false);

    } catch (err) {
      console.error(err);
      alert("โหลดข้อมูลไม่สำเร็จ");
      navigate("/admin/materials");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/materials/${id}`, {
        ...formData,
        mat_type_id: Number(formData.mat_type_id),
        qty_per_pack: Number(formData.qty_per_pack),
        price_per_pack: Number(formData.price_per_pack)
      });

      alert("บันทึกการแก้ไขสำเร็จ");
      navigate("/admin/materials");

    } catch (err) {
      console.error(err);
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  if (loading) return <div className="p-10">กำลังโหลดข้อมูล...</div>;

return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 max-w-[95%] mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-black p-3 rounded-xl text-white shadow-lg">
            <FaHome size={24} />
            </div>
            <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
                แก้ไขวัสดุสำนักงาน
            </h1>
            <p className="text-sm text-gray-500">
                แก้ไขข้อมูลวัสดุ
            </p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

            {/* รหัสวัสดุ */}
            <div className="max-w-4xl">
            <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">
                รหัสวัสดุ
            </label>
            <input
                type="text"
                name="mat_code"
                value={formData.mat_code}
                onChange={handleChange}
                placeholder="กรอกรหัสวัสดุ"
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 
                        focus:bg-white focus:border-blue-400 outline-none 
                        transition-all text-sm placeholder:text-gray-300"
            />
            </div>

            {/* ชื่อวัสดุ */}
            <div className="max-w-4xl">
            <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">
                ชื่อวัสดุ
            </label>
            <input
                type="text"
                name="mat_name"
                value={formData.mat_name}
                onChange={handleChange}
                placeholder="กรอกชื่อวัสดุ"
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 
                        focus:bg-white focus:border-blue-400 outline-none 
                        transition-all text-sm placeholder:text-gray-300"
            />
            </div>

            {/* ประเภทวัสดุ */}
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
                            focus:bg-white focus:border-blue-400 outline-none 
                            appearance-none cursor-pointer transition-all text-sm"
                >
                <option value="" disabled hidden>
                    เลือกประเภท
                </option>

                {materialTypes.map((t) => (
                    <option key={t.mat_type_id} value={t.mat_type_id}>
                    {t.mat_type_name}
                    </option>
                ))}
                </select>
            </div>
            </div>

            {/* 3 ช่อง: หน่วย */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div>
                <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">
                หน่วย
                </label>
                <input
                type="text"
                name="unit_pack"
                value={formData.unit_pack}
                onChange={handleChange}
                placeholder="กรอกหน่วย"
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 
                            focus:bg-white focus:border-blue-400 outline-none transition-all text-sm"
                />
            </div>

            <div>
                <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">
                หน่วยละ
                </label>
                <input
                type="number"
                name="qty_per_pack"
                value={formData.qty_per_pack}
                onChange={handleChange}
                placeholder="กรอกหน่วยละ"
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 
                            focus:bg-white focus:border-blue-400 outline-none transition-all text-sm"
                />
            </div>

            <div>
                <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">
                หน่วยนับ
                </label>
                <input
                type="text"
                name="unit_sub"
                value={formData.unit_sub}
                onChange={handleChange}
                placeholder="กรอกหน่วยนับ"
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 
                            focus:bg-white focus:border-blue-400 outline-none transition-all text-sm"
                />
            </div>
            </div>

            {/* 2 ช่อง */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div>
                <label className="block text-[14px] font-bold text-gray-900 mb-2 ml-1">
                ราคาหน่วยละ
                </label>
                <input
                type="number"
                name="price_per_pack"
                value={formData.price_per_pack}
                onChange={handleChange}
                placeholder="กรอกราคาหน่วยละ"
                className="w-full p-3 px-5 rounded-2xl bg-gray-50/50 border border-gray-100 
                            focus:bg-white focus:border-blue-400 outline-none transition-all text-sm"
                />
            </div>
            </div>

            {/* ปุ่ม */}
            <div className="flex items-center gap-4 pt-6">
            <button
                type="submit"
                className="px-10 py-3 bg-black text-white rounded-xl font-bold text-sm 
                        hover:bg-gray-800 transition-all shadow-md active:scale-95"
            >
                บันทึกข้อมูล
            </button>

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-10 py-3 bg-white text-gray-900 border border-gray-200 
                        rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
            >
                ย้อนกลับ
            </button>
            </div>

        </form>
        </div>
    </div>
    );

}
