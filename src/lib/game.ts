import type { PhaseSpace, Question } from "../config/content";

export const ROUNDS_PER_ATTEMPT = 3;
export const PASSING_SCORE = 2;
export const CARD_LABELS = ["A", "B", "C"] as const;

export type CardLabel = (typeof CARD_LABELS)[number];

export type PreparedQuestion = Omit<Question, "phaseSpaces"> & {
  readonly phaseSpaces: readonly PhaseSpace[];
};

const shuffle = <T,>(items: readonly T[]): T[] => {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [
      result[swapIndex],
      result[index],
    ];
  }

  return result;
};

export const resolveAssetPath = (path: string): string => {
  if (/^(?:https?:|data:|blob:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
};

export const isValidQuestion = (question: Question): boolean => {
  const monteCarloCount = question.phaseSpaces.filter(
    ({ type }) => type === "monteCarlo",
  ).length;
  const fakeCount = question.phaseSpaces.filter(
    ({ type }) => type === "fake",
  ).length;

  return (
    question.phaseSpaces.length === 3 &&
    monteCarloCount === 2 &&
    fakeCount === 1
  );
};

const loadImage = (path: string): Promise<boolean> =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = resolveAssetPath(path);
  });

const questionImagesLoad = async (question: Question): Promise<boolean> => {
  const results = await Promise.all(
    question.phaseSpaces.map(({ image }) => loadImage(image)),
  );
  return results.every(Boolean);
};

export const prepareAttempt = async (
  questions: readonly Question[],
  previousAttemptIds: readonly string[] = [],
): Promise<PreparedQuestion[]> => {
  const previousIds = new Set(previousAttemptIds);
  const validQuestions = questions.filter(isValidQuestion);
  const preferred = shuffle(
    validQuestions.filter(({ id }) => !previousIds.has(id)),
  );
  const fallback = shuffle(
    validQuestions.filter(({ id }) => previousIds.has(id)),
  );
  const prepared: PreparedQuestion[] = [];

  for (const question of [...preferred, ...fallback]) {
    if (!(await questionImagesLoad(question))) continue;

    prepared.push({
      ...question,
      phaseSpaces: shuffle(question.phaseSpaces),
    });

    if (prepared.length === ROUNDS_PER_ATTEMPT) break;
  }

  if (prepared.length !== ROUNDS_PER_ATTEMPT) {
    throw new Error("Not enough complete game questions are available.");
  }

  return prepared;
};

export const interpolate = (
  template: string,
  values: Readonly<Record<string, string | number>>,
): string =>
  Object.entries(values).reduce(
    (result, [key, value]) =>
      result.split(`{${key}}`).join(String(value)),
    template,
  );
