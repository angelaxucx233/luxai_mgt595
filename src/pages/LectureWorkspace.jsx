import { Navigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from '../context/AppContext.jsx';
import LectureLessonShell from '../components/LectureLessonShell.jsx';
import SlideViewer from '../components/SlideViewer.jsx';
import VisualizationPanel from '../components/VisualizationPanel.jsx';
import { getLecture } from '../data/catalog.js';

function WorkspaceInner() {
  const { courseId, lectureSlug } = useParams();
  const data = getLecture(courseId, lectureSlug);

  if (!data?.lecture.available) {
    return (
      <Navigate to={`/course/${courseId}/lecture/${lectureSlug}/preview`} replace />
    );
  }

  return (
    <LectureLessonShell
      courseId={courseId}
      lectureLabel={`Lecture ${data.lecture.number}: ${data.lecture.title}`}
    >
      <SlideViewer />
      <VisualizationPanel />
    </LectureLessonShell>
  );
}

export default function LectureWorkspace() {
  const { courseId, lectureSlug } = useParams();
  const data = getLecture(courseId, lectureSlug);

  if (!data) {
    return <Navigate to="/" replace />;
  }

  if (!data.lecture.available) {
    return <Navigate to={`/course/${courseId}/lecture/${lectureSlug}/preview`} replace />;
  }

  return (
    <div className="min-h-screen bg-yale-canvas">
      <AppProvider lectureSlug={lectureSlug}>
        <WorkspaceInner />
      </AppProvider>
    </div>
  );
}
