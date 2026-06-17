/**
 * Active lecture slide deck — wired per lecture module.
 * Lecture 1 is live; other lectures add their own file under ./lectures/
 */

import { lecture01Slides } from './lectures/lecture01Slides.js';
import { lecture04Slides } from './lectures/lecture04Slides.js';

const LECTURE_DECKS = {
  '01': lecture01Slides,
  '1': lecture01Slides,
  '04': lecture04Slides,
  '4': lecture04Slides,
};

/** Default deck when no lecture slug is provided (legacy). */
export const slidesData = lecture01Slides;

export function getSlidesForLecture(lectureSlug) {
  return LECTURE_DECKS[lectureSlug] ?? LECTURE_DECKS[String(Number(lectureSlug))] ?? [];
}

export function getSlideByIndex(index, lectureSlug = '01') {
  const deck = getSlidesForLecture(lectureSlug);
  if (!deck.length) return null;
  return deck[index - 1] ?? deck[0];
}

export function getTotalSlides(lectureSlug = '01') {
  return getSlidesForLecture(lectureSlug).length;
}
