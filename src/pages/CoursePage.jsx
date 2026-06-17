import { Navigate, useParams } from 'react-router-dom';
import { getCourse } from '../data/catalog.js';
import LectureCard from '../components/LectureCard.jsx';
import CourseInfoPanel from '../components/CourseInfoPanel.jsx';
import CatalogLayout from '../components/CatalogLayout.jsx';

export default function CoursePage() {
  const { courseId } = useParams();
  const course = getCourse(courseId);

  if (!course) {
    return <Navigate to="/" replace />;
  }

  const liveCount = course.lectures.filter((l) => l.available).length;

  return (
    <CatalogLayout>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 pb-12">
        <div className="lg:grid lg:grid-cols-[minmax(260px,320px)_1fr] lg:gap-10 xl:gap-14 items-start">
          <aside className="mb-8 lg:mb-0 lg:sticky lg:top-[4.5rem]">
            <CourseInfoPanel course={course} />
          </aside>

          <section className="min-w-0">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-yale-400 mb-1">
                  {course.code}
                </p>
                <h2 className="text-lg font-bold text-white">Lectures</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {liveCount > 0
                    ? `${liveCount} interactive · ${course.lectures.length} total`
                    : `${course.lectures.length} in this course`}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {course.lectures.map((lecture) => (
                <LectureCard
                  key={lecture.slug}
                  courseId={course.id}
                  lecture={lecture}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </CatalogLayout>
  );
}
