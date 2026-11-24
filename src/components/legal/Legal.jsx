// Building blocks shared by the Terms and Privacy pages.
// Do not add in-page anchor links (href="#section"): the router reads the URL hash as the page name.
import { CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "../../config.js";
import PageHeader from "../layout/PageHeader.jsx";

/** Marks a detail you still have to fill in. It is highlighted so it can't be missed or mistaken for real text. */
export function Placeholder({ children }) {
  return <span className="rounded bg-run/15 px-1 font-medium text-fg">[{children}]</span>;
}

/** Page frame: title, last-updated line, draft notice, then the sections. */
export default function LegalDocument({ title, children }) {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={title} subtitle={`Last updated: ${LEGAL_LAST_UPDATED}`} />
      <article className="card p-5 sm:p-8">
        <p className="mb-8 rounded-[9px] border border-run/40 bg-run/10 p-3 text-[0.8125rem] text-fg">
          <b>Draft template.</b> Anything shown as a highlighted <Placeholder>placeholder</Placeholder> still needs your real details. Have a
          qualified legal professional review this page before you rely on it.
        </p>
        <div className="flex flex-col gap-8">{children}</div>
      </article>
    </div>
  );
}

/** One numbered section with a heading. */
export function Section({ number, title, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg">
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}

export function P({ children }) {
  return <p className="leading-relaxed text-muted">{children}</p>;
}

/** The contact sentence for the last section: a real email link when one is set in config.js, otherwise a placeholder. */
export function ContactDetails() {
  return (
    <P>
      {CONTACT_EMAIL ? (
        <>
          You can contact us at{" "}
          <a className="text-accent underline-offset-2 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </>
      ) : (
        <>
          Contact details: <Placeholder>contact email address and, if required, postal address</Placeholder>
        </>
      )}
    </P>
  );
}

export function List({ children }) {
  return <ul className="flex list-disc flex-col gap-1.5 pl-5 leading-relaxed text-muted marker:text-faint">{children}</ul>;
}
