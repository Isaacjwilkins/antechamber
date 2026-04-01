"use client";
import React, { useEffect, useRef } from "react";

const PIANO_MAP = [
  { x: 0.25, y: 0.80 }, { x: 0.75, y: 0.80 }, { x: 0.75, y: 0.60 }, { x: 0.74, y: 0.53 },
  { x: 0.72, y: 0.48 }, { x: 0.70, y: 0.46 }, { x: 0.67, y: 0.44 }, { x: 0.64, y: 0.43 },
  { x: 0.61, y: 0.42 }, { x: 0.59, y: 0.42 }, { x: 0.57, y: 0.42 }, { x: 0.54, y: 0.41 },
  { x: 0.51, y: 0.36 }, { x: 0.49, y: 0.29 }, { x: 0.47, y: 0.23 }, { x: 0.45, y: 0.20 },
  { x: 0.41, y: 0.19 }, { x: 0.32, y: 0.19 }, { x: 0.27, y: 0.20 }, { x: 0.25, y: 0.23 },
  { x: 0.25, y: 0.28 }, { x: 0.25, y: 0.80 }
];

const GUITAR_MAP = [
  { x: 0.16, y: 0.80 }, { x: 0.27, y: 0.87 }, { x: 0.39, y: 0.88 }, { x: 0.48, y: 0.76 },
  { x: 0.45, y: 0.69 }, { x: 0.45, y: 0.66 }, { x: 0.51, y: 0.59 }, { x: 0.56, y: 0.58 },
  { x: 0.62, y: 0.48 }, { x: 0.54, y: 0.37 }, { x: 0.76, y: 0.12 }, { x: 0.73, y: 0.09 },
  { x: 0.50, y: 0.35 }, { x: 0.37, y: 0.33 }, { x: 0.30, y: 0.43 }, { x: 0.30, y: 0.48 },
  { x: 0.30, y: 0.51 }, { x: 0.25, y: 0.58 }, { x: 0.22, y: 0.59 }, { x: 0.16, y: 0.60 },
  { x: 0.11, y: 0.71 }, { x: 0.15, y: 0.80 }
];

type AppMode = "swirl" | "piano" | "guitar";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<AppMode>("swirl");
  const scrollRef = useRef(0);

  useEffect(() => {
    const sequence: AppMode[] = ["piano", "swirl", "guitar", "swirl"];
    let currentIndex = 0;
    let intervalId: NodeJS.Timeout;

    const initialTimeout = setTimeout(() => {
      modeRef.current = sequence[currentIndex];
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % sequence.length;
        modeRef.current = sequence[currentIndex];
      }, 6000);
    }, 2000);

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      if (intervalId) clearInterval(intervalId);
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

      const activeMap = currentMode === "piano" ? PIANO_MAP : GUITAR_MAP;

      const project = (pt: { x: number; y: number }) => ({
        x: cx + (pt.x - 0.5) * s,
        y: cy + (pt.y - 0.5) * s,
      });

      return activeMap.slice(0, -1).map((pt, i) => ({
        a: project(pt),
        b: project(activeMap[i + 1]),
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
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.maxLife = Math.random() * 250 + 250;
        this.life = this.maxLife;
        this.opacity = 0;
      }

      update(t: number, segments: { a: { x: number; y: number }; b: { x: number; y: number } }[]) {
        const mode = modeRef.current;
        const isMappingMode = mode !== "swirl";

        const zoom = isMappingMode ? 0.003 : 0.005;
        const angle =
          (Math.sin(this.x * zoom + t * 0.004) + Math.cos(this.y * zoom + t * 0.004)) *
          Math.PI *
          2;
        const accel = isMappingMode ? 0.2 : 0.5;

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
          if (dist < 120) {
            const pull = (120 - dist) / 120;
            // Stronger pull for tighter paths
            this.vx += (bestPoint.x - this.x) * 0.025 * pull;
            this.vy += (bestPoint.y - this.y) * 0.025 * pull;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;

        this.life--;
        if (this.life > this.maxLife * 0.8) this.opacity += 0.015;
        if (this.life < 50) this.opacity -= 0.025;
        if (this.life <= 0 || this.x < -100 || this.x > width + 100) this.init();
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = Math.max(0, Math.min(this.opacity, 0.12));
        ctx.fillStyle = "#2d2d38";
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
      }
    }

    const init = () => {
      const isMobile = window.innerWidth < 768;
      // Half the particles
      const particleCount = isMobile ? 400 : 1000;
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
