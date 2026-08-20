import { siteConfig } from "../config/content";

type LandingProps = {
  readonly ready: boolean;
  readonly error: boolean;
  readonly vaultUnlocked: boolean;
  readonly onStart: () => void;
  readonly onRetryPreparation: () => void;
};

export function Landing({
  ready,
  error,
  vaultUnlocked,
  onStart,
  onRetryPreparation,
}: LandingProps) {
  const { landing, game } = siteConfig.copy;

  return (
    <section className="landing" id="challenge" aria-labelledby="landing-title">
      <div className="wrap landing__inner">
        <p className="kicker">{landing.kicker}</p>
        <h1 id="landing-title">{landing.headline}</h1>
        <p className="landing__premise">
          {landing.supportingLineOne}
          <br />
          {landing.supportingLineTwo}
        </p>

        {error ? (
          <div className="load-notice" role="alert">
            <p>{game.preparationError}</p>
            <button className="button" type="button" onClick={onRetryPreparation}>
              {game.tryPreparationAgain}
            </button>
          </div>
        ) : (
          <button
            className="button button--large landing__cta"
            type="button"
            disabled={!ready}
            onClick={onStart}
          >
            {ready ? landing.start : landing.preparing}
          </button>
        )}

        <p className="landing__identity">{landing.identity}</p>

        {vaultUnlocked && (
          <a className="landing__vault-link" href="#flow-vault">
            {landing.vaultReturn}
          </a>
        )}
      </div>
    </section>
  );
}
