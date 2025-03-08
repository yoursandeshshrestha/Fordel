import Image from "next/image";
import ForderLogo from "@/public/fordel-logo.png";

export function Header() {
  return (
    <div className="pt-10 flex justify-center items-center relative z-50">
      <Image src={ForderLogo} alt="ForderLogo" className="w-10 h-10" />
    </div>
  );
}
