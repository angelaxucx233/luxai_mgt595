/**
 * Lecture 04 — Binomial Distribution (MGT 403)
 * Student-facing deck from lectures/lecture04_outline_refined.json
 */

export const lecture04Slides = [
  // ── Block A: Building the Binomial Formula ───────────────────────
  {
    slideId: 1,
    type: 'interactive',
    title: 'Multiple Coin Tosses',
    contextLabel: 'Block A · Coin trials',
    blockId: 'A',
    module: 'binomial',
    visual: 'InteractiveTreeDiagram',
    narration:
      '[curious] Toss two fair coins. [thoughtful] Build the tree and find every path with exactly one Head — how many distinct paths do you see?',
    systemPromptContext:
      'BLOCK A — Two coin tree. Guide student to see HT and TH are two paths for X=1. Order matters for counting paths, not for the count X itself. Socratic: "What do you notice about paths with exactly one Head?"',
    content: {
      eyebrow: 'Independent trials',
      heading: 'Multiple Coin Tosses',
      body: 'When you toss two fair coins, each fine outcome is equally likely. The number of paths that give exactly one Head tells you why the binomial coefficient is 2.',
      footnote: 'Use the tree — click branches to explore paths.',
    },
  },
  {
    slideId: 2,
    type: 'interactive',
    title: 'Expanding to n = 3',
    contextLabel: 'Block A · Counting paths',
    blockId: 'A',
    module: 'binomial',
    visual: 'FairCoinRow',
    visualProps: { coinCount: 3, faces: ['heads', 'tails'] },
    narration:
      '[encouraging] Now try three tosses. [curious] Before you look up a formula — how many distinct paths give exactly two Heads?',
    systemPromptContext:
      'BLOCK A — n=3, k=2. Correct count is 3 (HHT, HTH, THH). If student says 1, ask about different positions of the Tail. Do not give formula yet.',
    content: {
      eyebrow: 'Counting arrangements',
      heading: 'Expanding to n = 3',
      body: 'With three tosses, listing paths beats memorizing a formula. Count how many orderings produce exactly two Heads — you should see a pattern emerging.',
      footnote: 'Think about where the single Tails can appear.',
    },
  },
  {
    slideId: 3,
    type: 'explain',
    title: 'Binomial PMF',
    contextLabel: 'Block A · The formula',
    blockId: 'A',
    module: 'binomial',
    visual: 'BinomialPmfExplainer',
    narration:
      '[clear] Here is the binomial probability mass function. [thoughtful] Tap X, n, p, or k — see how ways to arrange, successes, and failures fit together.',
    systemPromptContext:
      'BLOCK A — Binomial PMF. k!, n choose k, p^k (1-p)^(n-k). Optional trivia: (1/2)! relates to Gamma function — redirect to integers for this course.',
    content: {
      eyebrow: 'The binomial PMF',
      heading: 'Binomial PMF',
      body: 'For n independent trials with success probability p, the probability of exactly k successes combines three ideas: how many ways to arrange k successes, the chance of those successes, and the chance of the remaining failures.',
      footnote: 'Tap X, n, p, or k to see what each symbol means.',
    },
  },
  {
    slideId: 4,
    type: 'interactive',
    title: 'Binomial PMF Example',
    contextLabel: 'Block A · Worked example',
    blockId: 'A',
    module: 'binomial',
    visual: 'BinomialFormulaReveal',
    visualProps: { n: 5, k: 3, p: 0.5, slideId: 4 },
    requireCompletion: true,
    narration:
      '[calm] Let us build P(X = 3) step by step. [encouraging] Tap each question mark — see what each piece means before you plug in numbers yourself.',
    systemPromptContext:
      'BLOCK A — Formula reveal n=5, k=3, p=0.5. Student taps to reveal 5!, 3!, 2!, 0.5, exponents, answer 0.3125. Explain factorials as ordering; p as fair flip; exponents as head/tail counts.',
    content: {
      eyebrow: 'Worked example',
      heading: 'Binomial PMF Example',
      body: 'Five fair flips, exactly three heads. Tap each hidden box to see how factorials, probabilities, and exponents fit together.',
      footnote: 'Reveal every piece, then Continue — your turn is next.',
    },
  },
  {
    slideId: 5,
    type: 'interactive',
    title: 'Your Turn: Plug In the Formula',
    contextLabel: 'Block A · Your turn',
    blockId: 'A',
    module: 'binomial',
    visual: 'BinomialFormulaBuilder',
    visualProps: { n: 5, k: 3, p: 0.5, slideId: 5, enableNewProblem: true },
    requireCompletion: true,
    narration:
      '[encouraging] Your turn — fill in the same formula for five fair flips and three heads. [calm] Type factorials like 5! or 120, then hit Check.',
    systemPromptContext:
      'BLOCK A — Binomial formula builder n=5, k=3, p=0.5. Student fills n!, k!, (n-k)!, p, exponents. Hints: n! on top; k! and (n-k)! in denominator; p=0.5; exponents k and n-k. Answer ≈ 0.3125.',
    content: {
      eyebrow: 'Your turn',
      heading: 'Plug In the Formula',
      problemTitle: 'Your Turn: Plug In the Formula',
      footnote:
        'Tap Check when ready. Wrong answers get a hint from Lux in the chat. Tap New Problem for fresh coin counts.',
    },
  },

  // ── Block B: Cumulative Probabilities ────────────────────────────
  {
    slideId: 6,
    type: 'interactive',
    title: 'Ranges & the Complement Rule',
    contextLabel: 'Block B · Cumulative',
    blockId: 'B',
    module: 'binomial',
    visual: 'ComplementBar',
    narration:
      '[clear] Sometimes you need P(X ≥ k) or P(X > k). [thoughtful] Often it is easier to subtract what you do not want: one minus P(X ≤ k−1).',
    systemPromptContext:
      'BLOCK B — CDF vs PMF, complement rule for P(X≥k)=1−P(X≤k−1). Discrete bounds — watch off-by-one. Excel BINOM.DIST only if asked.',
    content: {
      eyebrow: 'Cumulative probability',
      heading: 'Ranges & the Complement Rule',
      body: 'Exact probabilities use the PMF. Range questions often need the complement: instead of summing many bars, subtract the tail you do not want from 1.',
      footnote: 'Select a range on the chart and read the formula it builds.',
    },
  },
  {
    slideId: 7,
    type: 'interactive',
    title: 'Practice: Medical Risk',
    contextLabel: 'Block B · Your turn',
    blockId: 'B',
    module: 'binomial',
    visual: 'BinomialCdfComplementProblem',
    visualProps: {
      n: 20,
      p: 0.05,
      targetValue: 2,
      slideId: 7,
      icon: 'firstAid',
      scenarioIntro:
        'In a hospital, 20 independent surgeries are scheduled. Each surgery has a 5% chance of failure (95% success). Let X = number of failed surgeries.',
      scenarioQuestion:
        'Find P(X ≥ 2) — at least two failures. Use the complement rule instead of adding eighteen separate probabilities.',
    },
    requireCompletion: true,
    narration:
      '[encouraging] Twenty surgeries, five percent failure each. [calm] Walk the complement step by step — at least two failures means one minus at most one.',
    systemPromptContext:
      'PROBLEM: n=20, p=0.05, P(X≥2)=1−P(X≤1)=1−(P(X=0)+P(X=1)). P(X=0)≈0.358, P(X=1)≈0.377, answer≈0.264. Scaffold complement before PMF.',
    content: {
      eyebrow: 'Your turn',
      heading: 'Practice: Medical Risk',
      problemTitle: 'Practice: Medical Risk',
      footnote: 'Fill in each step, plug in both PMFs, then Check to reveal the answer.',
    },
    postProblemSummary: {
      speech:
        '[excited] Well done! [clear] At least two means complement one minus at most one — much faster than summing eighteen terms.',
      display:
        'Well done! P(X ≥ 2) = 1 − P(X ≤ 1) ≈ 0.264 — the complement saves a long sum.',
    },
  },
  {
    slideId: 8,
    type: 'problem',
    title: 'Practice: Blind Taste Test',
    contextLabel: 'Block B · Stretch',
    blockId: 'B',
    module: 'binomial',
    visual: 'ProbabilitySlider',
    problemTemplateId: 'probability_fraction',
    problemParams: {
      prompt:
        '100 people guess blindly between two drinks (no skill). What is E(X)? Then find P(45 ≤ X ≤ 55) for the number of correct guesses.',
      answer: '0.728',
      altAnswers: ['728/1000'],
    },
    narration:
      '[thoughtful] They are guessing blind — what is p? [encouraging] Find the expected count, then the probability of landing between 45 and 55.',
    systemPromptContext:
      'PROBLEM: n=100, p=0.5 implied, E(X)=50. P(45≤X≤55)=P(X≤55)−P(X≤44). Discrete: use 44 not 45 in lower CDF.',
    postProblemSummary: {
      speech:
        '[clear] Expected value is 50. [excited] The range probability is about 0.73 — most of the mass sits near the center when n is large.',
      display:
        'E(X) = 50. P(45 ≤ X ≤ 55) ≈ 0.728 — most guesses cluster near half correct.',
    },
  },

  // ── Block C: Challenge ───────────────────────────────────────────
  {
    slideId: 9,
    type: 'problem',
    title: 'Challenge: Nested Trials',
    contextLabel: 'Block C · Challenge',
    blockId: 'C',
    module: 'binomial',
    visual: 'StaticTreeDiagram',
    problemTemplateId: 'probability_fraction',
    problemParams: {
      prompt:
        '7 trials. P(show) = 0.5; if no-show, P(convict) = 0.9; if show, P(convict) = 0.2. Find P(convict) for one trial, then P(acquitted in all 7).',
      answer: '0.045',
      altAnswers: ['(0.45)^7', '893025/20000000'],
    },
    narration:
      '[calm] Two steps: first find the conviction rate for a single trial, then treat seven trials as binomial.',
    systemPromptContext:
      'CHALLENGE: P(C)=0.5·0.2+0.5·0.9=0.55. P(all acquit)=(0.45)^7≈0.045. Law of total probability then binomial.',
    postProblemSummary: {
      speech:
        '[excited] You connected the pieces! [clear] Single-trial conviction is 0.55; acquittal in all seven is 0.45 to the seventh — about 0.045.',
      display:
        'P(convict one trial) = 0.55. P(acquitted all 7) = (0.45)⁷ ≈ 0.045.',
    },
  },

  // ── Block D: Wrap-up ─────────────────────────────────────────────
  {
    slideId: 10,
    type: 'recap',
    title: 'Summary & What\'s Next',
    contextLabel: 'Block D · Recap',
    blockId: 'D',
    module: 'binomial',
    narration:
      '[friendly] You have got the binomial down — PMF, complements, and nested trials. [encouraging] Next up: mean and variance.',
    systemPromptContext:
      'RECAP binomial. Tease next module on mean and variance (E(X)=np, Var(X)=np(1−p)).',
    content: {
      eyebrow: 'Lecture 4 complete',
      heading: 'Summary & What\'s Next',
      body: 'You can model counts with the binomial PMF, compute cumulative probabilities with complements, and combine conditional steps into a single-trial rate before scaling to n trials. Next module covers mean and variance.',
    },
  },
];
