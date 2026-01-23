
import React, { useEffect, useRef } from "react";

interface PizzaFractionProps {
  fraction: string;
}

const PizzaFraction: React.FC<PizzaFractionProps> = ({ fraction }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [num, den] = fraction.split("/").map(Number);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 5;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw pizza base (white circle with red border)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ff3333';
    ctx.stroke();
    
    // Calculate angle for each slice
    const sliceAngle = (Math.PI * 2) / den;
    
    // Draw slices
    for (let i = 0; i < den; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice divider lines
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(startAngle),
        centerY + radius * Math.sin(startAngle)
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ff3333';
      ctx.stroke();
      
      // Fill the active slices (those that are part of the fraction)
      if (i < num) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = '#ff9999';
        ctx.fill();
        
        // Re-draw the divider lines for active slices to make them more visible
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + radius * Math.cos(startAngle),
          centerY + radius * Math.sin(startAngle)
        );
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ff3333';
        ctx.stroke();
      }
    }
  }, [fraction]);
  
  return (
    <div className="flex flex-col items-center mb-8">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={200} 
        className="mb-2"
      />
    </div>
  );
};

export default PizzaFraction;
