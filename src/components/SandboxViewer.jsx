import { useApp } from '../context/AppContext.jsx';

export default function SandboxViewer() {
  const { sandboxSrcDoc } = useApp();

  if (!sandboxSrcDoc) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
        No sandbox content loaded.
      </div>
    );
  }

  return (
    <iframe
      title="AI-generated visualization sandbox"
      sandbox="allow-scripts"
      srcDoc={sandboxSrcDoc}
      className="absolute inset-0 w-full h-full border-0"
    />
  );
}
