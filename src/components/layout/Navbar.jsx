// Site header: logo, page links, "Log trade" button, account avatar.
// Below 768px the links move into a menu opened by the menu button.
import { useCallback, useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext.jsx";
import { useTradePanel } from "../../context/TradePanelContext.jsx";
import { useEscapeKey } from "../../hooks/useEscapeKey.js";
import Brand from "./Brand.jsx";

const NAV_ITEMS = [
  { route: "dashboard", label: "Dashboard" },
  { route: "daily-stats", label: "Daily stats" },
  { route: "trade-log", label: "Trade log" },
  { route: "support", label: "Support" },
];

export default function Navbar({ route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useProfile();
  const { openNewTrade } = useTradePanel();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEscapeKey(closeMenu, menuOpen);

  // Close the menu after navigating, and when the screen grows to tablet width.
  useEffect(() => {
    closeMenu();
  }, [route, closeMenu]);
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && closeMenu();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [closeMenu]);

  const initial = profile?.name?.trim()[0]?.toUpperCase();

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="gutter mx-auto flex max-w-page items-center gap-3 py-3.5 md:gap-4 md:py-[22px] lg:gap-6 2xl:max-w-page-wide">
        <a className="-my-2 flex items-center py-2 text-base text-fg no-underline" href="#home" aria-label="Journal, home">
          <Brand />
        </a>
        <nav className="hidden min-w-0 flex-1 gap-1 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.route}
              href={`#${item.route}`}
              aria-current={route === item.route ? "page" : undefined}
              className="rounded-[9px] px-2.5 py-2 text-[0.9375rem] font-medium whitespace-nowrap lg:px-3.5 text-muted no-underline hover:bg-surface hover:text-fg aria-[current=page]:bg-surface-2 aria-[current=page]:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-2.5 md:ml-0">
          <button className="btn btn-primary px-3 sm:px-3.5" type="button" onClick={() => { closeMenu(); openNewTrade(); }}>
            <span aria-hidden="true">+</span> Log<span className="hidden sm:inline"> trade</span>
          </button>
          <a
            href="#login"
            title={profile ? `Account: ${profile.name}` : "Log in"}
            aria-label={profile ? `Account: ${profile.name}` : "Log in"}
            className="grid size-10 place-items-center rounded-full border border-line bg-surface-2 text-xs font-semibold text-muted no-underline lg:size-[30px]"
          >
            {initial || (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M2 12.5c.6-2.3 2.6-3.5 5-3.5s4.4 1.2 5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            )}
          </a>
          <button
            type="button"
            className="grid size-10 cursor-pointer place-items-center rounded-[9px] border border-line bg-surface text-fg md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className="gutter border-t border-line pt-2 pb-3 md:hidden" aria-label="Main" hidden={!menuOpen}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.route}
            href={`#${item.route}`}
            aria-current={route === item.route ? "page" : undefined}
            onClick={closeMenu}
            className="flex min-h-12 items-center rounded-[9px] px-3 text-base font-medium text-muted no-underline aria-[current=page]:bg-surface-2 aria-[current=page]:text-fg"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
