export default function Skull({ className = '', style = {} }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M50 5C27.9 5 10 22.9 10 45c0 14.3 7.4 26.9 18.6 34.2V85a5 5 0 005 5h32.8a5 5 0 005-5v-5.8C82.6 71.9 90 59.3 90 45 90 22.9 72.1 5 50 5zM37 65a8 8 0 110-16 8 8 0 010 16zm26 0a8 8 0 110-16 8 8 0 010 16z" />
    </svg>
  );
}