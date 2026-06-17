import CourseIcon from './CourseIcon.jsx';

function StatItem({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yale-800/80 border border-yale-500/25 text-yale-300">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

export default function CourseInfoPanel({ course }) {
  const lessonCount = course.lectures.length;
  const exerciseCount =
    course.exerciseCount ??
    course.lectures.filter((l) => l.available).length * 4;

  return (
    <div className="rounded-2xl border border-yale-400/20 bg-yale-panel/90 p-6 shadow-yale">
      <div className="mb-5 rounded-xl overflow-hidden bg-yale-900/40 border border-yale-500/15 aspect-[5/4] max-h-[200px] flex items-center justify-center p-4">
        <CourseIcon className="w-full max-w-[220px] h-auto" />
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest text-yale-400/90 mb-1">
        {course.code}
      </p>
      <h1 className="text-xl font-bold text-white leading-snug">{course.title}</h1>
      <p className="mt-3 text-sm text-slate-400 leading-relaxed">{course.description}</p>

      <div className="mt-6 pt-5 border-t border-yale-400/20 flex flex-col gap-3">
        <StatItem
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4l3 2" strokeLinecap="round" />
            </svg>
          }
          label={`${lessonCount} Lessons`}
        />
        <StatItem
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 4.5a1.5 1.5 0 0 1 3 0V6h1.5a1.5 1.5 0 0 1 0 3H11v1.5a1.5 1.5 0 0 1-3 0V9H6.5a1.5 1.5 0 0 1 0-3H8V4.5zm8 0a1.5 1.5 0 0 1 3 0V6h1.5a1.5 1.5 0 0 1 0 3H19v1.5a1.5 1.5 0 0 1-3 0V9h-1.5a1.5 1.5 0 0 1 0-3H16V4.5zM8 13.5a1.5 1.5 0 0 1 3 0V15h1.5a1.5 1.5 0 0 1 0 3H11v1.5a1.5 1.5 0 0 1-3 0V18H6.5a1.5 1.5 0 0 1 0-3H8v-1.5zm8 0a1.5 1.5 0 0 1 3 0V15h1.5a1.5 1.5 0 0 1 0 3H19v1.5a1.5 1.5 0 0 1-3 0V18h-1.5a1.5 1.5 0 0 1 0-3H16v-1.5z" />
            </svg>
          }
          label={`${exerciseCount} Exercises`}
        />
      </div>
    </div>
  );
}
