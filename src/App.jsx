import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { courses } from './data/catalog.js';
import CoursePage from './pages/CoursePage.jsx';
import LectureWorkspace from './pages/LectureWorkspace.jsx';
import LectureComingSoon from './pages/LectureComingSoon.jsx';

const COURSE_HOME = `/course/${courses[0].id}`;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={COURSE_HOME} replace />} />
        <Route path="/courses" element={<Navigate to={COURSE_HOME} replace />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/course/:courseId/lecture/:lectureSlug" element={<LectureWorkspace />} />
        <Route
          path="/course/:courseId/lecture/:lectureSlug/preview"
          element={<LectureComingSoon />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
