import { useState, type FormEvent } from "react";
import { siteConfig } from "../config/content";
import { trackEvent } from "../lib/analytics";

type SubmissionState = "idle" | "loading" | "success" | "error";

export function ProjectUpdates() {
  const [state, setState] = useState<SubmissionState>("idle");
  const { updates } = siteConfig.copy;
  const endpoint = siteConfig.updatesFormEndpoint;
  const alternativeUrl =
    siteConfig.personalWebsiteUrl || siteConfig.linkedInUrl || siteConfig.institutionUrl;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!endpoint) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("loading");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) throw new Error("Update signup failed.");
      setState("success");
      form.reset();
      trackEvent("updates_submitted");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="section updates" aria-labelledby="updates-title">
      <div className="wrap updates__grid">
        <div>
          <p className="kicker">{updates.kicker}</p>
          <h2 id="updates-title">{updates.headline}</h2>
        </div>
        <div className="updates__panel">
          <h3>{updates.intro}</h3>
          <p>{updates.body}</p>

          {endpoint ? (
            state === "success" ? (
              <p className="form-message form-message--success" role="status">
                {updates.success}
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="updates-email">{updates.emailLabel}</label>
                <div className="email-row">
                  <input
                    id="updates-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={updates.emailPlaceholder}
                    required
                    disabled={state === "loading"}
                  />
                  <button className="button" type="submit" disabled={state === "loading"}>
                    {state === "loading" ? updates.submitting : updates.submit}
                  </button>
                </div>
                {state === "error" && (
                  <p className="form-message form-message--error" role="alert">
                    {updates.error}
                  </p>
                )}
                <p className="form-consent">
                  {updates.consent}{" "}
                  {siteConfig.privacyInfoUrl && (
                    <a href={siteConfig.privacyInfoUrl}>{updates.privacyLink}</a>
                  )}
                </p>
              </form>
            )
          ) : (
            <div className="updates__alternative">
              <p>{updates.alternativeBody}</p>
              {alternativeUrl && (
                <a className="button button--secondary" href={alternativeUrl}>
                  {updates.alternativeCta}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ProjectLinks() {
  const { links, footer } = siteConfig.copy;
  const items = [
    ["paper", siteConfig.paperUrl, links.labels.paper],
    ["presentation", siteConfig.presentationUrl, links.labels.presentation],
    ["github", siteConfig.githubUrl, links.labels.github],
    ["personal", siteConfig.personalWebsiteUrl, links.labels.personalWebsite],
    ["linkedin", siteConfig.linkedInUrl, links.labels.linkedIn],
    ["institution", siteConfig.institutionUrl, links.labels.institution],
  ] as const;
  const configuredItems = items.filter(([, url]) => Boolean(url));

  if (configuredItems.length === 0) return null;

  return (
    <section className="section section--compact" aria-labelledby="links-title">
      <div className="wrap">
        <p className="kicker">{links.kicker}</p>
        <h2 id="links-title">{links.headline}</h2>
        <div className="link-pills">
          {configuredItems.map(([kind, url, label]) => (
            <a
              className="pill"
              href={url}
              key={kind}
              onClick={() => {
                if (kind === "paper") trackEvent("paper_clicked");
                if (kind === "github") trackEvent("github_clicked");
              }}
            >
              {label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <a className="project-links__back-to-top" href="#top">
          {footer.backToTop}
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer__inner">
        <div>
          <strong>{siteConfig.projectName}</strong>
          <p>
            {siteConfig.researcherName} · {siteConfig.institution}
          </p>
          {siteConfig.congressName && (
            <p>
              {siteConfig.copy.footer.presentedAtPrefix} {siteConfig.congressName}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
