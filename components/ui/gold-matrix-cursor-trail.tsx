"use client";

import { useEffect, useRef } from "react";

type TrailParticle = {
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  fontSize: number;
  character: string;
  createdAt: number;
  lifetime: number;
  nextGlitchAt: number;
};

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAX_PARTICLES = 500;

function randomCharacter() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

export function GoldMatrixCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      console.error("Unable to initialize the gold cursor trail canvas.");
      return;
    }

    const particles: TrailParticle[] = [];
    let previousPoint: { x: number; y: number } | null = null;
    let frameId: number | null = null;
    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const addTrail = (event: PointerEvent) => {
      const point = { x: event.clientX, y: event.clientY };

      if (!previousPoint) {
        previousPoint = point;
        const now = performance.now();
        particles.push({
          x: point.x,
          y: point.y,
          driftX: 0,
          driftY: 0,
          fontSize: 16 + Math.random() * 6,
          character: randomCharacter(),
          createdAt: now,
          lifetime: 500 + Math.random() * 500,
          nextGlitchAt: now + 70 + Math.random() * 130,
        });
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      const deltaX = point.x - previousPoint.x;
      const deltaY = point.y - previousPoint.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 0) {
        const steps = Math.ceil(distance / 12);
        const now = performance.now();

        for (let step = 1; step <= steps; step += 1) {
          const progress = step / steps;
          particles.push({
            x: previousPoint.x + deltaX * progress,
            y: previousPoint.y + deltaY * progress,
            driftX: (Math.random() - 0.5) * 18,
            driftY: (Math.random() - 0.5) * 18,
            fontSize: 16 + Math.random() * 6,
            character: randomCharacter(),
            createdAt: now,
            lifetime: 500 + Math.random() * 500,
            nextGlitchAt: now + 70 + Math.random() * 130,
          });
        }

        if (particles.length > MAX_PARTICLES) {
          particles.splice(0, particles.length - MAX_PARTICLES);
        }

        if (frameId === null) {
          frameId = window.requestAnimationFrame(animate);
        }
      }

      previousPoint = point;
    };

    const animate = (now: number) => {
      context.clearRect(0, 0, width, height);
      context.shadowColor = "#FFD700";
      context.shadowBlur = 12;

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        const age = now - particle.createdAt;
        const alpha = Math.max(0, 1 - age / particle.lifetime);

        if (alpha <= 0) {
          particles.splice(index, 1);
          continue;
        }

        if (now >= particle.nextGlitchAt) {
          particle.character = randomCharacter();
          particle.nextGlitchAt = now + 70 + Math.random() * 130;
        }

        const elapsedSeconds = age / 1000;
        const x = particle.x + particle.driftX * elapsedSeconds;
        const y = particle.y + particle.driftY * elapsedSeconds;

        context.globalAlpha = alpha;
        context.font = `${particle.fontSize}px monospace`;
        context.lineWidth = 0.6;
        context.strokeStyle = "#FFD700";
        context.fillStyle = "#FFD700";
        context.strokeText(particle.character, x, y);
        context.fillText(particle.character, x, y);
      }

      context.globalAlpha = 1;
      frameId =
        particles.length > 0 ? window.requestAnimationFrame(animate) : null;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", addTrail);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", addTrail);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
