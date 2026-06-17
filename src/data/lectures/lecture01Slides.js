/**
 * Lecture 01 — Probability Experiments (MGT 403)
 * Full deck from lectures/lecture01_outline.json — blocks A–K
 */

export const lecture01Slides = [
  // ── Block A: The Science of Uncertainty ──────────────────────────
  {
    slideId: 1,
    type: 'explain',
    title: 'Why Probability?',
    contextLabel: 'Block A · Introduction',
    blockId: 'A',
    module: 'intro',
    visual: 'ScenarioCardGrid',
    narration:
      '[friendly] Welcome to Lecture 1. [curious] Probability is the science of uncertainty. [encouraging] Flip each card to see the question hiding behind everyday decisions.',
    systemPromptContext: `BLOCK A — Why Probability? ScenarioCardGrid flip cards. Motivate probability; not math-heavy.`,
    content: {
      eyebrow: 'The Science of Uncertainty',
      heading: 'Why Probability?',
      body: 'We face uncertainty every day — probability turns "I am not sure" into a number we can reason with.',
      footnote: 'Tap each card to reveal a real-world probability question.',
    },
  },

  // ── Block B: Experiments and Outcomes ────────────────────────────
  {
    slideId: 2,
    type: 'explain',
    title: 'What is an Experiment?',
    contextLabel: 'Block B · Experiments',
    blockId: 'B',
    module: 'coins',
    visual: 'CoinTossSim',
    narration:
      '[clear] A probability experiment has uncertain outcomes. [curious] Toss the coin — each result is one fine outcome, heads or tails, never both.',
    systemPromptContext: `BLOCK B — Define experiment/outcome. CoinTossSim on slide. Mutually exclusive, finest grain.`,
    content: {
      eyebrow: 'Experiments & Outcomes',
      heading: 'What is an Experiment?',
      body: 'An experiment produces outcomes you cannot predict in advance. Each outcome must be mutually exclusive and at the finest grain.',
      footnote: 'Tap Toss coin and watch outcomes stack up.',
    },
  },
  {
    slideId: 3,
    type: 'explain',
    title: 'Two Distinct Coins',
    contextLabel: 'Block B · Two coins',
    blockId: 'B',
    module: 'coins',
    visual: 'FairCoinRow',
    visualProps: { coinCount: 2, faces: ['heads', 'tails'] },
    narration:
      '[calm] Label the coins: coin one and coin two. [thoughtful] Order matters — H₁T₂ is different from T₁H₂.',
    systemPromptContext: `BLOCK B — Two distinct fair coins. 𝒮 has 4 fine outcomes.`,
    content: {
      eyebrow: 'Fine outcomes',
      heading: 'Two Distinct Coins',
      body: 'Toss two fair coins independently. Label them so each outcome names both tosses.',
      notation: 'S = { H1H2, H1T2, T1H2, T1T2 }',
      notationVariant: 'sampleSpace',
    },
  },
  {
    slideId: 4,
    type: 'problem',
    title: 'How many outcomes?',
    contextLabel: 'Block B · Practice',
    blockId: 'B',
    module: 'coins',
    problemTemplateId: 'coin_outcomes',
    problemParams: { coinCount: 2, outcomeCount: 4 },
    narration: '[encouraging] How many fine outcomes are in 𝒮 for two coins?',
    systemPromptContext: `PROBLEM coin_outcomes: 2 coins, |𝒮|=4.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] Two independent coins means two choices each — 2 times 2 equals 4 fine outcomes in 𝒮.',
      display:
        'Great! Two independent coins means two choices each — 2 × 2 = 4 fine outcomes in 𝒮.',
    },
  },

  // ── Block C: The Sample Space ────────────────────────────────────
  {
    slideId: 5,
    type: 'explain',
    title: 'Defining the Sample Space',
    contextLabel: 'Block C · Sample space',
    blockId: 'C',
    module: 'coins',
    visual: 'MathTooltipText',
    narration:
      '[thoughtful] The sample space script S is the master set of all fine outcomes. [calm] Tap each symbol to learn the notation.',
    systemPromptContext: `BLOCK C — 𝒮 notation. MathTooltipText interactive.`,
    content: {
      eyebrow: 'The Sample Space',
      heading: 'Defining 𝒮',
      body: 'The sample space 𝒮 collects every fine outcome in curly braces — a proper mathematical set.',
      footnote: 'Tap 𝒮, ω, or { } to see definitions.',
    },
  },
  {
    slideId: 6,
    type: 'problem',
    title: 'Build the Sample Space',
    contextLabel: 'Block C · Practice',
    blockId: 'C',
    module: 'coins',
    problemTemplateId: 'set_builder',
    problemParams: {
      prompt: 'Tap every fine outcome for two distinct fair coins to build 𝒮.',
      correctOutcomes: ['H₁H₂', 'H₁T₂', 'T₁H₂', 'T₁T₂'],
    },
    narration: '[encouraging] Select all four fine outcomes to complete 𝒮.',
    systemPromptContext: `PROBLEM set_builder: four two-coin outcomes.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] 𝒮 is the set of all four fine outcomes — H₁H₂, H₁T₂, T₁H₂, and T₁T₂.',
      display:
        'Great! 𝒮 is the set of all four fine outcomes — { H₁H₂, H₁T₂, T₁H₂, T₁T₂ }.',
    },
  },

  // ── Block D: Events and Set Logic ────────────────────────────────
  {
    slideId: 7,
    type: 'explain',
    title: 'Events are Subsets',
    contextLabel: 'Block D · Events',
    blockId: 'D',
    module: 'coins',
    visual: 'SampleSpaceGrid',
    narration:
      '[curious] An event is a rule that picks out outcomes from 𝒮. [clear] Try the condition buttons — watch the subset light up.',
    systemPromptContext: `BLOCK D — Events as subsets. SampleSpaceGrid conditions.`,
    content: {
      eyebrow: 'Events',
      heading: 'Events are Subsets',
      body: 'An event groups outcomes that share a property. It is always a subset of 𝒮.',
      footnote: 'Toggle conditions to highlight the event.',
    },
  },
  {
    slideId: 8,
    type: 'interactive',
    title: 'Combining Events (AND / OR)',
    contextLabel: 'Block D · Set logic',
    blockId: 'D',
    module: 'coins',
    visual: 'VennDiagram',
    narration:
      '[clear] AND keeps only the overlap. [thoughtful] OR is inclusive — A, B, or both. [friendly] Toggle AND versus OR on the Venn diagram.',
    systemPromptContext: `BLOCK D — Venn AND/OR. OR is inclusive.`,
    content: {
      eyebrow: 'Set logic',
      heading: 'AND vs OR',
      body: 'AND = intersection. OR = union (includes overlap).',
      footnote: 'Switch between A AND B and A OR B.',
    },
  },
  {
    slideId: 9,
    type: 'problem',
    title: 'Practice: Event Logic',
    contextLabel: 'Block D · Practice',
    blockId: 'D',
    module: 'coins',
    problemTemplateId: 'coin_event_select',
    problemParams: {
      prompt:
        "A = 'First coin is Heads'. B = 'At least one Tails'. Select outcomes in (A AND B).",
      eventA: '1st coin is Heads',
      eventB: 'At least one Tails',
      logic: 'and',
      correctIds: ['ht'],
    },
    narration: '[encouraging] Find the overlap — outcomes in both A and B.',
    systemPromptContext: `PROBLEM coin_event_select AND: only H₁T₂.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] A AND B keeps only the overlap — H₁T₂ is first coin Heads and has at least one Tails.',
      display:
        'Great! A AND B keeps only the overlap — H₁T₂ is first coin Heads and has at least one Tails.',
    },
  },

  // ── Block E: Calculating Probability ─────────────────────────────
  {
    slideId: 10,
    type: 'explain',
    title: 'The Probability Number',
    contextLabel: 'Block E · Probability',
    blockId: 'E',
    module: 'coins',
    visual: 'ProbabilitySlider',
    narration:
      '[calm] Probability is always between zero and one. [clear] Drag the slider — impossible at zero, certain at one.',
    systemPromptContext: `BLOCK E — P between 0 and 1, P(𝒮)=1.`,
    content: {
      eyebrow: 'Calculating Probability',
      heading: 'The Probability Number',
      body: '0 means impossible, 1 means certain. All outcomes together sum to P(𝒮) = 1.',
      footnote: 'Drag the slider to see examples.',
    },
  },
  {
    slideId: 11,
    type: 'interactive',
    title: 'Symmetry and Summation',
    contextLabel: 'Block E · Adding outcomes',
    blockId: 'E',
    module: 'coins',
    visual: 'MathAccumulator',
    narration:
      '[thoughtful] Fair coins mean each fine outcome gets one fourth. [curious] Click the outcomes in event A and watch the sum build.',
    systemPromptContext: `BLOCK E — Add equally likely outcome probabilities. At least one H → 3/4.`,
    content: {
      eyebrow: 'Symmetry',
      heading: 'Add Probabilities',
      body: 'For mutually exclusive outcomes in an event, add their probabilities.',
      footnote: 'Click outcomes with at least one Heads.',
    },
  },
  {
    slideId: 12,
    type: 'problem',
    title: 'Calculate P(A)',
    contextLabel: 'Block E · Practice',
    blockId: 'E',
    module: 'coins',
    problemTemplateId: 'probability_fraction',
    problemParams: {
      prompt: "What is P(exactly one head) in a two-coin toss?",
      answer: '2/4',
      altAnswers: ['1/2'],
    },
    narration: '[encouraging] Count favorable outcomes, divide by four.',
    systemPromptContext: `PROBLEM probability_fraction: exactly one H → 1/2.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] Exactly one head happens in 2 of 4 outcomes, so P equals 2 fourths, or one half.',
      display: 'Great! Exactly one head happens in 2 of 4 outcomes, so P = 2/4 = 1/2.',
    },
  },

  // ── Block F: Never Fail Method ───────────────────────────────────
  {
    slideId: 13,
    type: 'explain',
    title: 'A Systematic Approach',
    contextLabel: 'Block F · Never Fail',
    blockId: 'F',
    module: 'dice',
    visual: 'NeverFailTableDemo',
    narration:
      '[clear] The Never Fail Method: list outcomes, assign probabilities, mark the event, add them up. [friendly] Step through the die table.',
    systemPromptContext: `BLOCK F — Never Fail 4 steps demo on fair die, A = at least 4.`,
    content: {
      eyebrow: 'Never Fail Method',
      heading: 'A Systematic Approach',
      body: 'Build a table — slow but reliable. You will not miss outcomes on hard problems.',
      footnote: 'Tap Next step to fill the table.',
    },
  },
  {
    slideId: 14,
    type: 'problem',
    title: 'Apply the Never Fail Method',
    contextLabel: 'Block F · Practice',
    blockId: 'F',
    module: 'dice',
    problemTemplateId: 'never_fail_table',
    problemParams: {
      prompt:
        "Fair die: A = even, B = greater than 3. Check (A AND B), then enter P.",
      correctChecked: ['4', '6'],
      answer: '2/6',
      altAnswers: ['1/3'],
    },
    narration: '[thoughtful] Check the right rows, then add one sixth for each.',
    systemPromptContext: `PROBLEM never_fail_table: check 4,6 → 2/6.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] Even AND greater than 3 hits 4 and 6 — two outcomes, so P equals 2 sixths, or one third.',
      display: 'Great! Even AND greater than 3 hits 4 and 6 — two outcomes, so P = 2/6 = 1/3.',
    },
  },

  // ── Block G: NOT and OR shortcuts ────────────────────────────────
  {
    slideId: 15,
    type: 'explain',
    title: 'The Complement Rule (NOT)',
    contextLabel: 'Block G · Complement',
    blockId: 'G',
    module: 'coins',
    visual: 'ComplementBar',
    narration:
      '[curious] Sometimes the opposite is easier. [clear] P(not A) = 1 − P(A). [friendly] Toggle the complement trick for at least one head.',
    systemPromptContext: `BLOCK G — complement rule. At least one H = 1 - P(TT).`,
    content: {
      eyebrow: 'Shortcuts',
      heading: 'The Complement (NOT)',
      body: 'P(not A) = 1 − P(A). The event and its complement fill all of 𝒮.',
      footnote: 'Try the complement trick.',
    },
  },
  {
    slideId: 16,
    type: 'problem',
    title: 'The Addition Rule (OR)',
    contextLabel: 'Block G · Practice',
    blockId: 'G',
    module: 'dice',
    problemTemplateId: 'probability_fraction',
    problemParams: {
      prompt: "Fair die: A = even, B = less than 4. Find P(A OR B).",
      answer: '4/6',
      altAnswers: ['2/3'],
      showVenn: true,
    },
    narration: '[thoughtful] Add, then subtract the overlap. Which number is both even and less than 4?',
    systemPromptContext: `PROBLEM OR: even or <4 on die → 4/6. Watch double counting.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] A OR B covers four faces out of six — you counted the union without double-counting the overlap.',
      display:
        'Great! A OR B covers four faces out of six — you counted the union without double-counting the overlap.',
    },
  },

  // ── Block H: Conditional Probability ─────────────────────────────
  {
    slideId: 17,
    type: 'explain',
    title: 'New information changes the question',
    contextLabel: 'Block H · Step 1',
    blockId: 'H',
    module: 'conditional',
    visual: 'ConditionalIntroVisual',
    narration:
      '[thoughtful] Learning something new changes the question. [calm] P(A | B) reads: A given B. [friendly] Tap the cloud button.',
    systemPromptContext: `BLOCK H step 1 — weather conditional intro.`,
    content: {
      eyebrow: 'Conditional · 1 of 3',
      heading: 'New Information',
      body: 'Conditional probability asks how likely A is once you know B happened.',
      footnote: 'Look outside — see how P(rain) changes.',
    },
  },
  {
    slideId: 18,
    type: 'interactive',
    title: 'Shrink the sample space',
    contextLabel: 'Block H · Step 2',
    blockId: 'H',
    module: 'conditional',
    visual: 'SampleSpaceShrinker',
    narration:
      '[clear] The condition rules out impossible outcomes. [curious] Apply: first coin is heads — watch 𝒮 shrink.',
    systemPromptContext: `BLOCK H step 2 — sample space shrinker, 4→3 outcomes.`,
    content: {
      eyebrow: 'Conditional · 2 of 3',
      heading: 'Shrink the Sample Space',
      body: 'Given B, only outcomes in B still matter. That is your new universe.',
      footnote: 'Apply the condition on the grid.',
    },
  },
  {
    slideId: 19,
    type: 'interactive',
    title: 'Count to get P(A | B)',
    contextLabel: 'Block H · Step 3',
    blockId: 'H',
    module: 'conditional',
    visual: 'ConditionalCountingVisual',
    narration:
      '[encouraging] Count favorable over possible inside B. [clear] Step through to get one third.',
    systemPromptContext: `BLOCK H step 3 — P(2nd H|1st H)=1/3 on coins.`,
    content: {
      eyebrow: 'Conditional · 3 of 3',
      heading: 'Count P(A | B)',
      body: 'Inside the shrunk universe: favorable ÷ possible.',
      notation: 'P(A | B) = (# in A∩B) / (# in B)',
      footnote: 'Use Next step on the coin grid.',
    },
  },
  {
    slideId: 20,
    type: 'problem',
    title: 'Conditional on a die',
    contextLabel: 'Block H · Practice',
    blockId: 'H',
    module: 'dice',
    problemTemplateId: 'probability_fraction',
    problemParams: {
      prompt: "Fair die: A = at least 4, B = even. What is P(A | B)?",
      answer: '2/3',
    },
    narration: '[thoughtful] Among even rolls, how many are at least 4?',
    systemPromptContext: `PROBLEM conditional die: B={2,4,6}, A∩B={4,6} → 2/3.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] Among even rolls — 2, 4, and 6 — two are at least 4. So P of A given B equals 2 thirds.',
      display:
        'Great! Among even rolls {2, 4, 6}, two are at least 4. So P(A | B) = 2/3.',
    },
  },

  // ── Block I: Independent Events ──────────────────────────────────
  {
    slideId: 21,
    type: 'explain',
    title: 'Independence',
    contextLabel: 'Block I · Independence',
    blockId: 'I',
    module: 'conditional',
    visual: 'ScenarioCompare',
    narration:
      '[curious] Independent means learning B tells you nothing about A. [clear] Compare coin flips to drawing cards without replacement.',
    systemPromptContext: `BLOCK I — independence vs dependence compare.`,
    content: {
      eyebrow: 'Independent Events',
      heading: 'Independence',
      body: 'Mathematically: P(A∩B) = P(A)·P(B). Cards without replacement fail this test.',
      footnote: 'Switch between the two scenarios.',
    },
  },
  {
    slideId: 22,
    type: 'problem',
    title: 'Testing for Independence',
    contextLabel: 'Block I · Practice',
    blockId: 'I',
    module: 'dice',
    problemTemplateId: 'independence_test',
    problemParams: {
      prompt:
        "Die: A = even, B = less than 3. Does P(A∩B) = P(A)·P(B)?",
      correctIndependent: 'no',
      pAnd: '0/6',
      pProd: '1/6',
    },
    narration: '[thoughtful] Compute both products and compare.',
    systemPromptContext: `PROBLEM independence_test: not independent, 0/6 vs 1/6.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] P of A and B is 0 sixths, but P of A times P of B is 1 sixth — not equal, so these events are dependent.',
      display:
        'Great! P(A∩B) = 0/6 but P(A)·P(B) = 1/6 — not equal, so A and B are dependent.',
    },
  },

  // ── Block J: Probability Trees ───────────────────────────────────
  {
    slideId: 23,
    type: 'explain',
    title: 'Probability Trees',
    contextLabel: 'Block J · Trees',
    blockId: 'J',
    module: 'coins',
    visual: 'InteractiveTreeDiagram',
    narration:
      '[clear] Trees map sequential experiments. [curious] Pick a path — multiply probabilities along branches.',
    systemPromptContext: `BLOCK J — tree path multiplication demo.`,
    content: {
      eyebrow: 'Probability Trees',
      heading: 'Mapping Sequences',
      body: 'Each path from root to leaf is one outcome. Multiply branch probabilities.',
      footnote: 'Build a path on the tree.',
    },
  },
  {
    slideId: 24,
    type: 'problem',
    title: 'Build a Tree',
    contextLabel: 'Block J · Practice',
    blockId: 'J',
    module: 'coins',
    problemTemplateId: 'tree_builder',
    problemParams: {
      prompt:
        'Fair coin, then if H an unfair coin P(H)=1/3; if T a fair coin again. Fill second-stage branches.',
      branches: { b1: '1/3', b2: '2/3', b3: '1/2', b4: '1/2' },
    },
    narration: '[encouraging] Branches from one node must sum to one.',
    systemPromptContext: `PROBLEM tree_builder: 1/3,2/3 and 1/2,1/2.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] After Heads, branches are one third and two thirds; after Tails, one half and one half — each pair sums to 1.',
      display:
        'Great! After H: branches 1/3 and 2/3; after T: 1/2 and 1/2 — each pair sums to 1.',
    },
  },
  {
    slideId: 25,
    type: 'problem',
    title: 'Calculating from the Tree',
    contextLabel: 'Block J · Practice',
    blockId: 'J',
    module: 'coins',
    problemTemplateId: 'probability_fraction',
    problemParams: {
      prompt:
        'P(first toss was H | the two tosses show different faces)?',
      answer: '4/7',
      showTree: true,
    },
    narration: '[thoughtful] Highlight different-face paths. Which started with H?',
    systemPromptContext: `PROBLEM tree Bayes-lite: answer 4/7.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] Among the different-face paths, 4 of 7 started with Heads — so P of H given different equals 4 sevenths.',
      display:
        'Great! Among the different-face paths, 4 of 7 started with Heads — P(H | different) = 4/7.',
    },
  },

  // ── Block K: Sampling Without Replacement ──────────────────────────
  {
    slideId: 26,
    type: 'explain',
    title: 'The Changing Sample Space',
    contextLabel: 'Block K · Urn',
    blockId: 'K',
    module: 'urn',
    visual: 'UrnDrawSim',
    visualProps: { blueBalls: 2, redBalls: 2 },
    narration:
      '[calm] Draw without replacement — the urn changes after each draw. [curious] Try drawing balls and watch counts drop.',
    systemPromptContext: `BLOCK K — urn draw sim, 2 blue 2 red.`,
    content: {
      eyebrow: 'Without Replacement',
      heading: 'The Changing Sample Space',
      body: 'Each draw alters what is left. That is dependent — conditional probability in physical form.',
      footnote: 'Draw balls from the urn.',
    },
  },
  {
    slideId: 27,
    type: 'problem',
    title: 'Urn: conditional probability',
    contextLabel: 'Block K · Practice',
    blockId: 'K',
    module: 'urn',
    problemTemplateId: 'urn_conditional',
    problemParams: {
      blueBalls: 2,
      redBalls: 2,
      numerator: 1,
      denominator: 3,
      probability: '1/3',
    },
    narration:
      '[encouraging] Given the first ball was blue, what is P(second is blue)?',
    systemPromptContext: `PROBLEM urn_conditional: answer 1/3.`,
    postProblemSummary: {
      speech:
        '[excited] Great! [clear] After one blue is removed, 1 blue and 2 other balls remain — so P of second blue given first blue equals 1 third.',
      display:
        'Great! After one blue is removed, 1 blue and 2 other balls remain — P(2nd blue | 1st blue) = 1/3.',
    },
  },

  // ── Recap ────────────────────────────────────────────────────────
  {
    slideId: 28,
    type: 'explain',
    title: 'What you learned',
    contextLabel: 'Lecture 1 · Wrap-up',
    blockId: 'Z',
    module: 'intro',
    narration:
      '[excited] Lecture 1 complete! [warm] From experiments and sample spaces through events, probability rules, conditional thinking, trees, and urns — you built the full toolkit.',
    systemPromptContext: `WRAP-UP Lecture 1 full arc blocks A–K.`,
    content: {
      eyebrow: 'Lecture 1 complete',
      heading: 'Probability experiments — recap',
      body:
        'You covered experiments & 𝒮, events & set logic, calculating P, the Never Fail Method, complement and OR rules, conditional probability, independence, probability trees, and urns without replacement.',
      notation: '|𝒮| = 2ⁿ · P(A|B) · P(2nd blue|1st blue) = 1/3',
      footnote: 'Open the lecture PDF from the course page anytime.',
    },
  },
];
