import LegalDocument, { ContactDetails, List, P, Placeholder, Section } from "../components/legal/Legal.jsx";

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy">
      <Section number={1} title="Information collected">
        <P>The Service only holds the information you type into it:</P>
        <List>
          <li>
            <b>Trade records:</b> pair, date, buy or sell, entry method, market conditions, confluences, risk level, RR ratio, maximum RR,
            result, P&amp;L and your notes, plus an internal ID and the times it was created and last changed.
          </li>
          <li><b>Profile:</b> the name and email address you enter on the log-in screen.</li>
          <li><b>Your own options:</b> any extra entry methods, confluences or risk levels you add.</li>
          <li>
            <b>Support messages:</b> the topic, name, email, subject and message you write, and the file name (not the contents) of any
            screenshot you pick.
          </li>
        </List>
        <P>
          The Service does not use analytics, advertising or tracking code, and it does not ask for payment details, your location or access
          to your broker account.
        </P>
      </Section>

      <Section number={2} title="How your data is used">
        <P>Your data is used only to run the Service on your device:</P>
        <List>
          <li>to list your trades and work out your statistics and calendar;</li>
          <li>to greet you by first name and pre-fill your name and email on the Support form;</li>
          <li>to remember the extra options you have added.</li>
        </List>
        <P>It is not used for profiling, advertising or sold to anyone.</P>
      </Section>

      <Section number={3} title="Data storage and retention">
        <P>
          Everything is saved in your browser’s local storage on your own device. It is not sent to a server, so we do not hold a copy.
          Browsers limit local storage to roughly 5 MB.
        </P>
        <List>
          <li>Trades stay until you delete them or clear this site’s data.</li>
          <li>Your name and email stay until you log out or clear this site’s data.</li>
          <li>
            Support messages are saved in your browser only. Support is not connected to an email service yet, so messages are not delivered
            to anyone.
          </li>
          <li>If saved trades can’t be read, the Service keeps a backup copy of that data in your browser so nothing is lost.</li>
        </List>
        <P>
          There is no set retention period because we do not receive the data. It remains on your device until you remove it.
        </P>
      </Section>

      <Section number={4} title="Cookies and localStorage">
        <P>The Service does not set cookies. It uses your browser’s localStorage for the following, all of which is needed for it to work:</P>
        <List>
          <li><b>Trades</b> (“tj-trades-v1”) and any backup copies of unreadable trade data.</li>
          <li><b>Profile</b> (“tj-profile”): your name and email.</li>
          <li><b>Your own options</b> (“tj-custom”).</li>
          <li><b>Support messages</b> (“tj-support-outbox”).</li>
        </List>
        <P>
          This data stays in your browser and is not shared with other sites. If you block storage, the Service will tell you that your changes
          can’t be saved.
        </P>
      </Section>

      <Section number={5} title="Third-party services">
        <P>
          The Service does not connect to any third-party service. There are no analytics, advertising, payment, log-in or font services, and
          the fonts and images it uses are served with the Service itself. The open-source libraries it is built with run inside your browser
          and do not receive your data.
        </P>
        <P>
          Whoever hosts the Service (<Placeholder>hosting provider name</Placeholder>) may automatically receive technical details such as your
          IP address when your browser loads the site, as with any website. The Service itself does not read or store this.
        </P>
        <P>If a server, email service or other third party is added later, this policy must be updated first.</P>
      </Section>

      <Section number={6} title="Data security and sharing">
        <P>
          Because your data stays on your device, we do not receive it and so cannot sell or share it. We cannot promise any particular level
          of security, and the Service does not encrypt what it stores.
        </P>
        <P>
          Local storage can be read by anyone who has access to your browser profile, and the log-in screen is not a password. Keep your device
          locked and use a private window on shared computers.
        </P>
      </Section>

      <Section number={7} title="User rights and data deletion">
        <P>You are in control of your data because it lives on your device:</P>
        <List>
          <li>View and edit your trades in the Trade log, and delete any trade you no longer want.</li>
          <li>Log out from the Log in page to remove your saved name and email.</li>
          <li>
            To remove everything, clear this site’s data in your browser settings. This permanently deletes your trades, profile, options and
            saved support messages from that browser.
          </li>
        </List>
        <P>
          Depending on where you live you may have additional rights under local data protection law.{" "}
          <Placeholder>rights, legal bases and how to make a request, to be added after legal review</Placeholder>
        </P>
      </Section>

      <Section number={8} title="Policy updates">
        <P>
          We may update this policy from time to time. The “Last updated” date at the top shows when it last changed. If the way your data is
          handled changes, for example if accounts or a server are added, this policy will be updated first.
        </P>
      </Section>

      <Section number={9} title="Contact information">
        <P>
          For privacy questions, please get in touch. Operator: <Placeholder>operator or company name</Placeholder>.
        </P>
        <ContactDetails />
      </Section>
    </LegalDocument>
  );
}
