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

  useEffect(() => {
    isClient.current = true;

    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array is correct here

  const cells = useMemo(() => {
    if (windowSize.width === 0 || windowSize.height === 0) {
      return null;
    }

    const cellSize = 80;
    const rows = Math.ceil(windowSize.height / cellSize) + 1;
    const cols = Math.ceil(windowSize.width / cellSize) + 1;
    const gridCells: React.ReactElement[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;

        const centerX = x + cellSize / 2;
        const centerY = y + cellSize / 2;
        const distance = Math.sqrt(
          Math.pow(centerX - mousePosition.x, 2) +
            Math.pow(centerY - mousePosition.y, 2)
        );

        const maxDistance = 240;
        const baseOpacity = 0.03;
        const maxAdditionalOpacity = 0.15;

        let opacity = baseOpacity;
        if (distance < maxDistance) {
          const t = 1 - distance / maxDistance;
          opacity += maxAdditionalOpacity * (t * t * t * t * t);
        }

        gridCells.push(
          <div
            key={`${row}-${col}`}
            className="border border-white absolute"
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              left: `${x}px`,
              top: `${y}px`,
              opacity: opacity,
              transition: "opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
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
