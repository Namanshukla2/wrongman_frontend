import Image from 'next/image';

export default function Skull({ className = '', style = {}, width = 100, height = 100 }) {
  return (
    <Image
      src="/skull.svg"
      alt="Skull"
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
}