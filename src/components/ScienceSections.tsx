import { siteConfig } from "../config/content";
import { trackEvent } from "../lib/analytics";
import { resolveAssetPath } from "../lib/game";

export function FiveKeys() {
  const { fiveKeys } = siteConfig.copy;

  return (
    <section className="section section--paper" id="five-keys" aria-labelledby="five-keys-title">
      <div className="wrap">
        <p className="kicker">{fiveKeys.kicker}</p>
        <h2 id="five-keys-title">{fiveKeys.headline}</h2>
        <p className="section__lead">{fiveKeys.subtitle}</p>
        <ol className="ideas">
          {fiveKeys.ideas.map((idea, index) => (
            <li className="idea-card" key={idea.title}>
              <span className="idea-card__number">0{index + 1}</span>
              <div>
                <h3>{idea.title}</h3>
                <p>{idea.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Takeaway() {
  const { takeaway } = siteConfig.copy;

  return (
    <section className="takeaway" aria-labelledby="takeaway-title">
      <div className="wrap takeaway__inner">
        <p>{takeaway.prefix}</p>
        <h2 id="takeaway-title">
          {takeaway.lineOne}
          <br />
          <em>{takeaway.lineTwo}</em>
        </h2>
      </div>
    </section>
  );
}

export function Downloads() {
  const { downloads } = siteConfig;
  const copy = siteConfig.copy.downloads;
  const items = [
    ["fiveKeySummary", downloads.fiveKeySummary, copy.labels.fiveKeySummary],
    ["presentation", downloads.presentation, copy.labels.presentation],
    ["paper", downloads.paper, copy.labels.paper],
    ["poster", downloads.poster, copy.labels.poster],
    ["code", downloads.code, copy.labels.code],
  ] as const;
  const configuredItems = items.filter(([, url]) => Boolean(url));

  if (configuredItems.length === 0) return null;

  return (
    <section className="section" aria-labelledby="downloads-title">
      <div className="wrap">
        <p className="kicker">{copy.kicker}</p>
        <h2 id="downloads-title">{copy.headline}</h2>
        <div className="link-pills">
          {configuredItems.map(([kind, url, label]) => (
            <a
              className="pill"
              href={url}
              key={kind}
              onClick={() => trackEvent("download_clicked", { kind })}
            >
              {label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FlowVault() {
  const { flowVault } = siteConfig.copy;

  return (
    <section className="vault" id="flow-vault" aria-labelledby="vault-title">
      <div className="wrap vault__inner">
        <p className="kicker">{flowVault.kicker}</p>
        <h2 id="vault-title">{flowVault.headline}</h2>
        <p className="vault__earned">{flowVault.earned}</p>

        <div className="vault__observations">
          {flowVault.observations.map((observation, index) => (
            <article key={observation}>
              <span>
                {flowVault.noteLabel} 0{index + 1}
              </span>
              <p>{observation}</p>
            </article>
          ))}
        </div>

        {flowVault.assetUrl && (
          <figure className="vault__figure">
            <img
              src={resolveAssetPath(flowVault.assetUrl)}
              alt={flowVault.assetAlt}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{flowVault.assetCaption}</figcaption>
          </figure>
        )}

        {flowVault.technicalDetailsUrl && (
          <a className="button button--secondary" href={flowVault.technicalDetailsUrl}>
            {flowVault.technicalDetailsLabel}
          </a>
        )}
      </div>
    </section>
  );
}
