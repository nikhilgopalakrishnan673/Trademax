import logoMark from "../../assets/logo-mark.svg";

/** Logo mark plus "Journal" wordmark. */
export default function Brand({ className = "" }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2.5 font-bold whitespace-nowrap ${className}`}>
      <img src={logoMark} alt="" width="26" height="26" className="block size-[26px]" />
      Journal
    </span>
  );
}
