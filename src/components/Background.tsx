"use client";
import React, { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

    class Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      size: number;
      vx: number;
      vy: number;
      opacity: number;
      maxOpacity: number;
      life: number;
      maxLife: number;
      isGlowing: boolean;
      hue: number;
      wanderAngle: number;
      wanderSpeed: number;

      constructor(isGlowing = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.originX = this.x;
        this.originY = this.y;
        this.size = isGlowing ? Math.random() * 2.5 + 1.5 : Math.random() * 1.5 + 0.5;
        this.vx = 0;
        this.vy = 0;
        this.isGlowing = isGlowing;
        this.maxOpacity = isGlowing ? Math.random() * 0.4 + 0.3 : Math.random() * 0.08 + 0.04;
        this.opacity = 0;
        this.maxLife = Math.random() * 600 + 400;
        this.life = Math.random() * this.maxLife;
        this.hue = Math.random() * 40 + 180; // 180-220 range (cyan to blue)
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderSpeed = Math.random() * 0.02 + 0.01;
      }

      update(t: number) {
        // Gentle wandering motion
        this.wanderAngle += (Math.random() - 0.5) * 0.1;

        // Flow field influence
        const flowScale = 0.002;
        const flowAngle = Math.sin(this.x * flowScale + t * 0.001) * Math.PI;

        // Combine wander and flow
        const targetAngle = this.wanderAngle * 0.3 + flowAngle * 0.7;
        const speed = this.isGlowing ? 0.3 : 0.5;

        this.vx += Math.cos(targetAngle) * speed * 0.1;
        this.vy += Math.sin(targetAngle) * speed * 0.1;

        // Gentle pull back toward origin (creates looping effect)
        const dx = this.originX - this.x;
        const dy = this.originY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDrift = 150;

        if (dist > maxDrift) {
          const pullStrength = (dist - maxDrift) * 0.001;
          this.vx += (dx / dist) * pullStrength;
          this.vy += (dy / dist) * pullStrength;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Damping
        this.vx *= 0.96;
        this.vy *= 0.96;

        // Lifecycle
        this.life--;

        // Fade in/out
        const fadeInEnd = this.maxLife * 0.9;
        const fadeOutStart = this.maxLife * 0.1;

        if (this.life > fadeInEnd) {
          this.opacity += (this.maxOpacity - this.opacity) * 0.02;
        } else if (this.life < fadeOutStart) {
          this.opacity *= 0.97;
        } else {
          // Gentle pulsing for glowing particles
          if (this.isGlowing) {
            const pulse = Math.sin(t * 0.02 + this.originX * 0.01) * 0.15 + 0.85;
            this.opacity = this.maxOpacity * pulse;
          }
        }

        // Reset when life ends
        if (this.life <= 0) {
          this.life = this.maxLife;
          this.opacity = 0;
          // Respawn near current position for continuity
          this.originX = this.x + (Math.random() - 0.5) * 200;
          this.originY = this.y + (Math.random() - 0.5) * 200;
          // Keep within bounds
          this.originX = Math.max(0, Math.min(width, this.originX));
          this.originY = Math.max(0, Math.min(height, this.originY));
        }

        // Wrap around screen edges
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
      }

      draw() {
        if (!ctx || this.opacity <= 0) return;

        if (this.isGlowing) {
          // Glowing blue particle with soft halo
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
          );
          gradient.addColorStop(0, `hsla(${this.hue}, 80%, 65%, ${this.opacity})`);
          gradient.addColorStop(0.4, `hsla(${this.hue}, 70%, 55%, ${this.opacity * 0.5})`);
          gradient.addColorStop(1, `hsla(${this.hue}, 60%, 45%, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Bright core
          ctx.fillStyle = `hsla(${this.hue}, 90%, 75%, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dark subtle particle
          ctx.globalAlpha = this.opacity;
          ctx.fillStyle = "#1a1a22";
          ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
          ctx.globalAlpha = 1;
        }
      }
    }

    const init = () => {
      const isMobile = window.innerWidth < 768;
      const darkParticleCount = isMobile ? 600 : 1500;
      const glowingParticleCount = isMobile ? 15 : 40;

      particles = [
        ...Array.from({ length: darkParticleCount }, () => new Particle(false)),
        ...Array.from({ length: glowingParticleCount }, () => new Particle(true)),
      ];
    };

    const animate = () => {
      time++;

      // Clear with very subtle fade for trails
      ctx.fillStyle = "rgba(10, 10, 15, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Sort so glowing particles render on top
      particles.sort((a, b) => (a.isGlowing ? 1 : 0) - (b.isGlowing ? 1 : 0));

      particles.forEach((p) => {
        p.update(time);
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
