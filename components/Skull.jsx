import Image from 'next/image';

export default function Skull({ className = '', style = {}, width = 200, height = 200 }) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      className={className}
    >
      <Image
        src="/skull.svg"
        alt="Skull"
        width={width}
        height={height}
      />
    </div>
  );
}