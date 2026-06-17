import { Link, NavLink } from 'react-router-dom';
import LuxAvatar from './LuxAvatar.jsx';

const navBtn =
  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors';

function navClass({ isActive }) {
  return `${navBtn} ${
    isActive
      ? 'bg-yale-600 text-white'
      : 'text-slate-300 hover:text-white hover:bg-yale-800/60'
  }`;
}

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-30 shrink-0 flex items-center gap-6 px-4 md:px-6 py-3 bg-yale-panel border-b border-yale-500/25"
      aria-label="Main"
    >
      <Link
        to="/"
        className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity"
      >
        <LuxAvatar size={32} />
        <span className="text-lg font-bold text-white tracking-tight">
          Lux<span className="text-yale-400">AI</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/courses" className={navClass}>
          Courses
        </NavLink>
      </div>
    </nav>
  );
}
