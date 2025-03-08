import React from "react";

interface EmailButtonProps {
  emailAddress?: string;
  className?: string;
}

const EmailButton: React.FC<EmailButtonProps> = ({
  emailAddress = "abhishek@fordelstudios.com",
  className = "",
}) => {
  return (
    <a
      href={`mailto:${emailAddress}`}
      className={`w-[270px] mt-8 px-6 py-2 bg-[#FFFBD0] text-black rounded-full font-medium flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out hover:bg-[#FFE94B] font-fira-mono group ${className}`}
    >
      <span>email us</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 ease-in-out transform group-hover:translate-x-1"
      >
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export default EmailButton;
