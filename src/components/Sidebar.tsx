import React from 'react';
import { LayoutDashboard, Bell, History, Settings, Camera, BarChart } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setActiveTab, activeTab }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'alerts', name: 'Alerts', icon: <Bell size={20} /> },
    { id: 'history', name: 'Detection History', icon: <History size={20} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart size={20} /> },
    { id: 'cameras', name: 'Cameras', icon: <Camera size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-10 w-64 bg-gray-800 transition-transform duration-300 ease-in-out lg:static`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <Bell className="h-8 w-8 text-emerald-500" />
          <span className="ml-2 text-xl font-bold text-white">BirdAlert</span>
        </div>
      </div>
      <nav className="mt-5 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`${
              activeTab === item.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } group flex items-center px-2 py-3 text-base font-medium rounded-md w-full mb-1 transition-colors duration-200`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;