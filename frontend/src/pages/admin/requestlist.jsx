import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function RequestListPage() {
  const navigate = useNavigate();

  const branches = ["001 หาดใหญ่", "002 สงขลา", "ส่วนกลาง"];
  const statuses = ["รออนุมัติ", "อนุมัติแล้ว", "ไม่อนุมัติ"];

  const [requests, setRequests] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    setRequests([
      {
        id: "REQ-2026-0001",
        date: "19/02/2569",
        requester: "อารีภาพ ใจดี",
        branch: "001 หาดใหญ่",
        count: 5,
        status: "รออนุมัติ",
      },
      {
        id: "REQ-2026-0002",
        date: "19/02/2569",
        requester: "สมศักดิ์ รักงาน",
        branch: "ส่วนกลาง",
        count: 10,
        status: "อนุมัติแล้ว",
      },
      {
        id: "REQ-2026-0003",
        date: "18/02/2569",
        requester: "มานะ พัฒนกิจ",
        branch: "002 สงขลา",
        count: 3,
        status: "ไม่อนุมัติ",
      },
      {
        id: "REQ-2026-0004",
        date: "18/02/2569",
        requester: "สายใจ รักดี",
        branch: "001 หาดใหญ่",
        count: 7,
        status: "รออนุมัติ",
      },
    ]);
  }, []);

  const filteredRequests = requests.filter(req => {
    return (
      req.id.toLowerCase().includes(searchId.toLowerCase()) &&
      req.requester.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchBranch === "" || req.branch === searchBranch) &&
      (searchStatus === "" || req.status === searchStatus) &&
      (searchDate === "" || req.date === searchDate)
    );
  });

  return (
    <div className="p-5 bg-gray-100 min-h-screen text-left">

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-3 flex items-center gap-4">
        <div className="bg-black p-3 rounded-xl text-white">
          <FaFileAlt size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">รายการคำขอเบิก</h1>
          <p className="text-gray-400 text-xs">
            ตรวจสอบและอนุมัติคำขอเบิกจากผู้ใช้งานทุกสาขา
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="ค้นหารหัสคำขอ"
          className="border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none w-40"
          onChange={(e) => setSearchId(e.target.value)}
        />

        <input
          type="text"
          placeholder="ค้นหาชื่อผู้ขอ"
          className="border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none w-40"
          onChange={(e) => setSearchName(e.target.value)}
        />

        <div className="relative">
          <input
            type="date"
            className="border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none w-40 pr-2 text-gray-500 appearance-none"
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <FaCalendarAlt
            className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            size={14}
          />
        </div>

        <select
          className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-500 outline-none bg-white min-w-[140px]"
          onChange={(e) => setSearchBranch(e.target.value)}
        >
          <option value="">สาขาทั้งหมด</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-500 outline-none bg-white min-w-[140px]"
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">สถานะทั้งหมด</option>
          {statuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-center">
          <thead>
            <tr className="text-xs font-bold text-gray-800 border-b border-gray-100">
              <th className="px-6 py-5">รหัสคำขอ</th>
              <th className="px-6 py-5">วันที่ขอ</th>
              <th className="px-6 py-5">ผู้ขอ</th>
              <th className="px-6 py-5">สาขา</th>
              <th className="px-6 py-5">จำนวนรายการ</th>
              <th className="px-6 py-5">สถานะ</th>
              <th className="px-6 py-5">จัดการ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredRequests.map((req, index) => (
              <tr key={index} className="hover:bg-gray-50/50">
                <td className="px-6 py-5 text-sm font-medium">{req.id}</td>
                <td className="px-6 py-5 text-sm text-gray-600">{req.date}</td>
                <td className="px-6 py-5 text-sm text-gray-600">{req.requester}</td>
                <td className="px-6 py-5 text-sm text-gray-600">{req.branch}</td>
                <td className="px-6 py-5 text-sm text-gray-800 font-bold">{req.count}</td>
                <td className="px-6 py-5 text-sm">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      req.status === "รออนุมัติ"
                        ? "bg-yellow-100 text-yellow-600"
                        : req.status === "อนุมัติแล้ว"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm">
                  <button
                    onClick={() => navigate(`/admin/request-detail/${req.id}`)}
                    className="text-blue-500 hover:underline"
                  >
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            ))}

            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="7" className="py-10 text-gray-400">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}