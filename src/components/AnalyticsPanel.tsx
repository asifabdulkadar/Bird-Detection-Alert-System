import React, { useState } from 'react';
import { BarChart3, PieChart, Clock, Filter, Download } from 'lucide-react';

const AnalyticsPanel: React.FC = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Bird Detection Analytics</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <select 
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="day">Last 24 hours</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last 12 months</option>
            </select>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Detection Summary</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Total Detections</span>
                <span className="text-sm font-semibold">143</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">High Confidence</span>
                <span className="text-sm font-semibold">87</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '61%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Medium Confidence</span>
                <span className="text-sm font-semibold">42</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '29%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Low Confidence</span>
                <span className="text-sm font-semibold">14</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Zone Distribution</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-48 flex items-center justify-center">
            {/* This would be a pie chart in a real implementation */}
            <div className="relative w-36 h-36">
              <div className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 0 0, 0 50%)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-amber-500" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 100%, 50% 100%)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-red-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold">143</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></span>
              <span className="text-xs">Front Yard (35%)</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-xs">Back Yard (25%)</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
              <span className="text-xs">Garden (20%)</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-xs">Patio (20%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Activity Patterns</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Most Active Time of Day</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 h-2.5 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>12 AM</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Peak Detection Hours</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 p-2 rounded-md text-center">
                  <p className="text-xs text-gray-500">Morning Peak</p>
                  <p className="font-semibold text-emerald-700">7:00 - 9:00 AM</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-md text-center">
                  <p className="text-xs text-gray-500">Evening Peak</p>
                  <p className="font-semibold text-amber-700">5:00 - 7:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Weekly Distribution</h4>
              <div className="flex items-center justify-between h-12">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className="w-5 bg-emerald-500 rounded-t-sm"
                      style={{ height: `${[30, 45, 60, 75, 80, 50, 35][i]}%` }}
                    ></div>
                    <span className="text-xs mt-1">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Detection Trends</h3>
            <select className="text-sm border rounded-md px-2 py-1">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="h-64">
            {/* This would be a line chart in a real implementation */}
            <div className="w-full h-full flex items-end justify-between px-2">
              {[35, 28, 45, 52, 38, 65, 70, 55, 48, 60, 75, 62].map((value, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-4 bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-t-sm"
                    style={{ height: `${value}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                <span key={i}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Bird Species Detection</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></span>
                  <span className="text-sm font-medium">Sparrow</span>
                </div>
                <span className="text-sm font-semibold">37%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '37%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-sm font-medium">Robin</span>
                </div>
                <span className="text-sm font-semibold">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                  <span className="text-sm font-medium">Cardinal</span>
                </div>
                <span className="text-sm font-semibold">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-sm font-medium">Blue Jay</span>
                </div>
                <span className="text-sm font-semibold">12%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-gray-500 mr-2"></span>
                  <span className="text-sm font-medium">Other</span>
                </div>
                <span className="text-sm font-semibold">8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Species Trend</p>
            <div className="flex items-center space-x-1">
              <div className="flex-1 flex items-center">
                <span className="text-xs text-emerald-700">Sparrow</span>
                <span className="mx-1 text-xs text-emerald-700">↑</span>
                <span className="text-xs text-emerald-700">4%</span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-xs text-blue-700">Robin</span>
                <span className="mx-1 text-xs text-red-700">↓</span>
                <span className="text-xs text-red-700">2%</span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-xs text-amber-700">Cardinal</span>
                <span className="mx-1 text-xs text-emerald-700">↑</span>
                <span className="text-xs text-emerald-700">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;