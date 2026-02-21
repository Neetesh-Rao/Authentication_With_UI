import { useState,useEffect } from "react";
import { useTheme } from "./context/ThemeContext";
import { useLocation,useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { Sun, Moon } from "lucide-react";

export default function DashboardPage() {
  const {darkMode,toggleTheme}=useTheme();
  const navigate=useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
const user = location.state?.user;
  
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);   // Large screen → open
    } else {
      setSidebarOpen(false);  // md & below → close
    }
  };

  handleResize(); // first time run after login
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
  
const handleLogout = () => {
 
    toast.success("Logged out successfully ✅");
 setTimeout(() => {
   navigate("/")
    }, 500)
  
  };
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition duration-300">

      {/* SIDEBAR */}
      <div className={` fixed md:relative z-40 h-full ${sidebarOpen ? "w-64" : "w-0"} bg-blue-600 dark:bg-gray-800 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-4 font-bold text-lg border-b border-blue-400">
          {sidebarOpen ? "My Dashboard" : "MD"}
        </div>

        <ul className="mt-4 space-y-2 px-2">
          <li className="p-2 hover:bg-blue-500 rounded cursor-pointer">Home</li>
          <li className="p-2 hover:bg-blue-500 rounded cursor-pointer">Messages</li>
          <li className="p-2 hover:bg-blue-500 rounded cursor-pointer">Reels</li>
          <li className="p-2 hover:bg-blue-500 rounded cursor-pointer">Profile</li>
          <li className="p-2 hover:bg-blue-500 rounded cursor-pointer">Settings</li>

        </ul>
      </div>
      {sidebarOpen&&(
        <div className="fixed inset-0 bg-blak/40 backdrop-blur-sm md:hidden z-30"
         onClick={() => setSidebarOpen(false)}>

        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <div className="bg-white dark:bg-gray-800 dark:text-white shadow-md px-6 py-4 flex justify-between items-center transition duration-300">

          {/* Left side */}
          <div className="flex items-center gap-3">
            <Menu
              className="cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
         
          {/* Right side - Profile */}
         
          <div className="flex items-center gap-4">
  
  {/* Theme Toggle Button */}
  <button
    onClick={toggleTheme}
    className="p-2 rounded-lg bg-gray dark:bg-gray-700 transition"
  >
    {darkMode ?  <Sun size={20} className="text-yellow-500" />: <Moon size={20} className="text-gray-800" />}
  </button>

  {/* Profile Section */}
  <div className="relative">
    <div
      className="w-10 h-10 bg-blue-500 dark:bg-gray-900 text-white rounded-full flex items-center justify-center cursor-pointer"
      onClick={() => setProfileOpen(!profileOpen)}
    >
      <User size={20} />
    </div>

    {profileOpen && (
      <div className="absolute right-0 mt-3 w-64 bg-blue dark:bg-gray-800 dark:text-white rounded-xl shadow-xl p-4">
        <h2 className="font-semibold text-lg">{user.name}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{user.phone}</p>

        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    )}
  </div>

</div>
        </div>

        {/* CONTENT */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white p-6 rounded-2xl shadow-md  dark:bg-gray-800 dark:text-white transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Welcome {user.name} 👋</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is your dashboard main content area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
