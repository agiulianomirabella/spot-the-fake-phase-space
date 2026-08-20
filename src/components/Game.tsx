import { useEffect, useState } from "react";
import { siteConfig, type PhaseSpace } from "../config/content";
import {
  CARD_LABELS,
  ROUNDS_PER_ATTEMPT,
  interpolate,
  resolveAssetPath,
  type PreparedQuestion,
} from "../lib/game";

type GameProps = {
  readonly question: PreparedQuestion;
  readonly roundIndex: number;
  readonly selectedId: string | null;
  readonly onSelect: (phaseSpace: PhaseSpace) => void;
  readonly onNext: () => void;
  readonly onRecover: () => void;
};

export function Game({
  question,
  roundIndex,
  selectedId,
  onSelect,
  onNext,
  onRecover,
}: GameProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const { game } = siteConfig.copy;
  const revealed = selectedId !== null;
  const fakeIndex = question.phaseSpaces.findIndex(({ type }) => type === "fake");
  const correctLabel = CARD_LABELS[fakeIndex];
  const selected = question.phaseSpaces.find(({ id }) => id === selectedId);
  const isCorrect = selected?.type === "fake";

  useEffect(() => {
    setImageFailed(false);
  }, [question.id]);

  return (
    <main className="game-shell" id="main" tabIndex={-1}>
      <section className="game wrap" aria-labelledby="game-prompt">
        <div className="game__topline">
          <p className="kicker">
            {interpolate(game.roundLabel, {
              current: roundIndex + 1,
              total: ROUNDS_PER_ATTEMPT,
            })}
          </p>
          <div
            className="progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={ROUNDS_PER_ATTEMPT}
            aria-valuenow={roundIndex + 1}
            aria-label={interpolate(game.roundLabel, {
              current: roundIndex + 1,
              total: ROUNDS_PER_ATTEMPT,
            })}
          >
            {CARD_LABELS.map((label, index) => (
              <span
                className={index <= roundIndex ? "progress__step is-active" : "progress__step"}
                key={label}
              />
            ))}
          </div>
        </div>

        <h2 id="game-prompt">{game.prompt}</h2>
        {question.context && <p className="game__context">{question.context}</p>}

        {imageFailed ? (
          <div className="load-notice load-notice--game" role="alert">
            <p>{game.loadingError}</p>
            <button className="button" type="button" onClick={onRecover}>
              {game.replaceCase}
            </button>
          </div>
        ) : (
          <div className="phase-grid" aria-label={game.candidatesLabel}>
            {question.phaseSpaces.map((phaseSpace, index) => {
              const label = CARD_LABELS[index];
              const isSelected = phaseSpace.id === selectedId;
              const revealClass = revealed
                ? phaseSpace.type === "fake"
                  ? " phase-card--fake"
                  : " phase-card--monte-carlo"
                : "";

              return (
                <button
                  className={`phase-card${isSelected ? " is-selected" : ""}${revealClass}`}
                  type="button"
                  key={phaseSpace.id}
                  aria-pressed={isSelected}
                  aria-label={`${game.choosePrefix} ${label}`}
                  disabled={revealed}
                  onClick={() => onSelect(phaseSpace)}
                >
                  <span className="phase-card__label" aria-hidden="true">
                    {label}
                  </span>
                  <span className="phase-card__image-shell">
                    <img
                      src={resolveAssetPath(phaseSpace.image)}
                      alt={phaseSpace.alt}
                      width="600"
                      height="600"
                      loading="eager"
                      decoding="async"
                      onError={() => setImageFailed(true)}
                    />
                  </span>
                  {revealed && (
                    <span className="phase-card__reveal">
                      <strong>
                        {phaseSpace.type === "fake"
                          ? game.generatedLabel
                          : game.monteCarloLabel}
                      </strong>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {revealed && !imageFailed && (
          <div className="answer" aria-live="polite">
            <p className={`answer__headline ${isCorrect ? "is-correct" : "is-incorrect"}`}>
              {isCorrect
                ? game.correctFeedback
                : interpolate(game.incorrectFeedback, { correctLabel })}
            </p>
            <button className="button button--large" type="button" onClick={onNext}>
              {roundIndex === ROUNDS_PER_ATTEMPT - 1
                ? game.seeResults
                : game.next}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
