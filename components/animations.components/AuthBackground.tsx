"use client";

import {
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  useMemo,
  useEffect,
  useState,
} from "react";

type Bird = {
  id: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  depth: number;
  color: string;
};

const COLORS = [
  "#caa028",
  "#537692",
  "#b3cde4",
];

export default function AuthBackground() {
  const [mounted, setMounted] = useState(false);
  const [viewport, setViewport] = useState({
    width: 1920,
    height: 1080,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);

    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouseX, mouseY]);

  const rotateX = useTransform(
    mouseY,
    [0, viewport.height],
    [4, -4]
  );

  const rotateY = useTransform(
    mouseX,
    [0, viewport.width],
    [-4, 4]
  );

  const orb1X = useTransform(
    mouseX,
    [0, viewport.width],
    [-40, 40]
  );

  const orb1Y = useTransform(
    mouseY,
    [0, viewport.height],
    [-40, 40]
  );

  const orb2X = useTransform(
    mouseX,
    [0, viewport.width],
    [40, -40]
  );

  const orb2Y = useTransform(
    mouseY,
    [0, viewport.height],
    [40, -40]
  );

  const spotlightX = useTransform(
    mouseX,
    (v) => v - 200
  );

  const spotlightY = useTransform(
    mouseY,
    (v) => v - 200
  );

  const birds = useMemo<Bird[]>(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const depth = Math.random();

        return {
          id: i,
          startY: Math.random() * 100,
          depth,
          size: 14 + depth * 30,
          duration: 25 - depth * 12,
          delay: Math.random() * 20,
          color:
            COLORS[
              Math.floor(
                Math.random() * COLORS.length
              )
            ],
        };
      }),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        duration: 8 + Math.random() * 12,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
    >
      {/* Animated Gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(-45deg,#001b2e,#102f43,#18364d,#001b2e)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: [
            "0% 50%",
            "100% 50%",
            "0% 50%",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Cursor Spotlight */}
      <motion.div
        className="pointer-events-none absolute h-[400px] w-[400px] rounded-full"
        style={{
          x: spotlightX,
          y: spotlightY,
          background:
            "radial-gradient(circle, rgba(202,160,40,0.18), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orb 1 */}
      <motion.div
        className="absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl"
        style={{
          x: orb1X,
          y: orb1Y,
          background:
            "rgba(202,160,40,0.15)",
        }}
      />

      {/* Orb 2 */}
      <motion.div
        className="absolute bottom-10 right-10 h-96 w-96 rounded-full blur-3xl"
        style={{
          x: orb2X,
          y: orb2Y,
          background:
            "rgba(83,118,146,0.15)",
        }}
      />

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Birds */}
      {birds.map((bird) => (
        <motion.div
          key={bird.id}
          className="absolute"
          initial={{
            x: "-10vw",
            y: `${bird.startY}vh`,
          }}
          animate={{
            x: "110vw",
          }}
          transition={{
            duration: bird.duration,
            delay: bird.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            opacity:
              0.2 + bird.depth * 0.8,
            filter: `
              blur(${(1 - bird.depth) * 1.5}px)
              drop-shadow(0 0 6px ${bird.color})
            `,
          }}
        >
          <motion.div
            animate={{
              rotate: [-8, 8, -8],
            }}
            transition={{
              duration:
                0.5 + bird.depth * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width={bird.size}
              height={bird.size / 2}
              viewBox="0 0 32 16"
              fill="none"
            >
              <path
                d="M1 8C5 2 10 2 16 8C22 2 27 2 31 8"
                stroke={bird.color}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </motion.div>
  );
}