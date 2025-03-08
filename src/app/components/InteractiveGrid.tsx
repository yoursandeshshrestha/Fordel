"use client";
import React, { useState, useEffect, useRef, ReactNode, useMemo } from "react";

export interface Position {
  x: number;
  y: number;
}

interface InteractiveGridProps {
  children: ReactNode;
}

const InteractiveGrid: React.FC<InteractiveGridProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const isClient = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const targetMousePosition = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    isClient.current = true;

    // Safely get window dimensions
    const updateWindowSize = () => {
      if (typeof window !== "undefined") {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateWindowSize();

    const handleResize = () => {
      updateWindowSize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        targetMousePosition.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    // Use requestAnimationFrame for smoother mouse tracking
    const updatePosition = () => {
      // Implement smooth interpolation between current and target position
      const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
      };

      setMousePosition((prev) => ({
        x: lerp(prev.x, targetMousePosition.current.x, 0.15),
        y: lerp(prev.y, targetMousePosition.current.y, 0.15),
      }));

      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const cells = useMemo(() => {
    if (windowSize.width === 0 || windowSize.height === 0) {
      return null;
    }

    const cellSize = 80;
    const rows = Math.ceil(windowSize.height / cellSize);
    const cols = Math.ceil(windowSize.width / cellSize);
    const gridCells: React.ReactElement[] = [];

    // Calculate cell visibility more efficiently
    const maxDistance = 240;
    const maxDistanceSquared = maxDistance * maxDistance;
    const baseOpacity = 0.05;
    const maxAdditionalOpacity = 0.15;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;

        const centerX = x + cellSize / 2;
        const centerY = y + cellSize / 2;

        // Use squared distance for performance (avoid square root)
        const distanceSquared =
          (centerX - mousePosition.x) * (centerX - mousePosition.x) +
          (centerY - mousePosition.y) * (centerY - mousePosition.y);

        let opacity = baseOpacity;
        if (distanceSquared < maxDistanceSquared) {
          const t = 1 - Math.sqrt(distanceSquared) / maxDistance;
          opacity += maxAdditionalOpacity * (t * t * t);
        }

        gridCells.push(
          <div
            key={`${row}-${col}`}
            className="border border-white absolute will-change-opacity"
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              left: `${x}px`,
              top: `${y}px`,
              opacity: opacity,
              transition: "opacity 0.15s ease-out",
            }}
          />
        );
      }
    }

    return gridCells;
  }, [windowSize, mousePosition]);

  if (!isClient.current) {
    return <div className="fixed inset-0">{children}</div>;
  }

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
    >
      {cells}
      <div className="relative z-10 pointer-events-auto">{children}</div>
    </div>
  );
};

export default InteractiveGrid;
