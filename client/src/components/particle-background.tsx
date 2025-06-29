import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 30;
const COLORS = ['#22c55e', '#16a34a', '#fff', '#2dd4bf'];

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

export default function ParticleBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = ref.current?.querySelectorAll('.particle');
    if (!particles) return;
    particles.forEach((el, i) => {
      const duration = randomBetween(8, 18);
      const delay = randomBetween(0, 10);
      (el as HTMLElement).style.animationDuration = `${duration}s`;
      (el as HTMLElement).style.animationDelay = `${delay}s`;
    });
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const size = randomBetween(8, 24);
        const left = randomBetween(0, 100);
        const top = randomBetween(0, 100);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return (
          <span
            key={i}
            className="particle absolute rounded-full opacity-30 animate-particle-float"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              background: color,
              filter: 'blur(1px)',
            }}
          />
        );
      })}
      <style>{`
        @keyframes particle-float {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-40px) scale(1.2); opacity: 0.5; }
          100% { transform: translateY(0) scale(1); opacity: 0.3; }
        }
        .animate-particle-float {
          animation-name: particle-float;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
} 