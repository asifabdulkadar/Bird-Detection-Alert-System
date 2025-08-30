import React, { useEffect, useRef } from 'react';

const DetectionChart: React.FC = () => {
  // This is a placeholder for an actual chart library
  // In a real implementation, you would use a library like Chart.js or Recharts
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Mock data for bird detections
    const data = [4, 8, 15, 16, 23, 42, 32];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxValue = Math.max(...data);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = (canvas.height - 40) * (1 - i / gridLines) + 10;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
      
      // Label grid lines
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxValue * i / gridLines).toString(), 45, y + 4);
    }
    
    // Bar chart
    const barWidth = (canvas.width - 70) / data.length * 0.8;
    const barSpacing = (canvas.width - 70) / data.length * 0.2;
    const barColor = '#10B981';
    
    data.forEach((value, index) => {
      const x = 50 + index * (barWidth + barSpacing) + barSpacing / 2;
      const barHeight = (canvas.height - 40) * (value / maxValue);
      const y = canvas.height - 30 - barHeight;
      
      // Draw bar
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();
      
      // Draw day label
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(days[index], x + barWidth / 2, canvas.height - 10);
    });
    
    // Chart title
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Bird Detections by Day', 50, 20);
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
    />
  );
};

export default DetectionChart;