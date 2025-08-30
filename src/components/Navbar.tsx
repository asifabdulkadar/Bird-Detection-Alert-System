import React, { useState } from 'react';
import { Menu, BellRing, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md py-3 px-4 flex items-center justify-between relative">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-1 mr-3 rounded-full hover:bg-gray-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <BellRing className="h-6 w-6 text-emerald-600" />
          <span className="ml-2 text-xl font-semibold text-gray-800">BirdAlert</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          className="p-2 rounded-full hover:bg-gray-100 relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <BellRing size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {showNotifications && (
          <div className="absolute right-20 top-16 w-80 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-3 border-b">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-3 hover:bg-gray-50 border-b">
                <p className="text-sm font-medium">Bird Detected in Front Yard</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <div className="p-3 hover:bg-gray-50 border-b">
                <p className="text-sm font-medium">Motion Detected in Back Yard</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="p-3 text-center border-t">
              <button className="text-sm text-emerald-600 hover:text-emerald-800">
                View All Notifications
              </button>
            </div>
          </div>
        )}

        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} className="text-gray-600" />
        </button>

        {showSettings && (
          <div className="absolute right-12 top-16 w-48 bg-white rounded-lg shadow-lg border z-50">
            <div className="py-1">
              <button 
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => navigate('/settings')}
              >
                Account Settings
              </button>
              <button 
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => navigate('/notifications')}
              >
                Notification Settings
              </button>
            </div>
          </div>
        )}

        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut size={20} className="text-gray-600" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;