interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * JSON-LD structured data component for SEO.
 * The data prop is developer-controlled (not user input),
 * so dangerouslySetInnerHTML is safe here — no user-generated content is passed.
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
