export type MonteCarloPhaseSpace = {
  readonly id: string;
  readonly type: "monteCarlo";
  readonly image: string;
  readonly alt: string;
};

export type GeneratedPhaseSpace = {
  readonly id: string;
  readonly type: "fake";
  readonly image: string;
  readonly alt: string;
};

export type PhaseSpace = MonteCarloPhaseSpace | GeneratedPhaseSpace;

// Keeping this as a tuple makes the 2 Monte Carlo + 1 generated rule
// enforceable by TypeScript before any question reaches the interface.
export type PhaseSpaceTriplet = readonly [
  MonteCarloPhaseSpace,
  MonteCarloPhaseSpace,
  GeneratedPhaseSpace,
];

export type Question = {
  readonly id: string;
  readonly phaseSpaces: PhaseSpaceTriplet;
  readonly explanation: string;
  readonly context?: string;
};

type SampleQuestionCopy = {
  readonly id: `case-${string}`;
  readonly context: string;
  readonly explanation: string;
};

const makeSampleQuestion = ({
  id,
  context,
  explanation,
}: SampleQuestionCopy): Question => ({
  id,
  phaseSpaces: [
    {
      id: `${id}-mc-a`,
      type: "monteCarlo",
      image: `/game/${id}/mc-01.jpg`,
      alt: "Sample phase-space density map for comparison.",
    },
    {
      id: `${id}-mc-b`,
      type: "monteCarlo",
      image: `/game/${id}/mc-02.jpg`,
      alt: "Sample phase-space density map for comparison.",
    },
    {
      id: `${id}-fake`,
      type: "fake",
      image: `/game/${id}/fake.jpg`,
      alt: "Sample phase-space density map for comparison.",
    },
  ],
  context,
  explanation,
});

export const questionBank = [
  makeSampleQuestion({
    id: "case-01",
    context: "Sample case · stepped field",
    explanation:
      "Sample content: compare the field edge and low-density halo. Replace this case with a validated congress example.",
  }),
  makeSampleQuestion({
    id: "case-02",
    context: "Sample case · compact aperture",
    explanation:
      "Sample content: small structures test whether the generated distribution preserves sharp spatial features.",
  }),
  makeSampleQuestion({
    id: "case-03",
    context: "Sample case · asymmetric field",
    explanation:
      "Sample content: asymmetry makes differences in the spatial distribution easier to inspect.",
  }),
  makeSampleQuestion({
    id: "case-04",
    context: "Sample case · offset field",
    explanation:
      "Sample content: the generated sample should follow the conditioned field without losing stochastic variation.",
  }),
  makeSampleQuestion({
    id: "case-05",
    context: "Sample case · narrow opening",
    explanation:
      "Sample content: inspect both the high-density core and the scattered particles around it.",
  }),
  makeSampleQuestion({
    id: "case-06",
    context: "Sample case · irregular edge",
    explanation:
      "Sample content: edge fidelity is visible here, but quantitative distribution tests remain essential.",
  }),
  makeSampleQuestion({
    id: "case-07",
    context: "Sample case · broad opening",
    explanation:
      "Sample content: broad fields reveal whether density varies plausibly across the full aperture.",
  }),
  makeSampleQuestion({
    id: "case-08",
    context: "Sample case · fine modulation",
    explanation:
      "Sample content: fine modulation challenges the model's response to detailed conditioning geometry.",
  }),
  makeSampleQuestion({
    id: "case-09",
    context: "Sample case · displaced opening",
    explanation:
      "Sample content: displaced fields test whether position and distribution shape remain coupled.",
  }),
  makeSampleQuestion({
    id: "case-10",
    context: "Sample case · stepped edge",
    explanation:
      "Sample content: compare the transition at each step as well as the surrounding particle halo.",
  }),
  makeSampleQuestion({
    id: "case-11",
    context: "Sample case · small field",
    explanation:
      "Sample content: a convincing sample should preserve both concentration and rare outlying particles.",
  }),
  makeSampleQuestion({
    id: "case-12",
    context: "Sample case · complex aperture",
    explanation:
      "Sample content: visual agreement is a first impression, never a substitute for physical validation.",
  }),
] as const satisfies readonly Question[];

export const siteConfig = {
  researcherName: "A. Giuliano Mirabella",
  institution: "Medical Physics Group · University of Seville",
  projectName: "Deeply learning probabilistic patterns in radiotherapy with IMRT",
  congressName: "European Congress on Medical Physics 2026",
  projectDescription:
    "Conditional normalizing flows for generating stochastic radiotherapy phase-space samples, with Monte Carlo simulation as the reference.",
  presentationUrl: "",
  paperUrl: "",
  githubUrl: "",
  linkedInUrl:
    "https://www.linkedin.com/in/agatino-giuliano-mirabella-97abb3240/",
  personalWebsiteUrl: "",
  institutionUrl: "https://grupos.us.es/medicalphysics/",
  privacyInfoUrl: "",
  updatesFormEndpoint:
    import.meta.env.VITE_UPDATES_FORM_ENDPOINT?.trim() ?? "",
  downloads: {
    fiveKeySummary: "",
    presentation: "",
    paper: "",
    poster: "",
    code: "",
  },
  copy: {
    skipLink: "Skip to the challenge",
    landing: {
      kicker: "(less than 1 minute)",
      headline: "Spot the fake phase space",
      supportingLineOne: "Two are real Monte Carlo, the other is generated by our AI model.",
      supportingLineTwo:
        "Can you spot which one is it?",
      start: "Start the challenge",
      preparing: "Preparing the samples…",
      vaultReturn: "Your Flow Vault is still unlocked ↓",
    },
    game: {
      roundLabel: "Round {current} of {total}",
      prompt: "Which one is the fake phase space?",
      contextPrefix: "Condition",
      candidatesLabel: "Phase-space candidates",
      choosePrefix: "Choose candidate",
      correctFeedback: "Correct — you spotted the fake phase space.",
      incorrectFeedback:
        "The fake got past you. The correct answer was {correctLabel}.",
      next: "Next",
      seeResults: "See my result",
      loadingError:
        "One sample could not be loaded. This case will not be counted.",
      replaceCase: "Load another set",
      preparationError:
        "There are not enough complete image sets to run the challenge. Check the configured game assets and try again.",
      tryPreparationAgain: "Try loading again",
    },
    results: {
      kicker: "Experiment complete",
      scoreLabel: "You scored {score}/3",
      states: {
        3: {
          headline: "Phase-space detective.",
          support: "Apparently we made this too easy.",
        },
        2: {
          headline: "You caught the fake.",
          support: "But it slipped past you once.",
        },
        1: {
          headline: "The fake wins this round.",
          support: "You spotted the fake only once. Want another try?",
        },
        0: {
          headline: "Excellent news for the model.",
          support:
            "The fake fooled you three times. Your revenge is one tap away.",
        },
      },
      tryAgain: "Try again",
      playAgain: "Play again",
      preparingReplay: "Preparing a new set…",
      share: "Challenge a colleague",
      shareText:
        "I got {score}/3 on “Spot the fake phase space.” Can you do better?",
      linkCopied: "Challenge link copied.",
      shareUnavailable: "Copy the page URL to challenge a colleague.",
    },
    bridge: {
      kicker: "But the goal is not to “fool the eye”",
      headline: "Could you spot the fake?",
      body:
        "If a generated phase space can look convincing beside true Monte Carlo phase spaces, that is interesting — but visual similarity alone is not enough. The real question is whether the model reproduces the relevant stochastic distributions and physical behaviour.",
      cta: "Understand the work in 5 ideas ↓",
    },
    fiveKeys: {
      kicker: "The scientific idea",
      headline: "The work in 5 ideas",
      subtitle: "The version with (almost) no deep learning vocabulary.",
      ideas: [
        {
          title: "We do not want just one prediction.",
          body:
            "Many Monte Carlo quantities are stochastic. The goal is therefore not simply to reproduce an average result, but to generate realistic individual samples.",
        },
        {
          title: "Monte Carlo is our reference.",
          body:
            "Monte Carlo simulation provides the ground-truth distributions against which the generative model is trained and evaluated.",
        },
        {
          title: "The model learns a distribution.",
          body:
            "Instead of learning only a single deterministic output, the conditional normalizing flow learns how plausible outputs are distributed.",
        },
        {
          title:
            "The conditions define the problem; randomness gives us a sample.",
          body:
            "The conditioning variables describe the physical situation. Different latent samples can then produce different plausible realizations for the same conditions.",
        },
        {
          title: "Looking realistic is only the beginning.",
          body:
            "The goal is not to “fool the eye.” The important question is whether generated samples reproduce the statistically and physically relevant properties of Monte Carlo.",
        },
      ],
    },
    takeaway: {
      prefix: "If you remember one thing:",
      lineOne: "We are not asking a neural network for the answer.",
      lineTwo:
        "We are asking it to generate a realistic sample from the right distribution.",
    },
    downloads: {
      kicker: "Go deeper",
      headline: "Explore the material",
      labels: {
        fiveKeySummary: "Download the 5-key summary",
        presentation: "See the presentation",
        paper: "Read the paper / preprint",
        poster: "View the poster",
        code: "Open the code",
      },
    },
    flowVault: {
      kicker: "Bonus material",
      headline: "The Flow Vault 🔓",
      earned: "You unlocked the hidden gem of this work.",
      observations: [
        "A generated sample can preserve randomness while remaining tied to the same physical conditions.",
        "The final congress material can use this space for figures or comparisons that did not fit into the ten-minute talk.",
      ],
      noteLabel: "Vault note",
      assetUrl: "",
      assetAlt: "Additional true-versus-generated phase-space comparison.",
      assetCaption: "A comparison that did not fit into the oral presentation.",
      technicalDetailsUrl: "",
      technicalDetailsLabel: "Open technical details",
    },
    updates: {
      kicker: "Project updates",
      headline: "Follow the experiment",
      intro: "Interested in where this goes next?",
      body:
        "Get occasional updates when we release new results, a paper, code or interactive material.",
      emailLabel: "Institutional or personal email",
      emailPlaceholder: "you@institute.org",
      submit: "Keep me updated",
      submitting: "Sending…",
      success: "You're in. See you at the next result.",
      error:
        "That did not go through. Please check the address or try again in a moment.",
      consent:
        "Your email will only be used for updates about this research project.",
      privacyLink: "Privacy information",
      alternativeCta: "Follow the project",
      alternativeBody:
        "Email updates are not open yet. Follow the project through the links below.",
    },
    links: {
      kicker: "Keep exploring",
      headline: "Continue exploring",
      labels: {
        paper: "Paper / preprint",
        presentation: "Presentation",
        github: "GitHub",
        personalWebsite: "Research profile / personal website",
        linkedIn: "LinkedIn",
        institution: "Institution / project page",
      },
    },
    footer: {
      presentedAtPrefix: "Presented at",
      backToTop: "Back to top ↑",
    },
  },
} as const;
