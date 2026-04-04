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
  particleColor = "#262626", 
  particleCountFactor = 3000,
  interactionDistance = 150,
  baseSpeed = 0.5,
  mouseForce = -1.5 
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
    const chars = ['+', 'x', '.', '0', '1', '*', '-', '|'];

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
      char: string;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * baseSpeed; 
        this.vy = (Math.random() - 0.5) * baseSpeed;
        this.char = chars[Math.floor(Math.random() * chars.length)];
        this.size = Math.floor(Math.random() * 10) + 10; // Font size
        this.color = particleColor;
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
        ctx.font = `${this.size}px "Space Mono"`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.char, this.x, this.y);
      }
    }

    const initParticles = () => {
      particles = [];
      const count = getParticleCount(canvas.width, canvas.height);
      const safeCount = Math.max(count, 5); 
      for (let i = 0; i < safeCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
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
  }, [particleColor, particleCountFactor, interactionDistance, baseSpeed, mouseForce]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ pointerEvents: 'none' }} 
    />
  );
};