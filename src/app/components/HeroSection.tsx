import React from "react";
import EmailButton from "./EmailButton";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center items-center z-40 ${className}`}
    >
      <div className="text-center flex flex-col items-center">
        <p className="text-[#FFE94B] text-4xl md:text-7xl font-normal leading-tight">
          no talk,
          <br /> just <span>&lt;code/&gt;</span>
        </p>

        <EmailButton />
      </div>
    </div>
  );
};

export default HeroSection;
