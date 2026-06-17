import { Link } from 'react-router-dom';
import LuxAvatar from '../components/LuxAvatar.jsx';
import CatalogLayout from '../components/CatalogLayout.jsx';

export default function HomePage() {
  return (
    <CatalogLayout>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 md:py-24 text-center">
        <div className="mb-8 md:mb-10">
          <LuxAvatar size={160} className="mx-auto drop-shadow-lg" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          Lux<span className="text-yale-400">AI</span>
        </h1>

        <p className="max-w-lg text-lg md:text-xl text-slate-300 leading-relaxed mb-3">
          An AI-powered learning experience
        </p>
        <p className="max-w-md text-sm md:text-base text-slate-400 leading-relaxed mb-10">
          Interactive lectures, Socratic tutoring, and voice-guided practice — built to help you
          learn by doing, not just watching.
        </p>

        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yale-500 hover:bg-yale-400 text-white font-semibold text-sm transition-colors shadow-yale"
        >
          Browse courses
        </Link>
      </main>
    </CatalogLayout>
  );
}
