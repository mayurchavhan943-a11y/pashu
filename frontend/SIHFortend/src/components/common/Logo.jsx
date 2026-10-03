export const Logo = ({ className = "h-8 w-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
    {/* Veterinary Cross in Teal (primary-600 is usually #0d9488) */}
    <path d="M35 15 h30 v20 h20 v30 h-20 v20 h-30 v-20 h-20 v-30 h20 z" fill="currentColor" />
    {/* Heart cut-out in center */}
    <path d="M50 65 C50 65 35 52 35 42 C35 32 43 30 47 37 L50 40 L53 37 C57 30 65 32 65 42 C65 52 50 65 50 65 Z" fill="white" />
  </svg>
);
