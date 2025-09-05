import { aboutParagraphs, termsNConditions } from "./AboutPageContent";
export default function AboutPage() {
  return (
    <section>
      <h2>➤About</h2>

      {aboutParagraphs.map((para, idx) => (
        <p key={idx}>
          {para}
        </p>
      ))}

      <h2>
        ➤Terms & Conditions
      </h2>

      {termsNConditions.map((section, index) => (
        <div key={index}>
          <p>
            <strong>{section.title}</strong>
            <br />
            {section.content}
          </p>
        </div>
      ))}
    </section>
  );
}
