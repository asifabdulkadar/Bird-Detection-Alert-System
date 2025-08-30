import React, { useState } from 'react';
import { Bell, Camera, Sliders, Save } from 'lucide-react';
import { testSMSAlert } from '../services/notifications';

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailAlerts: false,
      soundAlerts: true,
      minimumConfidence: 75,
    },
    cameras: {
      camera1: {
        enabled: true,
        sensitivity: 80,
        motionDetection: true,
        scheduledRecording: false,
      },
      camera2: {
        enabled: true,
        sensitivity: 70,
        motionDetection: true,
        scheduledRecording: false,
      },
      camera3: {
        enabled: true,
        sensitivity: 60,
        motionDetection: false,
        scheduledRecording: false,
      },
      camera4: {
        enabled: false,
        sensitivity: 80,
        motionDetection: true,
        scheduledRecording: false,
      },
    },
  });

  const handleNotificationChange = (field: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleCameraChange = (camera: string, field: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      cameras: {
        ...prev.cameras,
        [camera]: {
          ...prev.cameras[camera as keyof typeof prev.cameras],
          [field]: value
        }
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, this would send settings to the backend
    alert('Settings saved successfully!');
  };

  const handleTestSMS = async () => {
    try {
      await testSMSAlert();
      alert('Test SMS sent successfully!');
    } catch (error) {
      alert('Failed to send test SMS. Check console for details.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">System Settings</h2>
        <p className="text-sm text-gray-500">Configure alerts and camera settings</p>
      </div>
      
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium">Notification Settings</h3>
          </div>
          
          <div className="space-y-4 ml-7">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Push Notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="pushNotifications"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                  className="sr-only"
                />
                <label 
                  htmlFor="pushNotifications"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${settings.notifications.pushNotifications ? 'bg-emerald-500' : ''}`}
                >
                  <span 
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${settings.notifications.pushNotifications ? 'translate-x-4' : ''}`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email Alerts</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="emailAlerts"
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                  className="sr-only"
                />
                <label 
                  htmlFor="emailAlerts"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${settings.notifications.emailAlerts ? 'bg-emerald-500' : ''}`}
                >
                  <span 
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${settings.notifications.emailAlerts ? 'translate-x-4' : ''}`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Sound Alerts</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="soundAlerts"
                  checked={settings.notifications.soundAlerts}
                  onChange={(e) => handleNotificationChange('soundAlerts', e.target.checked)}
                  className="sr-only"
                />
                <label 
                  htmlFor="soundAlerts"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${settings.notifications.soundAlerts ? 'bg-emerald-500' : ''}`}
                >
                  <span 
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${settings.notifications.soundAlerts ? 'translate-x-4' : ''}`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Confidence Threshold ({settings.notifications.minimumConfidence}%)
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.notifications.minimumConfidence}
                onChange={(e) => handleNotificationChange('minimumConfidence', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Camera className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium">Camera Settings</h3>
          </div>
          
          <div className="space-y-6 ml-7">
            {Object.entries(settings.cameras).map(([camera, config]) => (
              <div key={camera} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{camera.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id={`${camera}Enabled`}
                      checked={config.enabled}
                      onChange={(e) => handleCameraChange(camera, 'enabled', e.target.checked)}
                      className="sr-only"
                    />
                    <label 
                      htmlFor={`${camera}Enabled`}
                      className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${config.enabled ? 'bg-emerald-500' : ''}`}
                    >
                      <span 
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${config.enabled ? 'translate-x-4' : ''}`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sensitivity ({config.sensitivity}%)
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={config.sensitivity}
                      onChange={(e) => handleCameraChange(camera, 'sensitivity', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      disabled={!config.enabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Motion Detection</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id={`${camera}Motion`}
                        checked={config.motionDetection}
                        onChange={(e) => handleCameraChange(camera, 'motionDetection', e.target.checked)}
                        className="sr-only"
                        disabled={!config.enabled}
                      />
                      <label 
                        htmlFor={`${camera}Motion`}
                        className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                          !config.enabled ? 'opacity-50' : config.motionDetection ? 'bg-emerald-500' : ''
                        }`}
                      >
                        <span 
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${config.motionDetection ? 'translate-x-4' : ''}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Scheduled Recording</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id={`${camera}Scheduled`}
                        checked={config.scheduledRecording}
                        onChange={(e) => handleCameraChange(camera, 'scheduledRecording', e.target.checked)}
                        className="sr-only"
                        disabled={!config.enabled}
                      />
                      <label 
                        htmlFor={`${camera}Scheduled`}
                        className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                          !config.enabled ? 'opacity-50' : config.scheduledRecording ? 'bg-emerald-500' : ''
                        }`}
                      >
                        <span 
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${config.scheduledRecording ? 'translate-x-4' : ''}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Sliders className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium">System Settings</h3>
          </div>
          
          <div className="space-y-4 ml-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detection Interval
              </label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
                <option>Every 5 seconds</option>
                <option>Every 10 seconds</option>
                <option>Every 30 seconds</option>
                <option>Every minute</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Retention
              </label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Test Alerts Section */}
        <div className="mt-6">
          <h4 className="text-md font-medium mb-3">Test Notifications</h4>
          <div className="space-x-4">
            <button
              onClick={handleTestSMS}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Test SMS Alert
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t flex justify-end">
        <button 
          onClick={saveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;