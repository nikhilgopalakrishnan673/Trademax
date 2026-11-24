import { useRef, useState } from "react";
import Field from "../components/common/Field.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import { SUPPORT_EMAIL } from "../config.js";
import { useProfile } from "../context/ProfileContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { SUPPORT_IS_CONNECTED, submitSupportMessage } from "../services/supportService.js";
import { EMAIL_PATTERN } from "../utils/format.js";

const TOPICS = [
  ["Account", "Login, profile, plan"],
  ["Trade log", "Missing or wrong entries"],
  ["Dashboard", "Stats look off"],
  ["Something else", "Ideas, feedback"],
];

const FAQ = [
  ["How is profit factor calculated?", "Total won divided by total lost, using closed trades only. Running trades are left out."],
  ["Why isn’t a trade on my calendar?", "Only closed trades show. A trade marked RUNNING appears under Open positions until you close it."],
  ["Where are my trades saved?", "In this browser’s local storage. They stay after a refresh, but they don’t sync to other browsers or devices, and clearing site data removes them."],
];

function FaqItem({ question, answer }) {
  return (
    <details className="group border-t border-line py-3 first-of-type:border-t-0 first-of-type:pt-0">
      <summary className="flex min-h-8 cursor-pointer items-center justify-between gap-2.5 font-medium">
        {question}<span className="text-faint group-open:hidden">+</span><span className="hidden text-faint group-open:inline">–</span>
      </summary>
      <p className="mt-2 text-muted">{answer}</p>
    </details>
  );
}

const emptyMessage = (profile) => ({ topic: TOPICS[0][0], name: profile?.name ?? "", email: profile?.email ?? "", subject: "", message: "", screenshot: null });

export default function SupportPage() {
  const { profile } = useProfile();
  const { showToast } = useToast();
  const [form, setForm] = useState(() => emptyMessage(profile));
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const fileInput = useRef(null);

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = {};
    if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) found.email = "Enter a valid email, like you@example.com.";
    if (!form.message.trim()) found.message = "Write a message so we know what happened.";
    if (Object.keys(found).length) return setErrors(found);

    setSending(true);
    try {
      await submitSupportMessage({ ...form, name: form.name.trim(), email: form.email.trim(), message: form.message.trim(), screenshot: form.screenshot?.name ?? null });
      showToast(SUPPORT_IS_CONNECTED ? "Message sent. We’ll reply by email." : "Message saved in this browser. Support isn’t connected yet, so it wasn’t sent.");
      setForm(emptyMessage(profile));
      if (fileInput.current) fileInput.current.value = "";
    } catch (error) {
      showToast(error.message, "error");
    }
    setSending(false);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(SUPPORT_EMAIL)
      .then(() => showToast("Email copied"))
      .catch(() => showToast("Couldn’t copy. Select the address and copy it yourself.", "error"));
  };

  return (
    <>
      <PageHeader title="Support" subtitle="Tell us what’s wrong and we’ll get back to you by email." />
      <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="card">
          <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
            <Field label="What is it about?">
              <div className="grid gap-2 sm:grid-cols-2" role="group">
                {TOPICS.map(([topic, description]) => (
                  <button key={topic} type="button" aria-pressed={form.topic === topic} onClick={() => setField("topic", topic)}
                    className="cursor-pointer rounded-[10px] border border-line bg-bg p-3 text-left aria-pressed:border-accent aria-pressed:bg-accent/10">
                    <b className="block text-[13px]">{topic}</b><span className="text-xs text-muted">{description}</span>
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-3.5">
              <Field label="Name" htmlFor="s-name">
                <input className="input" id="s-name" autoComplete="name" placeholder="Your name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
              </Field>
              <Field label="Email" htmlFor="s-email" error={errors.email}>
                <input className={`input ${errors.email ? "border-loss" : ""}`} id="s-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setField("email", e.target.value)} />
              </Field>
            </div>
            <Field label="Subject" htmlFor="s-subj">
              <input className="input" id="s-subj" placeholder="e.g. Calendar shows the wrong day" value={form.subject} onChange={(e) => setField("subject", e.target.value)} />
            </Field>
            <Field label="Message" htmlFor="s-msg" error={errors.message}>
              <textarea className={`input min-h-[110px] resize-y ${errors.message ? "border-loss" : ""}`} id="s-msg" placeholder="What happened, and what did you expect?" value={form.message} onChange={(e) => setField("message", e.target.value)} />
            </Field>
            <Field label="Screenshot (optional)">
              <label className="cursor-pointer rounded-[10px] border border-dashed border-line p-4 text-center text-[13px]" htmlFor="s-file">
                {form.screenshot ? <>Attached: <b>{form.screenshot.name}</b> · <u>change</u></> : <>Drop an image or <u>browse</u></>}
              </label>
              <input ref={fileInput} id="s-file" type="file" accept="image/*" hidden onChange={(e) => setField("screenshot", e.target.files[0] ?? null)} />
            </Field>
            <div className="flex justify-end">
              <button className="btn btn-primary w-full disabled:opacity-60 sm:w-auto" type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"}</button>
            </div>
          </form>
        </section>
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          <section className="card">
            <div className="font-medium">Email us</div>
            <p className="sub">We usually reply within 24 hours, Monday to Friday.</p>
            <div className="mt-2.5 flex items-center justify-between gap-2.5 rounded-[9px] border border-line bg-bg py-2 pr-2 pl-3">
              <code className="min-w-0 truncate font-sans select-all">{SUPPORT_EMAIL}</code>
              <button className="btn shrink-0" type="button" onClick={copyEmail}>Copy</button>
            </div>
          </section>
          <section className="card">
            <h2 className="mb-3 text-base">Quick answers</h2>
            {FAQ.map(([q, a]) => <FaqItem key={q} question={q} answer={a} />)}
          </section>
        </div>
      </div>
    </>
  );
}
