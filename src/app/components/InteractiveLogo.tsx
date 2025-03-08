import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { Position } from "./InteractiveGrid";

interface InteractiveLogoProps {
  src: string | StaticImageData;
  alt: string;
  mousePosition: Position;
  gridPosition: Position;
  external?: boolean;
}

const InteractiveLogo: React.FC<InteractiveLogoProps> = ({
  src,
  alt,
  mousePosition,
  gridPosition,
  external = false,
}) => {
  const [opacity, setOpacity] = useState<number>(0.0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number>(Math.random() * Math.PI * 2); // Random starting angle

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);

      // Clean up animation frame if it exists
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle mobile circular animation
  useEffect(() => {
    if (isMobile) {
      // Start circular animation
      const animate = () => {
        // Speed of rotation - adjust as needed
        const speed = 0.01;
        angleRef.current += speed;

        // Update spotlight position based on the center of the screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3; // Adjust radius as needed

        const spotlightX = centerX + Math.cos(angleRef.current) * radius;
        const spotlightY = centerY + Math.sin(angleRef.current) * radius;

        // Calculate distance from spotlight to this logo
        const distance = Math.sqrt(
          Math.pow(gridPosition.x - spotlightX, 2) +
            Math.pow(gridPosition.y - spotlightY, 2)
        );

        // Same opacity calculation as before
        const maxDistance = 300;
        const baseOpacity = 0;
        const maxAdditionalOpacity = 0.5;

        let newOpacity = baseOpacity;
        if (distance < maxDistance) {
          const t = 1 - distance / maxDistance;
          newOpacity += maxAdditionalOpacity * (t * t * t * t * t);
        }

        setOpacity(newOpacity);

        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Start animation
      animationFrameRef.current = requestAnimationFrame(animate);

      // Cleanup on unmount or when isMobile changes
      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // For desktop, use the mouse position to calculate opacity
      const distance = Math.sqrt(
        Math.pow(gridPosition.x - mousePosition.x, 2) +
          Math.pow(gridPosition.y - mousePosition.y, 2)
      );

      const maxDistance = 300;
      const baseOpacity = 0;
      const maxAdditionalOpacity = 0.9;

      let newOpacity = baseOpacity;
      if (distance < maxDistance) {
        const t = 1 - distance / maxDistance;
        newOpacity += maxAdditionalOpacity * (t * t * t * t * t);
      }

      setOpacity(newOpacity);
    }
  }, [isMobile, mousePosition, gridPosition]);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: gridPosition.x,
        top: gridPosition.y,
        opacity: opacity,
        transition: "opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
    >
      {external ? (
        <Image
          src={src.toString()}
          alt={alt}
          width={40}
          height={40}
          className="w-10 h-10"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={40}
          height={40}
          className="w-10 h-10"
          priority
        />
      )}
    </div>
  );
};

export default InteractiveLogo;
