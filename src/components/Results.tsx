import { useState } from "react";
import { siteConfig } from "../config/content";
import { trackEvent } from "../lib/analytics";
import { interpolate } from "../lib/game";
import { ProjectLinks, ProjectUpdates } from "./ProjectSections";
import { Downloads, FiveKeys, FlowVault, Takeaway } from "./ScienceSections";

type ResultsProps = {
  readonly score: 0 | 1 | 2 | 3;
  readonly replayPreparing: boolean;
  readonly vaultUnlocked: boolean;
  readonly onReplay: () => void;
};

function ShareButton({ score }: { readonly score: number }) {
  const [status, setStatus] = useState("");
  const { results } = siteConfig.copy;

  const handleShare = async () => {
    const url = window.location.href.split("#")[0];
    const text = interpolate(results.shareText, { score });

    try {
      if (navigator.share) {
        await navigator.share({ title: siteConfig.copy.landing.headline, text, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setStatus(results.linkCopied);
      } else {
        setStatus(results.shareUnavailable);
        return;
      }
      trackEvent("share_clicked", { score });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus(results.shareUnavailable);
    }
  };

  return (
    <div className="share-action">
      <button className="text-button" type="button" onClick={handleShare}>
        {results.share} <span aria-hidden="true">↗</span>
      </button>
      <span aria-live="polite">{status}</span>
    </div>
  );
}

export function Results({
  score,
  replayPreparing,
  vaultUnlocked,
  onReplay,
}: ResultsProps) {
  const { results, bridge } = siteConfig.copy;
  const state = results.states[score];

  return (
    <main id="main" tabIndex={-1}>
      <section className="results" aria-labelledby="results-title">
        <div className="wrap results__grid">
          <div className="score-card">
            <p className="kicker">{results.kicker}</p>
            <p className="score-card__score">
              {interpolate(results.scoreLabel, { score })}
            </p>
            <h1 id="results-title">{state.headline}</h1>
            <p className="score-card__support">{state.support}</p>
            <div className="score-card__actions">
              <button
                className={`button${score < 2 ? " button--large" : " button--secondary"}`}
                type="button"
                disabled={replayPreparing}
                onClick={onReplay}
              >
                {replayPreparing
                  ? results.preparingReplay
                  : score < 2
                    ? results.tryAgain
                    : results.playAgain}
              </button>
              <ShareButton score={score} />
            </div>
          </div>

          <div className="bridge-card">
            <p className="kicker">{bridge.kicker}</p>
            <h2>{bridge.headline}</h2>
            <p>{bridge.body}</p>
            <a
              className="bridge-card__link"
              href="#five-keys"
              onClick={() => trackEvent("five_keys_opened")}
            >
              {bridge.cta}
            </a>
          </div>
        </div>
      </section>

      <FiveKeys />
      <Takeaway />
      {vaultUnlocked && <FlowVault />}
      <Downloads />
      <ProjectUpdates />
      <ProjectLinks />
    </main>
  );
}
