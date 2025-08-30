import React, { useState } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';

const mockDetectionHistory = [
  { id: 1, zone: 'Front Yard', camera: 'Camera 1', confidence: 92, timestamp: '2025-04-22T10:23:45Z', imageUrl: 'https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 2, zone: 'Back Yard', camera: 'Camera 2', confidence: 87, timestamp: '2025-04-22T09:15:32Z', imageUrl: 'https://images.pexels.com/photos/2662434/pexels-photo-2662434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 3, zone: 'Garden', camera: 'Camera 3', confidence: 76, timestamp: '2025-04-22T08:45:12Z', imageUrl: 'https://images.pexels.com/photos/60215/pexels-photo-60215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 4, zone: 'Patio', camera: 'Camera 4', confidence: 95, timestamp: '2025-04-21T16:30:22Z', imageUrl: 'https://images.pexels.com/photos/206770/pexels-photo-206770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 5, zone: 'Front Yard', camera: 'Camera 1', confidence: 65, timestamp: '2025-04-21T14:12:05Z', imageUrl: 'https://images.pexels.com/photos/1090615/pexels-photo-1090615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

const HistoryPanel: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('today');
  
  const filteredHistory = mockDetectionHistory.filter(detection => {
    if (selectedCamera !== 'all' && detection.camera !== selectedCamera) {
      return false;
    }
    
    // Date filtering would be implemented here in a real application
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Detection History</h2>
        <p className="text-sm text-gray-500">View past bird detections</p>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select 
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="custom">Custom range</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select 
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
              >
                <option value="all">All Cameras</option>
                <option value="Camera 1">Camera 1</option>
                <option value="Camera 2">Camera 2</option>
                <option value="Camera 3">Camera 3</option>
                <option value="Camera 4">Camera 4</option>
              </select>
            </div>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredHistory.map((detection) => (
          <div key={detection.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200">
              <img src={detection.imageUrl} alt="Bird detection" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{detection.zone}</h3>
                  <p className="text-sm text-gray-500">{detection.camera}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                  {detection.confidence}% confidence
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{formatDate(detection.timestamp)}</p>
              <div className="mt-3 flex justify-end">
                <button className="text-sm text-emerald-600 hover:text-emerald-800">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredHistory.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">No detection history found matching your criteria</p>
        </div>
      )}
      
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredHistory.length}</span> of <span className="font-medium">{mockDetectionHistory.length}</span> detections
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">Previous</button>
          <button className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;