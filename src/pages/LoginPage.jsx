// Name + email screen. The header is hidden on this page; ✕ or Esc goes back to Home.
// This is not real authentication: it only remembers your name and email in this browser.
import { useState } from "react";
import Field from "../components/common/Field.jsx";
import Brand from "../components/layout/Brand.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useEscapeKey } from "../hooks/useEscapeKey.js";
import { navigate } from "../hooks/useHashRoute.js";
import { EMAIL_PATTERN } from "../utils/format.js";

export default function LoginPage() {
  const { profile, logIn, logOut } = useProfile();
  const { showToast } = useToast();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [errors, setErrors] = useState({});

  useEscapeKey(() => navigate("home"), true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!name.trim()) found.name = "Enter your name.";
    else if (name.trim().length > 60) found.name = "Keep your name under 60 characters.";
    if (!EMAIL_PATTERN.test(email.trim())) found.email = "Enter a valid email, like you@example.com.";
    setErrors(found);
    if (Object.keys(found).length) return document.getElementById(found.name ? "l-name" : "l-email")?.focus();
    try {
      logIn({ name: name.trim(), email: email.trim() });
      navigate("home");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleLogOut = () => {
    logOut();
    setName("");
    setEmail("");
    showToast("Logged out. Your trades are still saved in this browser.");
  };

  return (
    <div className="grid min-h-[calc(100dvh-7rem)] place-items-center py-4">
      <section className="card relative flex w-full max-w-[400px] flex-col gap-[22px] p-6 sm:p-8">
        <a className="absolute top-2 right-2 grid size-10 place-items-center rounded-lg border border-transparent text-base text-muted no-underline hover:border-line hover:bg-surface-2 hover:text-fg sm:top-3 sm:right-3 sm:size-8" href="#home" aria-label="Close and go back to Home" title="Close">✕</a>
        <div className="flex justify-center text-lg"><Brand /></div>
        <div className="text-center">
          <h1 className="text-2xl">{profile ? "Your profile" : "Log in"}</h1>
          <p className="sub">{profile ? `Logged in as ${profile.name}.` : "Pick up where you left off."}</p>
        </div>
        <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
          <Field label="Name" htmlFor="l-name" error={errors.name}>
            <input className={`input ${errors.name ? "border-loss" : ""}`} id="l-name" autoComplete="name" placeholder="Your name" value={name}
              onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }} />
          </Field>
          <Field label="Email" htmlFor="l-email" error={errors.email}>
            <input className={`input ${errors.email ? "border-loss" : ""}`} id="l-email" type="email" autoComplete="email" placeholder="you@example.com" value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }} />
          </Field>
          <button className="btn btn-primary min-h-11" type="submit">{profile ? "Save" : "Continue"}</button>
          {profile && <button className="btn min-h-11" type="button" onClick={handleLogOut}>Log out</button>}
        </form>
        <div className="text-center text-xs text-faint">
          Your name and email stay in this browser. <a className="inline-block py-2 text-muted" href="#support">Contact support</a>
        </div>
      </section>
    </div>
  );
}
