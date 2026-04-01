"use client";
import React, { useEffect, useRef } from "react";

// 2D "A" backbone (key points) - flipped so apex points up
const A_BASE = [
  // Left leg
  { x: 0.3, y: 0.9 },
  { x: 0.4, y: 0.5 },
  { x: 0.5, y: 0.1 },
  // Right leg
  { x: 0.5, y: 0.1 },
  { x: 0.6, y: 0.5 },
  { x: 0.7, y: 0.9 },
  // Crossbar
  { x: 0.42, y: 0.5 },
  { x: 0.58, y: 0.5 }
];

// Smooth interpolation
function interpolate(p1: { x: number; y: number }, p2: { x: number; y: number }, steps = 8) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t
    });
  }
  return pts;
}

// Build smooth 2D A
const A_MAP = [
  ...interpolate(A_BASE[0], A_BASE[1]),
  ...interpolate(A_BASE[1], A_BASE[2]),
  ...interpolate(A_BASE[3], A_BASE[4]),
  ...interpolate(A_BASE[4], A_BASE[5]),
  ...interpolate(A_BASE[6], A_BASE[7], 6)
];

type AppMode = "swirl" | "letter";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<AppMode>("swirl");
  const scrollRef = useRef(0);

  useEffect(() => {
    const sequence: AppMode[] = ["letter", "swirl"];
    let currentIndex = 0;
    let intervalId: NodeJS.Timeout;

    // Initial 2 second delay, then cycle with different durations
    const cycleModes = () => {
      modeRef.current = sequence[currentIndex];
      // "letter" (A shape) = 5 seconds, "swirl" = 10 seconds
      const duration = sequence[currentIndex] === "letter" ? 5000 : 10000;
      intervalId = setTimeout(() => {
        currentIndex = (currentIndex + 1) % sequence.length;
        cycleModes();
      }, duration);
    };

    const initialTimeout = setTimeout(() => {
      cycleModes();
    }, 2000);

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      if (intervalId) clearTimeout(intervalId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;
    let animationFrameId: number;
    let prevWidth = window.innerWidth;

    const getSegments = (w: number, h: number, scrollY: number) => {
      const currentMode = modeRef.current;
      if (currentMode === "swirl") return [];

      const isMobile = w < 768;
      const scaleFactor = isMobile ? 0.55 : 0.75;
      const s = Math.min(w, h) * scaleFactor;
      const cx = w / 2;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const triggerPoint = maxScroll * 0.82;
      const scrollPastTrigger = Math.max(0, scrollY - triggerPoint);
      const cy = h / 2 + scrollPastTrigger * 0.5;

      const project = (pt: { x: number; y: number }) => ({
        x: cx + (pt.x - 0.5) * s,
        y: cy + (pt.y - 0.5) * s,
      });

      return A_MAP.slice(0, -1).map((pt, i) => ({
        a: project(pt),
        b: project(A_MAP[i + 1]),
      }));
    };

    const getClosestPoint = (
      px: number,
      py: number,
      a: { x: number; y: number },
      b: { x: number; y: number }
    ) => {
      const dx = b.x - a.x,
        dy = b.y - a.y;
      const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / (dx * dx + dy * dy)));
      return { x: a.x + t * dx, y: a.y + t * dy };
    };

    class Particle {
      x!: number;
      y!: number;
      size!: number;
      vx!: number;
      vy!: number;
      opacity!: number;
      life!: number;
      maxLife!: number;

      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.maxLife = Math.random() * 400 + 400;
        this.life = this.maxLife;
        this.opacity = 0;
      }

      update(t: number, segments: { a: { x: number; y: number }; b: { x: number; y: number } }[]) {
        const mode = modeRef.current;
        const isMappingMode = mode !== "swirl";

        const zoom = isMappingMode ? 0.0015 : 0.0035;
        const angle =
          (Math.sin(this.x * zoom + t * 0.0005) + Math.cos(this.y * zoom + t * 0.0005)) *
          Math.PI *
          2;
        const accel = isMappingMode ? 0.06 : 0.2;

        this.vx += Math.cos(angle) * accel;
        this.vy += Math.sin(angle) * accel;

        if (isMappingMode && segments.length > 0) {
          let bestPoint = { x: 0, y: 0 },
            minDSq = Infinity;
          for (const seg of segments) {
            const cp = getClosestPoint(this.x, this.y, seg.a, seg.b);
            const dSq = (this.x - cp.x) ** 2 + (this.y - cp.y) ** 2;
            if (dSq < minDSq) {
              minDSq = dSq;
              bestPoint = cp;
            }
          }
          const dist = Math.sqrt(minDSq);
          if (dist < 150) {
            const pull = (150 - dist) / 150;
            this.vx += (bestPoint.x - this.x) * 0.005 * pull;
            this.vy += (bestPoint.y - this.y) * 0.005 * pull;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.93;
        this.vy *= 0.93;

        this.life--;
        if (this.life > this.maxLife * 0.8) this.opacity += 0.01;
        if (this.life < 50) this.opacity -= 0.02;
        if (this.life <= 0 || this.x < -100 || this.x > width + 100) this.init();
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = Math.max(0, Math.min(this.opacity, 0.4));
        ctx.fillStyle = "#4fc3f7";
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
      }
    }

    const init = () => {
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 1200 : 3000;
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const animate = () => {
      time++;
      const segments = getSegments(width, height, scrollRef.current);

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      particles.forEach((p) => {
        p.update(time, segments);
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      if (newWidth === prevWidth) return;
      prevWidth = newWidth;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-[#0a0a0f] -z-30" />
      {/* Background orbs */}
      <div
        className="bg-orb -z-20"
        style={{
          width: 500,
          height: 500,
          background: "#4fc3f7",
          top: "-10%",
          left: "-10%",
        }}
      />
      <div
        className="bg-orb -z-20"
        style={{
          width: 400,
          height: 400,
          background: "#7c4dff",
          bottom: "-10%",
          right: "-10%",
          animationDelay: "-7s",
        }}
      />
      <div
        className="bg-orb -z-20"
        style={{
          width: 300,
          height: 300,
          background: "#00e5ff",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animationDelay: "-14s",
        }}
      />
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
    </>
  );
}
