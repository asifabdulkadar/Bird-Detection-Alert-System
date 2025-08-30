import React from 'react';
import { AlertOctagon, Camera, Clock } from 'lucide-react';
import DetectionChart from './DetectionChart';
import { NotificationHistory } from './NotificationHistory';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-5 col-span-1 md:col-span-2 lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Active Alerts</h2>
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">Live</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
            <AlertOctagon className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <p className="font-medium text-red-500">Bird Detected - Zone 2</p>
              <p className="text-xs text-gray-500">12 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
            <AlertOctagon className="h-5 w-5 text-amber-500 mr-2" />
            <div>
              <p className="font-medium text-amber-500">Possible Detection - Zone 1</p>
              <p className="text-xs text-gray-500">34 minutes ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Camera Status</h2>
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">3 Online</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Camera className="h-5 w-5 text-emerald-500 mr-2" />
              <p className="font-medium">Front Yard</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Camera className="h-5 w-5 text-emerald-500 mr-2" />
              <p className="font-medium">Back Yard</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Camera className="h-5 w-5 text-emerald-500 mr-2" />
              <p className="font-medium">Garden</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Camera className="h-5 w-5 text-gray-400 mr-2" />
              <p className="font-medium text-gray-400">Patio</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-gray-300"></span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-2">
          <div className="border-l-2 border-emerald-500 pl-3 py-1">
            <p className="text-sm font-medium">Bird detected in Zone 2</p>
            <p className="text-xs text-gray-500">Today, 9:45 AM</p>
          </div>
          <div className="border-l-2 border-amber-500 pl-3 py-1">
            <p className="text-sm font-medium">Possible detection in Zone 1</p>
            <p className="text-xs text-gray-500">Today, 9:23 AM</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-3 py-1">
            <p className="text-sm font-medium">Camera settings updated</p>
            <p className="text-xs text-gray-500">Today, 8:15 AM</p>
          </div>
          <div className="border-l-2 border-gray-300 pl-3 py-1">
            <p className="text-sm font-medium">System started</p>
            <p className="text-xs text-gray-500">Today, 8:00 AM</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-5 col-span-1 md:col-span-2 lg:col-span-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Detection Analytics</h2>
          <select className="text-sm border rounded-md px-2 py-1">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
        </div>
        <div className="h-80">
          <DetectionChart />
        </div>
      </div>

      <div className="md:col-span-2">
        <NotificationHistory />
      </div>
    </div>
  );
};

export default Dashboard;