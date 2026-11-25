// Site footer: logo and description on top, then one line with the links and the copyright.
// Shown on every page except Login. Uses the slate navy from the palette so it sits apart from the page.
import Brand from "./Brand.jsx";

const LINKS = [
  { route: "terms-and-conditions", label: "Terms & Conditions" },
  { route: "privacy-policy", label: "Privacy Policy" },
  { route: "support", label: "Support" },
];

const LINK =
  "inline-flex min-h-9 items-center text-[0.875rem] sm:text-[0.9375rem] text-bg/75 no-underline underline-offset-4 hover:text-bg hover:underline aria-[current=page]:font-semibold aria-[current=page]:text-bg aria-[current=page]:underline";

export default function Footer({ route }) {
  return (
    <footer className="bg-fg text-bg">
      <div className="gutter mx-auto max-w-page 2xl:max-w-page-wide">
        {/* Row 1: brand and description */}
        <div className="py-5 md:py-6">
          <a className="-my-2 inline-flex items-center py-2 text-lg text-bg no-underline" href="#home" aria-label="MIND METRICS, home">
            <Brand />
          </a>
          <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-bg/70">
            A personal trading journal for logging trades and tracking P&amp;L, win rate and profit factor. Your data stays in your browser.
          </p>
        </div>

        {/* Row 2: links on one line, copyright at the end */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 border-t border-bg/15 py-1.5">
          <nav className="flex flex-wrap gap-x-4 sm:gap-x-6" aria-label="Footer">
            {LINKS.map((item) => (
              <a key={item.route} className={LINK} href={`#${item.route}`} aria-current={route === item.route ? "page" : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <p className="py-1.5 text-[0.8125rem] text-bg/60">© {new Date().getFullYear()} MIND METRICS</p>
        </div>
      </div>
    </footer>
  );
}
