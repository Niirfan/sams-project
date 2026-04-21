import { CartProvider } from "./context/CartContext";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar"; // Topbar เดิมของ User
import AdminSidebar from "./pages/admin/adminsidebar"; 
import AdminTopbar from "./pages/admin/admintopbar"; // ไฟล์ AdminTopbar ที่จะสร้างใหม่
import AppRoutes from "./AppRoutes";
import { useLocation } from "react-router-dom"; 

export default function App() {
  const location = useLocation(); 
  const isLoginPage = location.pathname === "/login";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (  
    <CartProvider>
      {isLoginPage ? (
        /* 1. หน้า Login */
        <AppRoutes />
      ) : isAdminPage ? (
        /* 2. โครงสร้างหน้า Admin (ใช้ AdminSidebar + AdminTopbar) */
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <div className="flex flex-1 flex-col">
            <AdminTopbar /> 
            <main className="flex-1 overflow-y-auto bg-gray-100">
              <AppRoutes />
            </main>
          </div>
        </div>
      ) : (
        /* 3. โครงสร้างหน้า User (ใช้ Sidebar + Topbar เดิมที่เคยหายไป) */
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <AppRoutes />
            </main>  
          </div>
        </div>
      )}
    </CartProvider>
  );
}