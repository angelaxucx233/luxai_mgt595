import { Link } from 'react-router-dom';

function LectureCardContent({ lecture, isFeatured, linked }) {
  return (
    <>
      <div
        className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
          isFeatured
            ? 'bg-gradient-to-br from-teal-400 to-yale-500 text-white border-2 border-teal-300 shadow-md shadow-teal-500/30'
            : 'bg-slate-100 text-slate-400 border border-slate-200'
        }`}
      >
        {lecture.number}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[10px] uppercase tracking-wider mb-0.5 ${
            isFeatured ? 'text-teal-600 font-semibold' : 'text-slate-400'
          }`}
        >
          Lecture {lecture.number}
        </p>
        <h3
          className={`text-base font-semibold truncate ${
            isFeatured
              ? 'text-yale-800 group-hover:text-yale-900'
              : 'text-slate-500'
          }`}
        >
          {lecture.title}
        </h3>
        <p className="text-xs mt-1.5">
          {isFeatured ? (
            <span className="text-teal-600 font-semibold">Interactive · Lux tutor · Live now</span>
          ) : (
            <span className="text-slate-400">Coming soon</span>
          )}
        </p>
      </div>
      {linked && (
        <span className="self-center text-teal-500 group-hover:text-teal-600 text-sm shrink-0 font-semibold">
          →
        </span>
      )}
    </>
  );
}

export default function LectureCard({ courseId, lecture }) {
  const isFeatured = lecture.slug === '04';

  if (!isFeatured) {
    return (
      <div
        className="flex gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-5 opacity-70 cursor-default select-none"
        aria-disabled
      >
        <LectureCardContent lecture={lecture} isFeatured={false} linked={false} />
      </div>
    );
  }

  const to = `/course/${courseId}/lecture/${lecture.slug}`;

  return (
    <Link
      to={to}
      className="group flex gap-4 rounded-2xl border-2 border-teal-400 bg-white p-5 transition-all shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/30 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/30 hover:ring-teal-300/40"
    >
      <LectureCardContent lecture={lecture} isFeatured linked />
    </Link>
  );
}
