import React, { useState } from 'react';
import { AlertTriangle, Search, X, Camera, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { auth } from '../services/firebase';
import { sendSMSAlert } from '../services/notifications';

const mockAlerts = [
  { id: 1, zone: 'Front Yard', camera: 'Camera 1', confidence: 92, timestamp: '2025-04-22T10:23:45Z', status: 'critical' },
  { id: 2, zone: 'Back Yard', camera: 'Camera 2', confidence: 87, timestamp: '2025-04-22T09:15:32Z', status: 'warning' },
  { id: 3, zone: 'Garden', camera: 'Camera 3', confidence: 76, timestamp: '2025-04-22T08:45:12Z', status: 'warning' },
  { id: 4, zone: 'Patio', camera: 'Camera 4', confidence: 95, timestamp: '2025-04-21T16:30:22Z', status: 'critical' },
  { id: 5, zone: 'Front Yard', camera: 'Camera 1', confidence: 65, timestamp: '2025-04-21T14:12:05Z', status: 'info' },
];

const AlertsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sendingAlerts, setSendingAlerts] = useState<number[]>([]);
  
  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.zone.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.camera.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? alert.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusClasses = (status: string) => {
    switch(status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendSMS = async (alert: typeof mockAlerts[0]) => {
    if (!auth.currentUser) return;
    
    setSendingAlerts(prev => [...prev, alert.id]);
    try {
      await sendSMSAlert(auth.currentUser.uid, {
        zone: alert.zone,
        confidence: alert.confidence,
        timestamp: alert.timestamp,
        imageUrl: `https://images.pexels.com/photos/416179/pexels-photo-416179.jpeg`
      });
      alert('SMS notification sent successfully');
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS notification');
    } finally {
      setSendingAlerts(prev => prev.filter(id => id !== alert.id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Bird Detection Alerts</h2>
        <p className="text-sm text-gray-500">View and manage detection alerts</p>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search alerts..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedStatus(selectedStatus === 'critical' ? null : 'critical')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${selectedStatus === 'critical' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'}`}
            >
              Critical
            </button>
            <button 
              onClick={() => setSelectedStatus(selectedStatus === 'warning' ? null : 'warning')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${selectedStatus === 'warning' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'}`}
            >
              Warning
            </button>
            <button 
              onClick={() => setSelectedStatus(selectedStatus === 'info' ? null : 'info')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${selectedStatus === 'info' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}`}
            >
              Info
            </button>
            {selectedStatus && (
              <button 
                onClick={() => setSelectedStatus(null)}
                className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camera</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(alert.status)}`}>
                      {alert.status === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alert.zone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alert.camera}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alert.confidence}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(alert.timestamp)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-emerald-600 hover:text-emerald-900">View</button>
                      <button className="text-red-600 hover:text-red-900">Dismiss</button>
                      <button
                        onClick={() => handleSendSMS(alert)}
                        disabled={sendingAlerts.includes(alert.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          sendingAlerts.includes(alert.id)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {sendingAlerts.includes(alert.id) ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <MessageSquare className="h-4 w-4 mr-1" />
                        )}
                        {sendingAlerts.includes(alert.id) ? 'Sending...' : 'Send SMS'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No alerts found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredAlerts.length}</span> of <span className="font-medium">{mockAlerts.length}</span> alerts
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">Previous</button>
          <button className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;