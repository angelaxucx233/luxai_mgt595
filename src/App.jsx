import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CoursePage from './pages/CoursePage.jsx';
import LectureWorkspace from './pages/LectureWorkspace.jsx';
import LectureComingSoon from './pages/LectureComingSoon.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
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
