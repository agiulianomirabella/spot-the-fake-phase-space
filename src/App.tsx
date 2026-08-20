import { useCallback, useEffect, useState } from "react";
import { questionBank, siteConfig, type PhaseSpace } from "./config/content";
import { Game } from "./components/Game";
import { Landing } from "./components/Landing";
import { Footer, ProjectLinks } from "./components/ProjectSections";
import { Results } from "./components/Results";
import { FlowVault } from "./components/ScienceSections";
import { trackEvent } from "./lib/analytics";
import {
  PASSING_SCORE,
  ROUNDS_PER_ATTEMPT,
  prepareAttempt,
  type PreparedQuestion,
} from "./lib/game";

type Screen = "landing" | "game" | "results";
type Score = 0 | 1 | 2 | 3;

const VAULT_STORAGE_KEY = "spot-the-fake:flow-vault-unlocked";
const RECENT_STORAGE_KEY = "spot-the-fake:recent-question-ids";

const readStoredQuestionIds = (): string[] => {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]");
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const scrollAndFocusMain = () => {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0 });
    document.getElementById("main")?.focus({ preventScroll: true });
  });
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [attempt, setAttempt] = useState<PreparedQuestion[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [completedScore, setCompletedScore] = useState<Score>(0);
  const [preparing, setPreparing] = useState(true);
  const [preparationError, setPreparationError] = useState(false);
  const [replayPreparing, setReplayPreparing] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(() => {
    try {
      return localStorage.getItem(VAULT_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const loadAttempt = useCallback(async (previousIds: readonly string[]) => {
    setPreparing(true);
    setPreparationError(false);

    try {
      const nextAttempt = await prepareAttempt(questionBank, previousIds);
      setAttempt(nextAttempt);
      setRoundIndex(0);
      setSelectedId(null);
      setAnswers([]);
      return true;
    } catch {
      setPreparationError(true);
      return false;
    } finally {
      setPreparing(false);
    }
  }, []);

  useEffect(() => {
    void loadAttempt(readStoredQuestionIds());
  }, [loadAttempt]);

  const handleStart = () => {
    if (attempt.length !== ROUNDS_PER_ATTEMPT) return;
    try {
      localStorage.setItem(
        RECENT_STORAGE_KEY,
        JSON.stringify(attempt.map(({ id }) => id)),
      );
    } catch {
      // Recent-question preference is optional and non-critical.
    }
    setScreen("game");
    trackEvent("challenge_started");
    scrollAndFocusMain();
  };

  const handleSelect = (phaseSpace: PhaseSpace) => {
    if (selectedId) return;
    const correct = phaseSpace.type === "fake";
    setSelectedId(phaseSpace.id);
    setAnswers((current) => [...current, correct]);
    trackEvent("answer_submitted", {
      round: roundIndex + 1,
      correct,
    });
  };

  const handleNext = () => {
    if (roundIndex < ROUNDS_PER_ATTEMPT - 1) {
      setRoundIndex((current) => current + 1);
      setSelectedId(null);
      scrollAndFocusMain();
      return;
    }

    const score = answers.filter(Boolean).length as Score;
    setCompletedScore(score);

    if (score >= PASSING_SCORE) {
      if (!vaultUnlocked) trackEvent("flow_vault_unlocked", { score });
      setVaultUnlocked(true);
      try {
        localStorage.setItem(VAULT_STORAGE_KEY, "true");
      } catch {
        // The vault still remains unlocked for the current page session.
      }
    }

    trackEvent("challenge_completed", { score });
    setScreen("results");
    scrollAndFocusMain();
  };

  const prepareReplay = async () => {
    setReplayPreparing(true);
    const previousIds = attempt.map(({ id }) => id);
    const loaded = await loadAttempt(previousIds);
    setReplayPreparing(false);

    if (!loaded) return;

    try {
      localStorage.setItem(
        RECENT_STORAGE_KEY,
        JSON.stringify(previousIds),
      );
    } catch {
      // Recent-question preference is optional and non-critical.
    }
    setScreen("game");
    trackEvent("challenge_retried");
    scrollAndFocusMain();
  };

  const recoverFromImageFailure = async () => {
    await prepareReplay();
  };

  return (
    <div id="top">
      <a className="skip-link" href="#main">
        {siteConfig.copy.skipLink}
      </a>

      {screen === "landing" && (
        <>
          <main id="main" tabIndex={-1}>
            <Landing
              ready={!preparing && attempt.length === ROUNDS_PER_ATTEMPT}
              error={preparationError}
              vaultUnlocked={vaultUnlocked}
              onStart={handleStart}
              onRetryPreparation={() => void loadAttempt(readStoredQuestionIds())}
            />
            {vaultUnlocked && (
              <>
                <FlowVault />
                <ProjectLinks />
              </>
            )}
          </main>
          <Footer />
        </>
      )}

      {screen === "game" && attempt[roundIndex] && (
        <Game
          question={attempt[roundIndex]}
          roundIndex={roundIndex}
          selectedId={selectedId}
          onSelect={handleSelect}
          onNext={handleNext}
          onRecover={() => void recoverFromImageFailure()}
        />
      )}

      {screen === "results" && (
        <>
          <Results
            score={completedScore}
            replayPreparing={replayPreparing}
            vaultUnlocked={vaultUnlocked}
            onReplay={() => void prepareReplay()}
          />
          <Footer />
        </>
      )}
    </div>
  );
}
