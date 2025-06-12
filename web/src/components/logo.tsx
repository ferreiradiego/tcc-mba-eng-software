import Image from "next/image";

export const Logo = () => {
  return (
    <div className="relative w-32 h-16">
      <Image
        src="/logo.png"
        alt="Agile Dev Logo"
        fill
        className="square object-contain"
      />
    </div>
  );
};
