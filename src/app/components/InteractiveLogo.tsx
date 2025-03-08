import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { Position } from "@/src/app/utils/gridUtils";

interface InteractiveLogoProps {
  src: string | StaticImageData;
  alt: string;
  mousePosition: Position;
  gridPosition: Position;
  external?: boolean;
  index?: number;
}

const InteractiveLogo: React.FC<InteractiveLogoProps> = ({
  src,
  alt,
  mousePosition,
  gridPosition,
  external = false,
}) => {
  const [opacity, setOpacity] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number>(Math.random() * Math.PI * 2);
  const currentOpacityRef = useRef<number>(0);
  const targetOpacityRef = useRef<number>(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Smooth animation function that runs continuously
    const animate = () => {
      if (isMobile) {
        const speed = 0.005; // Slower, smoother rotation
        angleRef.current += speed;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;

        const spotlightX = centerX + Math.cos(angleRef.current) * radius;
        const spotlightY = centerY + Math.sin(angleRef.current) * radius;

        const dx = gridPosition.x - spotlightX;
        const dy = gridPosition.y - spotlightY;
        const distanceSquared = dx * dx + dy * dy;
        const maxDistanceSquared = 300 * 300;

        const baseOpacity = 0.3;
        const maxAdditionalOpacity = 0.7;

        if (distanceSquared < maxDistanceSquared) {
          const t = 1 - Math.sqrt(distanceSquared) / 300;
          targetOpacityRef.current =
            baseOpacity + maxAdditionalOpacity * (t * t * t);
        } else {
          targetOpacityRef.current = baseOpacity;
        }
      } else {
        // Desktop mode
        const dx = gridPosition.x - mousePosition.x;
        const dy = gridPosition.y - mousePosition.y;
        const distanceSquared = dx * dx + dy * dy;
        const maxDistanceSquared = 240 * 240;

        const baseOpacity = 0;
        const maxAdditionalOpacity = 0.7;

        if (distanceSquared < maxDistanceSquared) {
          const t = 1 - Math.sqrt(distanceSquared) / 240;
          targetOpacityRef.current =
            baseOpacity + maxAdditionalOpacity * (t * t * t);
        } else {
          targetOpacityRef.current = baseOpacity;
        }
      }

      // Smooth interpolation toward target opacity
      currentOpacityRef.current +=
        (targetOpacityRef.current - currentOpacityRef.current) * 0.1;

      // Only update state if opacity changed significantly to avoid unnecessary renders
      if (Math.abs(currentOpacityRef.current - opacity) > 0.01) {
        setOpacity(currentOpacityRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile, mousePosition, gridPosition, opacity]);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-opacity"
      style={{
        left: gridPosition.x,
        top: gridPosition.y,
        opacity: opacity,
        width: "40px",
        height: "40px",
      }}
    >
      {external ? (
        <Image
          src={src.toString()}
          alt={alt}
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
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
          className="w-10 h-10 object-contain"
          priority
        />
      )}
    </div>
  );
};

export default InteractiveLogo;
