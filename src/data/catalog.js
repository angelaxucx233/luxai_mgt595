/**
 * Course & lecture catalog — slide PDFs live in /lectures (project root).
 * MGT 595 · Quantitative Investing (Yale SOM)
 * Filenames follow the source deck names, e.g. "MGT595_Lecture_0_1_2026v12_full.pdf".
 */

export const courses = [
  {
    id: 'mgt-595',
    code: 'MGT 595',
    title: 'Quantitative Investing',
    description:
      'From expected utility and the efficient frontier to estimation risk and the CAPM — the statistical machinery behind systematic investing.',
    accent: 'yale',
    /** Interactive "Your Turn" problems in the live Lecture 0/1 deck. */
    exerciseCount: 6,
    lectures: [
      {
        number: 1,
        title: 'Statistics & Portfolio Theory',
        slug: '01',
        pdfFilename: 'MGT595_Lecture_0_1_2026v12_full.pdf',
        available: true,
      },
      {
        number: 2,
        title: 'Asset Pricing Tests',
        slug: '02',
        pdfFilename: 'MGT595_Lecture_2_2026_v6.pdf',
        available: true,
      },
      {
        number: 3,
        title: 'Market Efficiency',
        slug: '03',
        pdfFilename: 'MGT595_Lecture_3_2026_v3.pdf',
        available: true,
      },
      {
        number: 4,
        title: 'The Value Premium',
        slug: '04',
        pdfFilename: 'MGT595_Lecture_4_2026v1.pdf',
        available: true,
      },
      {
        number: 5,
        title: 'Momentum',
        slug: '05',
        pdfFilename: 'MGT595_Lecture_5_2026v3.pdf',
        available: true,
      },
      {
        number: 6,
        title: 'Quality & Defensive Investing',
        slug: '06',
        pdfFilename: 'MGT595_Lecture_6_2026v2.pdf',
        available: true,
      },
      {
        number: 7,
        title: 'Robustness of Anomalies',
        slug: '07',
        pdfFilename: 'MGT595_Lecture_7_2026v2.pdf',
        available: true,
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
