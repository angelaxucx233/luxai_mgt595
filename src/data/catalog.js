/**
 * Course & lecture catalog — slide PDFs live in /lectures (project root).
 * Filenames: "MGT 403 - Lecture NN - Title.pdf"
 * Notes/solutions PDFs are excluded.
 */

export const courses = [
  {
    id: 'mgt-403',
    code: 'MGT 403',
    title: 'Probability and Statistics',
    description:
      'Build a foundation in probability and statistics — experiments, models, and distributions.',
    accent: 'yale',
    /** Interactive practice problems in the live lecture deck (Lecture 4). */
    exerciseCount: 3,
    lectures: [
      {
        number: 1,
        title: 'Probability Experiments',
        slug: '01',
        pdfFilename: 'MGT 403 - Lecture 01 - Probability Experiments.pdf',
        available: false,
      },
      {
        number: 2,
        title: 'Probability Modeling',
        slug: '02',
        pdfFilename: 'MGT 403 - Lecture 02 - Probability Modeling.pdf',
        available: false,
      },
      {
        number: 3,
        title: 'Random Variables',
        slug: '03',
        pdfFilename: 'MGT 403 - Lecture 03 -Random Variables.pdf',
        available: false,
      },
      {
        number: 4,
        title: 'Binomial Distribution',
        slug: '04',
        pdfFilename: 'MGT 403 - Lecture 04 - Binomial Distribution.pdf',
        available: true,
      },
      {
        number: 5,
        title: 'Normal Distribution',
        slug: '05',
        pdfFilename: 'MGT 403 - Lecture 05 - Normal Distribution.pdf',
        available: false,
      },
      {
        number: 6,
        title: 'Sums and Covariance',
        slug: '06',
        pdfFilename: 'MGT 403 - Lecture 06 -Sums and Covariance.pdf',
        available: false,
      },
      {
        number: 7,
        title: 'Differences, Scaling and CLT',
        slug: '07',
        pdfFilename: 'MGT 403 - Lecture 07 - Differences, Scaling and CLT.pdf',
        available: false,
      },
    ],
  },
];

export function getCourse(courseId) {
  return courses.find((c) => c.id === courseId) ?? null;
}

export function getLecture(courseId, lectureSlug) {
  const course = getCourse(courseId);
  if (!course) return null;
  const lecture =
    course.lectures.find(
      (l) => l.slug === lectureSlug || String(l.number) === lectureSlug
    ) ?? null;
  return lecture ? { course, lecture } : null;
}

/** URL path to slide PDF (served from /lectures). */
export function lecturePdfUrl(pdfFilename) {
  return `/lectures/${encodeURIComponent(pdfFilename)}`;
}
