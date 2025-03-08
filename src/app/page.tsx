"use client";
import React, { useState, useEffect } from "react";
import InteractiveGrid from "@/src/app/components/InteractiveGrid";
import InteractiveLogo from "@/src/app/components/InteractiveLogo";
import LogoData from "@/src/app/data/LogoData";
import { calculateGridPositions, Position } from "@/src/app/utils/gridUtils";
import Footer from "@/src/app/components/Footer";
import { Header } from "./components/Header";
import HeroSection from "./components/HeroSection";

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [gridPositions, setGridPositions] = useState<Position[]>([]);
  const cellSize = 80;

  useEffect(() => {
    const handleResize = () => {
      const positions = calculateGridPositions(0, cellSize);
      setGridPositions(positions);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="bg-black h-screen w-full relative overflow-hidden">
      <Header />
      <HeroSection />
      <Footer />
      <InteractiveGrid>
        {gridPositions.map((position, index) => (
          <InteractiveLogo
            key={`logo-${index}`}
            src={LogoData[index % LogoData.length].src}
            alt={LogoData[index % LogoData.length].alt}
            mousePosition={mousePosition}
            gridPosition={position}
            external={LogoData[index % LogoData.length].external}
            index={index}
          />
        ))}
      </InteractiveGrid>
    </main>
  );
};

export default Home;
