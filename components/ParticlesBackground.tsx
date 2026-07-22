import React, { useEffect, useRef } from 'react';

interface Props {
  className?: string;
  particleColor?: string;
  lineColor?: string; // Ignored in ASCII mode but kept for interface compatibility
  particleCountFactor?: number; 
  interactionDistance?: number;
  connectDistance?: number; // Ignored
  baseSpeed?: number;
  mouseForce?: number; 
}

export const ParticlesBackground: React.FC<Props> = ({
  className = "absolute inset-0 w-full h-full z-0",
  particleColor = "#94a3b8", // slate-400 for dot
  lineColor = "rgba(148, 163, 184, 0.2)", // subtle slate-400 for line
  particleCountFactor = 6000, // Less dense
  interactionDistance = 150,
  connectDistance = 150,
  baseSpeed = 0.2,
  mouseForce = -0.5 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };

    const getParticleCount = (width: number, height: number) => {
      return Math.floor((width * height) / particleCountFactor);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      type: 'dot' | 'star' | 'grade' | 'tick';
      symbol: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * baseSpeed; 
        this.vy = (Math.random() - 0.5) * baseSpeed;
        this.size = Math.random() * 2 + 0.5; // Small circles
        this.color = particleColor;

        const rand = Math.random();
        if (rand < 0.5) {
          this.type = 'dot';
          this.symbol = '';
        } else if (rand < 0.7) {
          this.type = 'star';
          this.symbol = '★';
          this.size = Math.random() * 4 + 7; // readable size
        } else if (rand < 0.88) {
          this.type = 'grade';
          const grades = ['A+', 'A', 'A-', 'B+', 'B', 'PASS'];
          this.symbol = grades[Math.floor(Math.random() * grades.length)];
          this.size = Math.random() * 4 + 8;
        } else {
          this.type = 'tick';
          this.symbol = '✓';
          this.size = Math.random() * 3 + 8;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse Interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < interactionDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (interactionDistance - distance) / interactionDistance;
            
            const directionX = forceDirectionX * force * mouseForce; 
            const directionY = forceDirectionY * force * mouseForce;
            
            this.x += directionX; 
            this.y += directionY;
        }
      }

      draw() {
        if (!ctx) return;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dxCenter = this.x - centerX;
        const dyCenter = this.y - centerY;
        const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        
        // Attenuate opacity significantly around the center text area (within ~240px)
        const centerFactor = Math.min(1, Math.max(0.04, (distCenter - 150) / 200));

        ctx.save();
        ctx.globalAlpha = centerFactor;

        if (this.type === 'dot') {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else {
          ctx.fillStyle = this.color;
          ctx.globalAlpha = 0.3 * centerFactor; // keep it subtle in the background
          if (this.type === 'star') {
            ctx.font = `${this.size}px serif`;
          } else {
            ctx.font = `500 ${this.size}px system-ui, sans-serif`;
          }
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.symbol, this.x, this.y);
        }
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = getParticleCount(canvas.width, canvas.height);
      const safeCount = Math.max(count, 10); 
      for (let i = 0; i < safeCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Calculate center factor for particle i
        const dxi = particles[i].x - centerX;
        const dyi = particles[i].y - centerY;
        const disti = Math.sqrt(dxi * dxi + dyi * dyi);
        const centerFactorI = Math.min(1, Math.max(0.04, (disti - 150) / 200));

        if (centerFactorI < 0.1) continue; // Skip lines near center

        // Draw lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectDistance) {
            const dxj = particles[j].x - centerX;
            const dyj = particles[j].y - centerY;
            const distj = Math.sqrt(dxj * dxj + dyj * dyj);
            const centerFactorJ = Math.min(1, Math.max(0.04, (distj - 150) / 200));
            const lineCenterAlpha = Math.min(centerFactorI, centerFactorJ);

            ctx.save();
            ctx.globalAlpha = lineCenterAlpha;
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1 - (distance / connectDistance);
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor, lineColor, particleCountFactor, interactionDistance, connectDistance, baseSpeed, mouseForce]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ pointerEvents: 'none' }} 
    />
  );
};