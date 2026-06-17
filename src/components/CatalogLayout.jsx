import Navbar from './Navbar.jsx';

/**
 * Scrollable shell for home / course catalog routes.
 * Lecture workspace uses its own h-screen overflow-hidden layout.
 */
export default function CatalogLayout({ children }) {
  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-yale-canvas text-slate-100">
      <Navbar />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  );
}
