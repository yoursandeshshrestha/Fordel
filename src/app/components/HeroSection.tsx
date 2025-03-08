import React from "react";
import EmailButton from "./EmailButton";
import DownloadButton from "./DownloadButton";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  const handleDownload = () => {
    window.open("/Fordel Studios - Company Profile.pdf", "_blank");
  };

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center items-center z-40 ${className}`}
    >
      <div className="text-center flex flex-col items-center">
        <p className="text-[#FFE94B] text-4xl md:text-7xl font-normal leading-tight">
          no talk,
          <br /> just <span>&lt;code/&gt;</span>
        </p>

        <div className="flex gap-5 items-center mt-8">
          <EmailButton />
          <DownloadButton onClick={handleDownload} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
