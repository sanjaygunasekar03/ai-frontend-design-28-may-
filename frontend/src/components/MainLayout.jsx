import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Phone,
  Layers,
  FileText,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
} from 'lucide-react';
import logoSymbol from '../assets/logo.png';
import logoDark from '../assets/logo-dark.webp';

const MainLayout = ({ onLogout }) => {
  const location = useLocation();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isSidebarOpen = isPinned || isHovered;

  const toggleSidebar = () => {
    setIsPinned(!isPinned);
  };


  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-[#EFF6FF] border-r border-[#DBEAFE] flex flex-col z-50 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] fixed inset-y-0 left-0 lg:relative overflow-hidden group/sidebar
          ${isSidebarOpen ? 'w-[240px] translate-x-0' : 'w-20 translate-x-0'}`}
      >
        <div className={`relative z-10 flex items-center py-6 px-5 mb-2 ${isSidebarOpen ? 'justify-between' : 'flex-col justify-center space-y-6'}`}>
          {isSidebarOpen ? (
            <img src={logoDark} alt="Bristol" className="h-7 w-auto object-contain" />
          ) : (
            <div className="bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center">
               <img src={logoSymbol} alt="B" className="w-6 h-6 object-contain" />
            </div>
          )}
          
        </div>

        <nav className="relative z-10 flex-1 px-4 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#DBEAFE] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#BFDBFE]">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/" active={location.pathname === '/'} isOpen={isSidebarOpen} />
          <NavItem icon={<Phone size={20} />} label="Calls" to="/search-calls" active={location.pathname === '/search-calls'} isOpen={isSidebarOpen} />
          <NavItem icon={<Layers size={20} />} label="Batches" to="/search-batches" active={location.pathname === '/search-batches'} isOpen={isSidebarOpen} />
          <NavItem icon={<FileText size={20} />} label="Templates" to="/templates" active={location.pathname === '/templates'} isOpen={isSidebarOpen} />
          <NavItem icon={<Users size={20} />} label="Contact Insights" to="/contact-insights" active={location.pathname === '/contact-insights'} isOpen={isSidebarOpen} />

          <div className="pt-4 mt-4 border-t border-[#DBEAFE]">
            <NavItem icon={<Settings size={20} />} label="Settings" to="/settings" active={location.pathname === '/settings'} isOpen={isSidebarOpen} />
            <NavItem icon={<HelpCircle size={20} />} label="Help Center" to="/help" active={location.pathname === '/help'} isOpen={isSidebarOpen} />
          </div>
        </nav>

        <div className="relative z-10 p-4 mt-auto border-t border-[#DBEAFE]">
          <button
            onClick={onLogout}
            className={`flex items-center w-full p-2.5 text-[#717784] hover:bg-[#DBEAFE] hover:text-[#E02424] rounded-xl transition-all duration-200 group
              ${!isSidebarOpen && 'w-11 h-11 justify-center mx-auto'}`}
          >
            <LogOut size={20} className={`${isSidebarOpen && 'mr-3'} group-hover:-translate-x-0.5 transition-transform`} />
            {isSidebarOpen && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#F7F8FA]">
          <Outlet context={{ onLogout, isSidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to, active, isOpen }) => {
  return (
    <Link
      to={to}
      className={`relative flex items-center py-2.5 px-3 rounded-xl transition-all duration-200 group
        ${active
          ? 'bg-[#3B82F6] text-white font-medium shadow-md shadow-blue-500/20'
          : 'text-[#4A4F59] hover:bg-[#DBEAFE] hover:text-[#1A1C21]'}
        ${!isOpen && 'justify-center mx-auto mb-2 p-3 w-11 h-11'}`}
      title={!isOpen ? label : ''}
    >
      {/* Floating Active Neon Indicator */}
      {active && (
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.5)]
          ${isOpen ? 'h-3/4' : 'h-1/2'}`}
        />
      )}
      
      <div className={`relative z-10 flex items-center justify-center transition-transform duration-200
        ${isOpen ? 'mr-3' : ''} 
        ${active ? 'text-white' : 'text-[#717784] group-hover:text-[#3B82F6]'}`}
      >
        {icon}
      </div>

      {isOpen && (
        <span className={`relative z-10 text-[13px] whitespace-nowrap transition-all duration-200
          ${active ? 'font-semibold text-white' : 'font-medium group-hover:text-[#1A1C21]'}`}
        >
          {label}
        </span>
      )}
    </Link>
  );
};

export default MainLayout;