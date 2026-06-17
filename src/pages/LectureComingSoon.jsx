import { Link, Navigate, useParams } from 'react-router-dom';
import { getLecture, lecturePdfUrl } from '../data/catalog.js';
import CatalogLayout from '../components/CatalogLayout.jsx';

export default function LectureComingSoon() {
  const { courseId, lectureSlug } = useParams();
  const data = getLecture(courseId, lectureSlug);

  if (!data) {
    return <Navigate to="/" replace />;
  }

  const { course, lecture } = data;

  const pdfUrl = lecturePdfUrl(lecture.pdfFilename);

  return (
    <CatalogLayout>
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-6 border-b border-yale-400/25">
        <Link
          to={`/course/${courseId}`}
          className="text-xs text-slate-500 hover:text-yale-400"
        >
          ← {course.title}
        </Link>
        <h1 className="text-xl font-bold mt-3">
          Lecture {lecture.number}: {lecture.title}
        </h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-md mx-auto">
        <p className="text-yale-400/90 text-sm font-semibold uppercase tracking-wide mb-2">
          Coming soon
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          LuxAI interactive lessons for this lecture are on the way. Lecture 1 is live now.
        </p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 px-6 py-3 rounded-full border border-slate-700 text-slate-300 text-sm hover:border-yale-500/50 transition"
        >
          Open slide PDF
        </a>
      </main>
    </div>
    </CatalogLayout>
  );
}
