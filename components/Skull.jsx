import Image from "next/image";

const Skull = ({ className = "w-9 h-9" }) => (
  <Image
    src="/skull.svg"
    alt="Skull Icon"
    width={24}
    height={24}
    className={className}
  />
);

export default Skull;