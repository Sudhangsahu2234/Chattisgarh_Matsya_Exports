import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="footer-hindi">छत्तीसगढ़ मत्स्य निर्यात</span>
        <p>
          Built for exporters, fish farmers, and buyers exploring Chhattisgarh freshwater species, licenses,
          transport conditions, and inquiry-based ordering.
        </p>
      </div>
      <div className="footer-links">
        <Link href="/fish">Fish catalog</Link>
        <Link href="/export-guide">Export guide</Link>
        <Link href="/licenses">License costs</Link>
        <Link href="/order">Order inquiry</Link>
      </div>
    </footer>
  );
}
