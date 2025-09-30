import React, { useEffect, useRef } from "react";

function Weather3D({ weather, temperature }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 200;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (weather?.includes('rain')) {
        drawRain(ctx);
      } else if (weather?.includes('snow')) {
        drawSnow(ctx);
      } else if (weather?.includes('sun') || weather?.includes('clear')) {
        drawSun(ctx, temperature);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [weather, temperature]);

  const drawRain = (ctx) => {
    const time = Date.now() * 0.01;
    for (let i = 0; i < 50; i++) {
      const x = (i * 6 + time) % 300;
      const y = (i * 4 + time * 2) % 200;
      ctx.strokeStyle = '#74b9ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 2, y + 10);
      ctx.stroke();
    }
  };

  const drawSnow = (ctx) => {
    const time = Date.now() * 0.005;
    for (let i = 0; i < 30; i++) {
      const x = (i * 10 + Math.sin(time + i) * 20) % 300;
      const y = (i * 7 + time * 30) % 200;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawSun = (ctx, temp) => {
    const time = Date.now() * 0.003;
    const centerX = 150;
    const centerY = 100;
    const radius = 30 + Math.sin(time) * 5;
    
    ctx.fillStyle = temp > 25 ? '#ff6b35' : '#ffd93d';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI / 4) + time;
      const x1 = centerX + Math.cos(angle) * (radius + 10);
      const y1 = centerY + Math.sin(angle) * (radius + 10);
      const x2 = centerX + Math.cos(angle) * (radius + 20);
      const y2 = centerY + Math.sin(angle) * (radius + 20);
      
      ctx.strokeStyle = temp > 25 ? '#ff6b35' : '#ffd93d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  return <canvas ref={canvasRef} className="weather-3d-canvas" />;
}

export default Weather3D;