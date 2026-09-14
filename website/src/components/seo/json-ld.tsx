interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Injeta dados estruturados Schema.org na página. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
