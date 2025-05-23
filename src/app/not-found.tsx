import Link from 'next/link';
import { generateSEOMetadata } from '@/libs/seo';

export const metadata = generateSEOMetadata({
  title: "Page Not Found | VESTIGE",
  description: "The page you're looking for doesn't exist or has been moved.",
  noIndex: true
});

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h1 className="font-metal text-6xl tracking-wider mb-4">404</h1>
      <div className="w-16 h-[1px] bg-[#660000] mx-auto mb-6"></div>
      <h2 className="font-gothic text-xl uppercase tracking-wider mb-4">Page Not Found</h2>
      <p className="font-serif text-lg max-w-md mx-auto mb-8 text-black/70">
        The page you re looking for doesnt exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-black text-white font-gothic text-sm uppercase tracking-widest transition-colors duration-300 hover:bg-[#660000]"
      >
        Return Home
      </Link>
    </div>
  );
} 