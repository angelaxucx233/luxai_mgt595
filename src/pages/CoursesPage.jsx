import { courses } from '../data/catalog.js';
import CourseCard from '../components/CourseCard.jsx';
import CatalogLayout from '../components/CatalogLayout.jsx';

export default function CoursesPage() {
  return (
    <CatalogLayout>
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-14">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
          Your courses
        </h2>
        <div className="grid gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </CatalogLayout>
  );
}
