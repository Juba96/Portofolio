"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  saturation: number;
  lightness: number;
};

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100, prevX: -100, prevY: -100, targetX: -100, targetY: -100 });
  const animFrameRef = useRef<number>(0);
  const hueRef = useRef(180);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const colorPalettes = [
      [200, 230, 260],   // blues to purples
      [280, 310, 340],   // purples to pinks
      [160, 180, 200],   // teals to blues
    ];
    let paletteIndex = 0;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    let lastEmitTime = 0;

    const emitParticles = (x: number, y: number, speed: number) => {
      const now = performance.now();
      if (now - lastEmitTime < 8) return;
      lastEmitTime = now;

      const count = Math.floor(speed * 0.6) + 2;
      const palette = colorPalettes[paletteIndex];
      const baseHue = palette[Math.floor(Math.random() * palette.length)];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = Math.random() * speed * 0.3 + 0.8;
        const offset = Math.random() * 10;

        particlesRef.current.push({
          x: x + Math.cos(angle) * offset,
          y: y + Math.sin(angle) * offset,
          vx: Math.cos(angle) * vel + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(angle) * vel + (Math.random() - 0.5) * 0.5,
          life: 1,
          maxLife: 60 + Math.random() * 50 + speed * 2,
          size: 14 + Math.random() * 14 + speed * 0.4,
          hue: (baseHue + Math.random() * 50 - 25) % 360,
          saturation: 70 + Math.random() * 20,
          lightness: 55 + Math.random() * 15,
        });
      }

      if (Math.random() < 0.01) {
        paletteIndex = (paletteIndex + 1) % colorPalettes.length;
      }
    };

    const animate = () => {
      // Smooth mouse follow
      const dx = mouseRef.current.targetX - mouseRef.current.x;
      const dy = mouseRef.current.targetY - mouseRef.current.y;
      mouseRef.current.x += dx * 0.35;
      mouseRef.current.y += dy * 0.35;

      const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 25);

      if (speed > 0.3 && mouseRef.current.targetX > 0) {
        emitParticles(mouseRef.current.x, mouseRef.current.y, speed);
        hueRef.current = (hueRef.current + speed * 0.3) % 360;
      }

      // Fade trail
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Swirl/eddy effect
        const angle = Math.sin(p.x * 0.01 + p.y * 0.01 + p.life * 3) * 0.02;
        const cs = Math.cos(angle);
        const sn = Math.sin(angle);
        const nvx = p.vx * cs - p.vy * sn;
        const nvy = p.vx * sn + p.vy * cs;
        p.vx = nvx;
        p.vy = nvy;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life * 0.35;
        const size = p.size * (0.3 + p.life * 0.7);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness + 10}%, ${alpha})`);
        gradient.addColorStop(0.35, `hsla(${(p.hue + 15) % 360}, ${p.saturation - 5}%, ${p.lightness}%, ${alpha * 0.6})`);
        gradient.addColorStop(0.65, `hsla(${(p.hue + 30) % 360}, ${p.saturation - 10}%, ${p.lightness - 5}%, ${alpha * 0.25})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 60%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      // Limit particle count
      if (particles.length > 200) {
        particles.splice(0, particles.length - 200);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", (e) => {
      // Burst on click
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const vel = 3 + Math.random() * 3;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * vel,
          vy: Math.sin(angle) * vel,
          life: 1,
          maxLife: 70 + Math.random() * 40,
          size: 18 + Math.random() * 10,
          hue: (hueRef.current + Math.random() * 80 - 40) % 360,
          saturation: 75 + Math.random() * 20,
          lightness: 60 + Math.random() * 10,
        });
      }
    });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
