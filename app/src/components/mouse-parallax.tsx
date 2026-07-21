"use client";

import { ReactNode, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

type Props = {
  children: ReactNode;
  range?: number;
  rotationRange?: number;
  className?: string;
};

export function MouseParallax({ children, range = 12, rotationRange = 4, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 150, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-range, range], [rotationRange, -rotationRange]);
  const rotateY = useTransform(xSpring, [-range, range], [-rotationRange, rotationRange]);

  useEffect(() => {
    if (!ref.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const normalizedX = (mouseX / (rect.width / 2)) * range;
      const normalizedY = (mouseY / (rect.height / 2)) * range;

      x.set(Math.max(-range, Math.min(range, normalizedX)));
      y.set(Math.max(-range, Math.min(range, normalizedY)));
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y, range]);

  return (
    <motion.div
      ref={ref}
      style={{
        x: xSpring,
        y: ySpring,
        rotateX,
        rotateY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
