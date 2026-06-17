import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const lectureCount = course.lectures.length;
  const liveCount = course.lectures.filter((l) => l.available).length;

  return (
    <Link
      to={`/course/${course.id}`}
      className="group block rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-8 transition-all hover:border-yale-400/60 hover:shadow-yale-lg hover:-translate-y-0.5"
    >
      <p className="text-xs font-bold tracking-widest text-yale-600 uppercase mb-2">
        {course.code}
      </p>
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-yale-700 transition">
        {course.title}
      </h2>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-slate-600">
          {lectureCount} lectures
          {liveCount > 0 && (
            <span className="text-yale-600"> · {liveCount} interactive</span>
          )}
        </span>
        <span className="text-yale-600 font-semibold group-hover:translate-x-0.5 transition-transform">
          Open →
        </span>
      </div>
    </Link>
  );
}
