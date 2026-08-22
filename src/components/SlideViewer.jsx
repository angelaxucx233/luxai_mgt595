import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import ExplainSlide from './ExplainSlide.jsx';
import { ProblemRenderer } from './ProblemWorkspace.jsx';
import YourTurnTitle from './YourTurnTitle.jsx';

export default function SlideViewer() {
  const {
    currentSlide,
    totalSlides,
    activeSlide,
    nextSlide,
    prevSlide,
    problemWork,
    showPracticeOffer,
    requestAnotherPractice,
  } = useApp();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isLastSlide = currentSlide >= totalSlides;
  const isProblem = activeSlide.type === 'problem';
  const [solvedSlides, setSolvedSlides] = useState({});
  const markSolved = (id) => setSolvedSlides((m) => ({ ...m, [id]: true }));
  const nextBlocked =
    isProblem &&
    activeSlide.requireCompletion &&
    Boolean(activeSlide.visual) &&
    !solvedSlides[activeSlide.slideId];

  return (
    <section className="h-full w-full flex flex-col bg-black min-h-0">
      <div className="flex-1 flex flex-col items-center justify-start min-h-0 overflow-y-auto px-6 md:px-10 pt-8 pb-6 md:pt-10">
        {isProblem && !activeSlide.visual && (
          <div className="w-full max-w-2xl flex flex-col items-center gap-4 mb-2">
            <span className="text-xs font-semibold tracking-widest text-yale-200 uppercase">
              Your turn
            </span>
            <YourTurnTitle>{activeSlide.title}</YourTurnTitle>
          </div>
        )}
        {activeSlide.type === 'explain' || activeSlide.type === 'interactive' || activeSlide.type === 'recap' ? (
          <ExplainSlide
            content={activeSlide.content}
            visual={activeSlide.visual}
            visualProps={activeSlide.visualProps}
            slideTitle={activeSlide.title}
          />
        ) : activeSlide.visual ? (
          <ExplainSlide
            key={activeSlide.slideId}
            content={activeSlide.content}
            visual={activeSlide.visual}
            visualProps={{
              ...(activeSlide.visualProps ?? {}),
              onComplete: () => markSolved(activeSlide.slideId),
            }}
            slideTitle={activeSlide.title}
          />
        ) : (
          problemWork && (
            <div className="w-full max-w-xl text-slate-200 [&_p]:text-slate-200">
              <ProblemRenderer templateId={problemWork.templateId} />
            </div>
          )
        )}
      </div>

      <footer className="shrink-0 border-t border-slate-800 px-6 py-4 flex gap-3 justify-center items-center">
        {currentSlide > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            className="px-5 py-2.5 rounded-full border border-slate-600 text-sm text-slate-200 hover:border-slate-400 hover:text-white"
          >
            Back
          </button>
        )}

        {isProblem && showPracticeOffer && (
          <button
            type="button"
            onClick={requestAnotherPractice}
            className="px-5 py-2.5 rounded-full border border-slate-600 text-slate-200 hover:border-yale-500 hover:text-white text-sm font-semibold"
          >
            Another example
          </button>
        )}

        {isLastSlide ? (
          <button
            type="button"
            onClick={() => navigate(`/course/${courseId}`)}
            className="px-8 py-2.5 rounded-full bg-yale-600 hover:bg-yale-500 text-white font-bold text-sm"
          >
            Finish lecture
          </button>
        ) : (
          <button
            type="button"
            onClick={nextSlide}
            disabled={nextBlocked}
            title={nextBlocked ? 'Solve the problem to continue' : undefined}
            className={`px-8 py-2.5 rounded-full font-bold text-sm ${
              nextBlocked
                ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                : 'bg-yale-600 hover:bg-yale-500 text-white'
            }`}
          >
            {nextBlocked ? 'Solve to continue' : 'Next'}
          </button>
        )}
      </footer>
    </section>
  );
}
