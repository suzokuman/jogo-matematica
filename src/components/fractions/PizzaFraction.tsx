import React, { useEffect, useRef } from "react";

interface PizzaFractionProps {
  fraction: string;
}

const drawPizza = (canvas: HTMLCanvasElement, den: number, filledSlices: number) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = canvas.width;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 5;

  ctx.clearRect(0, 0, size, size);

  // Base da pizza (círculo branco com borda vermelha)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#ff3333";
  ctx.stroke();

  const sliceAngle = (Math.PI * 2) / den;

  for (let i = 0; i < den; i++) {
    const startAngle = i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    // Linhas divisórias
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * Math.cos(startAngle),
      centerY + radius * Math.sin(startAngle)
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff3333";
    ctx.stroke();

    // Fatias preenchidas
    if (i < filledSlices) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = "#ff9999";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(startAngle),
        centerY + radius * Math.sin(startAngle)
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ff3333";
      ctx.stroke();
    }
  }
};

const PizzaFraction: React.FC<PizzaFractionProps> = ({ fraction }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [num, den] = fraction.split("/").map(Number);

  // Quantas pizzas são necessárias para representar a fração
  const pizzaCount = Math.max(1, Math.ceil(num / den));

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    // Limpa pizzas anteriores
    container.innerHTML = "";

    for (let p = 0; p < pizzaCount; p++) {
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 160;
      const filledSlices = Math.min(den, Math.max(0, num - p * den));
      drawPizza(canvas, den, filledSlices);
      container.appendChild(canvas);
    }
  }, [fraction, num, den, pizzaCount]);

  return (
    <div className="flex flex-col items-center mb-8">
      <div ref={canvasRef} className="flex flex-wrap justify-center gap-4 mb-2" />
    </div>
  );
};

export default PizzaFraction;
