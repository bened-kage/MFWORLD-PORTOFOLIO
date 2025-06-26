import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  name: string;
  level: string;
  percentage: number;
  icon: string;
}

export default function SkillBar({ name, level, percentage, icon }: SkillBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => {
            setCurrentWidth(percentage);
          }, 200);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [percentage]);

  return (
    <div ref={ref} className="glass-card rounded-2xl p-6">
      <div className="flex items-center mb-4">
        <i className={`${icon} text-3xl text-neon-cyan mr-4`}></i>
        <h3 className="text-xl font-semibold">{name}</h3>
      </div>
      <div className="skill-bar rounded-full h-3 mb-2">
        <div
          className="skill-progress rounded-full"
          style={{ width: `${currentWidth}%` }}
        ></div>
      </div>
      <p className="text-sm text-slate-400">{level} - {percentage}%</p>
    </div>
  );
}
