import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHome, FaPlus, FaEllipsisV, FaChevronDown, FaTrash, FaEdit } from "react-icons/fa";
import api from "../../services/api";

export default function AdminMaterials() {
  const navigate = useNavigate();
  const [materialTypes, setMaterialTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const filteredMaterials = materials;
  const [loading, setLoading] = useState(true);


  const handleDelete = async (id) => {
  if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {

    await api.delete(`/materials/${id}`);
    await loadMaterials(); // โหลดข้อมูลใหม่

    toast.success("ลบรายการสำเร็จ");
  }
};

  useEffect(() => {
      loadMaterialTypes();
  }, []);
  
  useEffect(() => {
  loadMaterials();
  }, [selectedType]);

   const loadMaterials = async () => {
  try {
    setLoading(true);

    const res = await api.get("/materials/list");

    // ถ้ามีเลือกประเภท → filter ใน frontend
    let data = res.data;
    if (selectedType) {
      data = data.filter(
        (m) => String(m.mat_type_id) === String(selectedType)
      );
    }

    setMaterials(data);
  } catch (err) {
    console.error("โหลดวัสดุไม่สำเร็จ", err);
  } finally {
    setLoading(false);
  }
};

  
  const loadMaterialTypes = async () => {
  try {
    const res = await api.get("/material-type");
    setMaterialTypes(res.data);
  } catch (err) {
    console.error("โหลดประเภทวัสดุไม่สำเร็จ", err);
  }
  };

  const handleTypeChange = (typeId) => {
  setSelectedType(typeId);
  };
  
  const renderStatusBadge = (m) => {
  const baseStyle =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold";

  const dotStyle = "w-2.5 h-2.5 rounded-full";

  if (!m.is_active) {
    return (
      <span
        className={`${baseStyle} bg-red-50 text-red-700`}
        title="วัสดุนี้ถูกปิดใช้งาน ไม่สามารถเบิกได้"
      >
        <span className={`${dotStyle} bg-red-500`} />
        ไม่พร้อม
      </span>
    );
  }

  if (m.balance_qty === 0) {
    return (
      <span
        className={`${baseStyle} bg-yellow-50 text-yellow-700`}
        title="วัสดุหมดสต็อก"
      >
        <span className={`${dotStyle} bg-yellow-500`} />
        สินค้าหมด
      </span>
    );
  }

  return (
    <span
      className={`${baseStyle} bg-green-50 text-green-700`}
      title="สามารถเบิกได้"
    >
      <span className={`${dotStyle} bg-green-500`} />
      พร้อม
    </span>
  );
};


  return (
    <div className="p-5 bg-gray-100 min-h-screen text-left relative">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-3">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-black p-3 rounded-xl text-white shadow-lg"><FaHome size={24} /></div>
            <h1 className="text-xl font-bold text-gray-800">รายการวัสดุสำนักงาน</h1>
          </div>
        </div>

        <div className="relative inline-block">
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="appearance-none border-2 border-[#157282] text-[#157282] py-2 px-6 pr-12 rounded-xl font-bold text-sm outline-none cursor-pointer"
          >
            <option value="">ประเภททั้งหมด</option>

            {materialTypes.map((type) => (
              <option key={type.mat_type_id} value={type.mat_type_id}>
                {type.mat_type_name}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#157282]"><FaChevronDown size={14} /></div>
        </div>
      </div>

      {/* ตารางข้อมูล - สำคัญ: ต้องเอา overflow-hidden ออก */}
      {/* ตารางข้อมูล */}
      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500 font-medium">
          กำลังโหลดข้อมูล...
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500 font-medium">
          ไม่พบข้อมูลวัสดุ
        </div>
      ) : (
        <div className="bg-white rounded-[1rem] shadow-sm border border-gray-100 relative overflow-visible">
          <table className="w-full text-left table-auto">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">รหัสวัสดุ</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">ชื่อวัสดุ</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">ประเภทวัสดุ</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600 text-center">จำนวนคงเหลือ</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600 text-center">สถานะ</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">วันที่นำเข้าล่าสุด</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600 text-center">รายละเอียด</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {materials.map((m) => (
                <tr key={m.mat_id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-gray-700">{m.mat_code}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{m.mat_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{m.mat_type_name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-center text-gray-800">{m.balance_qty}</td>
                  <td className="px-8 py-5 text-center">
                    {renderStatusBadge(m)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {m.last_import
                      ? new Date(m.last_import).toLocaleDateString("th-TH")
                      : "-"}
                  </td>
                  <td
                    className="px-6 py-4 text-center text-blue-500 font-medium cursor-pointer hover:underline"
                    onClick={() => navigate(`/admin/materials/${m.mat_id}`)}
                  >
                    ดูรายละเอียด
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/material/edit/${m.mat_id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.mat_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       )}
    </div>
  );
}
