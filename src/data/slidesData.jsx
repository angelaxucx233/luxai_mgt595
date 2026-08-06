/**
 * Active lecture slide deck — wired per lecture module.
 * Lecture 1 is live; other lectures add their own file under ./lectures/
 */

import { lecture01Slides } from './lectures/lecture01Slides.js';
import { lecture02Slides } from './lectures/lecture02Slides.js';
import { lecture03Slides } from './lectures/lecture03Slides.js';
import { lecture04Slides } from './lectures/lecture04Slides.js';
import { lecture05Slides } from './lectures/lecture05Slides.js';
import { lecture06Slides } from './lectures/lecture06Slides.js';
import { lecture07Slides } from './lectures/lecture07Slides.js';
import { lecture08Slides } from './lectures/lecture08Slides.js';
import { lecture09Slides } from './lectures/lecture09Slides.js';
import { lecture10Slides } from './lectures/lecture10Slides.js';

const LECTURE_DECKS = {
  '10': lecture10Slides,
  '9': lecture09Slides,
  '09': lecture09Slides,
  '8': lecture08Slides,
  '08': lecture08Slides,
  '07': lecture07Slides,
  '06': lecture06Slides,
  '01': lecture01Slides,
  '02': lecture02Slides,
  '03': lecture03Slides,
  '1': lecture01Slides,
  '04': lecture04Slides,
  '05': lecture05Slides,
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
