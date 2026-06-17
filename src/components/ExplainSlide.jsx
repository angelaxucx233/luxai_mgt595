import SlideVisual from './visuals/SlideVisual.jsx';
import YourTurnTitle, { isYourTurnEyebrow } from './YourTurnTitle.jsx';

function SampleSpaceNotation({ notation }) {
  const match = notation.match(/^S\s*=\s*(\{[^}]+\})/);
  const setPart = match ? match[1] : notation;

  return (
    <div className="flex flex-wrap items-baseline justify-center gap-x-2 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 w-full">
      <span className="text-5xl md:text-6xl font-bold text-yale-300 leading-none">S</span>
      <span className="text-2xl md:text-3xl font-semibold text-yale-200 tracking-tight">
        = {setPart}
      </span>
    </div>
  );
}

export default function ExplainSlide({ content, visual, visualProps, slideTitle }) {
  if (!content) return null;

  const yourTurn = isYourTurnEyebrow(content.eyebrow);
  const heading = yourTurn
    ? content.problemTitle ?? content.heading ?? slideTitle
    : content.heading;

  return (
    <div
      className={`flex flex-col gap-5 text-center mx-auto w-full ${
        visual ? (yourTurn ? 'max-w-2xl' : 'max-w-xl') : 'max-w-lg'
      }`}
    >
      <span className="text-xs font-semibold tracking-widest text-yale-400 uppercase">
        {content.eyebrow}
      </span>
      {yourTurn ? (
        <YourTurnTitle>{heading}</YourTurnTitle>
      ) : (
        <h2 className="text-2xl md:text-3xl font-bold text-white">{heading}</h2>
      )}
      {content.body && <p className="text-slate-300 leading-relaxed">{content.body}</p>}
      {visual && <SlideVisual id={visual} visualProps={visualProps} />}
      {content.notation &&
        (content.notationVariant === 'sampleSpace' ? (
          <SampleSpaceNotation notation={content.notation} />
        ) : (
          <div className="font-mono text-sm bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-yale-200">
            {content.notation}
          </div>
        ))}
      {content.quote && (
        <blockquote className="font-serif italic text-slate-400 border-l-2 border-yale-500 pl-4 text-left">
          {content.quote}
        </blockquote>
      )}
      {content.footnote && (
        <p className="text-sm text-slate-500">{content.footnote}</p>
      )}
    </div>
  );
}
