import React from "react";

interface DownloadButtonProps {
  onClick: () => void;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-auto cursor-pointer h-[42px] text-nowrap px-6 py-2 bg-transparent text-[#FFFBD0] border border-[#FFFBD0] rounded-full font-medium flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out hover:bg-[#FFE94B] hover:text-black font-fira-mono group ${className}`}
    >
      <span>download company profile</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 ease-in-out transform group-hover:translate-y-1"
      >
        <path
          d="M12 5V19M12 19L5 12M12 19L19 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default DownloadButton;
