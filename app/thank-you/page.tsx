import Link from "next/link";

export default function ThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  return (
    <ThankYouContent searchParams={searchParams} />
  );
}

async function ThankYouContent({
  searchParams
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.ref || "CGF-PENDING";

  return (
    <section className="thank-you">
      <p className="eyebrow">Inquiry received</p>
      <h1>Reference {reference}</h1>
      <p>
        Your fish export inquiry has been recorded by the API. Keep this reference for follow-up, packing details,
        and documentation discussions.
      </p>
      <div>
        <Link href="/fish">Add another inquiry</Link>
        <Link href="/export-guide">Review export guide</Link>
      </div>
    </section>
  );
}
