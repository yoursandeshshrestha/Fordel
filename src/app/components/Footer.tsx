import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="absolute bottom-4 w-full text-center text-white opacity-50 text-sm z-40 code-font">
      © {currentYear} Fordel Studios Development LLP
    </div>
  );
};

export default Footer;
