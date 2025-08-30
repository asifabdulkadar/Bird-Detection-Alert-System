import React, { useState, useEffect } from 'react';
import { Video, Settings, Power, RotateCw, Maximize2, AlertTriangle } from 'lucide-react';
import { auth } from '../services/firebase';
import { sendEmailAlert, sendWhatsAppAlert, sendSMSAlert } from '../services/notifications';

const mockCameras = [
  { id: 1, name: 'Front Yard', status: 'online', resolution: '1080p', fps: 30, lastDetection: '2025-04-22T10:23:45Z' },
  { id: 2, name: 'Back Yard', status: 'online', resolution: '1080p', fps: 30, lastDetection: '2025-04-22T09:15:32Z' },
  { id: 3, name: 'Garden', status: 'online', resolution: '720p', fps: 24, lastDetection: '2025-04-22T08:45:12Z' },
  { id: 4, name: 'Patio', status: 'offline', resolution: '1080p', fps: 30, lastDetection: '2025-04-21T16:30:22Z' },
];

const CamerasPanel: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<number | null>(1);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    // Simulate bird detection
    const interval = setInterval(() => {
      const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-100
      if (randomConfidence > 85 && auth.currentUser) {
        const detection = {
          zone: 'Front Yard',
          confidence: randomConfidence,
          timestamp: new Date().toISOString(),
          imageUrl: 'https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg',
        };
        
        // Send alerts through all channels
        Promise.all([
          sendEmailAlert(auth.currentUser.uid, detection),
          sendWhatsAppAlert(detection),
          sendSMSAlert(auth.currentUser.uid, detection)
        ]).catch(console.error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Live View</h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <RotateCw size={18} className="text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Maximize2 size={18} className="text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
          <div className="aspect-video bg-gray-900 relative">
            {selectedCamera ? (
              <>
                <img 
                  src={`https://images.pexels.com/photos/${[416179, 226488, 2183508, 416179][selectedCamera - 1 || 0]}/pexels-photo-${[416179, 226488, 2183508, 416179][selectedCamera - 1 || 0]}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} 
                  alt="Camera feed" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg text-white text-sm flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  <span>{mockCameras.find(c => c.id === selectedCamera)?.name}</span>
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg text-white text-xs">
                  LIVE
                </div>
                {mockCameras.find(c => c.id === selectedCamera)?.status === 'offline' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="text-center text-white">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-xl font-semibold">Camera Offline</p>
                      <p className="text-sm mt-1">Please check your camera connection</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-center text-white">
                  <Video className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-xl font-semibold">No Camera Selected</p>
                  <p className="text-sm mt-1">Please select a camera to view</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  {selectedCamera ? mockCameras.find(c => c.id === selectedCamera)?.name : 'No Camera Selected'}
                </h3>
                {selectedCamera && (
                  <p className="text-sm text-gray-500">
                    {mockCameras.find(c => c.id === selectedCamera)?.resolution} @ {mockCameras.find(c => c.id === selectedCamera)?.fps} FPS
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <select className="border rounded-md px-3 py-1 text-sm">
                  <option>Detection Zone</option>
                  <option>Full Frame</option>
                  <option>Custom Zone 1</option>
                  <option>Custom Zone 2</option>
                </select>
                <button className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm flex items-center">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {selectedCamera && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-5">
            <h3 className="text-lg font-medium mb-4">Recent Detections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-200">
                  <img src="https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Bird detection" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500">{formatDate('2025-04-22T10:23:45Z')}</p>
                  <p className="text-sm font-medium mt-1">92% confidence</p>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-200">
                  <img src="https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Bird detection" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500">{formatDate('2025-04-22T09:45:12Z')}</p>
                  <p className="text-sm font-medium mt-1">85% confidence</p>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-200">
                  <img src="https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Bird detection" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500">{formatDate('2025-04-22T09:15:32Z')}</p>
                  <p className="text-sm font-medium mt-1">78% confidence</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Camera List</h2>
          <p className="text-sm text-gray-500">Select a camera to view</p>
        </div>
        <div className="p-4 space-y-4">
          {mockCameras.map((camera) => (
            <div 
              key={camera.id}
              onClick={() => setSelectedCamera(camera.id)}
              className={`border rounded-lg p-4 cursor-pointer hover:border-emerald-500 transition-colors ${
                selectedCamera === camera.id ? 'border-emerald-500 bg-emerald-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{camera.name}</h3>
                  <p className="text-sm text-gray-500">{camera.resolution} @ {camera.fps} FPS</p>
                </div>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-1 ${camera.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xs">{camera.status}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Last detection: {formatDate(camera.lastDetection)}
              </div>
              <div className="mt-3 flex justify-between items-center">
                <button className={`p-1 rounded-md ${camera.status === 'online' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}>
                  <Power className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-500 hover:bg-gray-50 rounded-md">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <button className="w-full py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
            Add New Camera
          </button>
        </div>
      </div>
    </div>
  );
};

export default CamerasPanel;