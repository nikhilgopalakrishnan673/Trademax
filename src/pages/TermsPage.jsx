import LegalDocument, { ContactDetails, List, P, Placeholder, Section } from "../components/legal/Legal.jsx";

export default function TermsPage() {
  return (
    <LegalDocument title="Terms &amp; Conditions">
      <Section number={1} title="Introduction and acceptance of terms">
        <P>
          MIND METRICS (the “Service”) is a web app for recording your own trades and viewing statistics worked out from them. The Service is
          provided by <Placeholder>operator or company name and registered address</Placeholder>.
        </P>
        <P>
          By using the Service you agree to these Terms &amp; Conditions. If you do not agree, please do not use it. You should also read our{" "}
          <a className="text-accent underline-offset-2 hover:underline" href="#privacy-policy">Privacy Policy</a>, which explains how your data is
          handled.
        </P>
      </Section>

      <Section number={2} title="Platform usage and user responsibilities">
        <P>The Service currently runs entirely in your web browser. This means:</P>
        <List>
          <li>Your trades, profile and settings are saved in your browser’s local storage on your device. They are not stored on a server and do not sync between browsers or devices.</li>
          <li>Clearing your browser’s site data, using a private window, or switching browsers or devices can remove or hide your records. You are responsible for keeping your own copies of anything you cannot afford to lose.</li>
          <li>The log-in screen only remembers a name and email in your browser. It is not real authentication and does not protect your data. Anyone who can use your browser profile can see your records. You are responsible for keeping your device secure.</li>
          <li>You are responsible for the information you enter and for using the Service in line with the law that applies to you.</li>
        </List>
      </Section>

      <Section number={3} title="Trading records and data accuracy">
        <P>
          Every figure in the Service, including net P&amp;L, win rate, profit factor and the calendar, is calculated from the trades you
          enter yourself. The Service does not connect to a broker, import trades or check your entries, so incorrect or missing entries will
          produce incorrect statistics.
        </P>
        <List>
          <li>Trades marked RUNNING are treated as open positions and are left out of closed-trade figures.</li>
          <li>The “markets open” or “markets closed” label on the home page only reflects whether today is a weekday. It is not a live market status.</li>
          <li>We do not guarantee that calculations are free of errors. Check important figures against your broker’s statements.</li>
        </List>
      </Section>

      <Section number={4} title="Acceptable use">
        <P>You agree not to:</P>
        <List>
          <li>use the Service for anything unlawful, or to store content you have no right to store;</li>
          <li>try to disrupt, overload, probe or gain unauthorised access to the Service or to anyone else’s data;</li>
          <li>copy, resell or republish the Service or its design, except as the law or an open-source licence allows;</li>
          <li>upload or enter malicious code, or use automated tools to interfere with how the Service works.</li>
        </List>
      </Section>

      <Section number={5} title="Intellectual property">
        <P>
          The Service, including its design, code, text and logo, belongs to <Placeholder>owner name</Placeholder> or its licensors and is
          protected by intellectual property law. You are given a limited, personal, non-transferable right to use it.
        </P>
        <P>
          The trades, notes and other content you enter remain yours. The Service also uses open-source components, such as the Rubik and Noto
          Color Emoji fonts, which are covered by their own licences.
        </P>
      </Section>

      <Section number={6} title="Limitation of liability">
        <P>
          The Service is provided “as is” and “as available”, without promises that it will be uninterrupted, error-free or suitable for a
          particular purpose. To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of the
          Service. This includes trading losses, lost or corrupted records (for example after clearing browser data), and decisions you make
          based on the statistics shown.
        </P>
        <P>Nothing in these terms limits any liability that cannot be limited by law.</P>
      </Section>

      <Section number={7} title="No financial or investment advice">
        <P>
          The Service is a record-keeping and statistics tool. It does not give financial, investment, tax or legal advice and it does not
          recommend any trade. It is not a broker, and it does not place or manage trades.
        </P>
        <P>
          Statistics describe only the past trades you entered. Past performance does not indicate future results. Trading carries a risk of
          loss, and you are solely responsible for your trading decisions. Speak to a qualified professional if you need advice.
        </P>
      </Section>

      <Section number={8} title="Account termination">
        <P>
          The Service does not currently have server-side accounts. You can stop using it at any time. Logging out removes the saved name and
          email from your browser, and you can remove all remaining data by clearing this site’s data in your browser settings.
        </P>
        <P>
          We may suspend or restrict access to the Service if these terms are broken or if we need to for legal or security reasons.{" "}
          <Placeholder>describe notice period and process if accounts are introduced</Placeholder>
        </P>
      </Section>

      <Section number={9} title="Changes to these terms">
        <P>
          We may update these terms from time to time. The “Last updated” date at the top shows when they last changed. If you keep using the
          Service after a change, you accept the updated terms.
        </P>
        <P>
          Governing law and jurisdiction: <Placeholder>country or state whose law applies, and where disputes are handled</Placeholder>
        </P>
      </Section>

      <Section number={10} title="Contact information">
        <P>If you have questions about these terms, please get in touch.</P>
        <ContactDetails />
      </Section>
    </LegalDocument>
  );
}
