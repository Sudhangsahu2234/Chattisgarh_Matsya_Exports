"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/fish", label: "Fish Catalog" },
  { href: "/export-guide", label: "Export Guide" },
  { href: "/licenses", label: "Licenses" },
  { href: "/cg-fisheries", label: "CG Fisheries" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-mark">मत्स्य</span>
        <span>
          <strong>CG Matsya Exports</strong>
          <small>Chhattisgarh fish export desk</small>
        </span>
      </Link>

      <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span />
        <span />
        <span />
      </button>

      <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/order" className="order-link" onClick={() => setOpen(false)}>
          Order Inquiry
          {itemCount > 0 ? <span>{itemCount}</span> : null}
        </Link>
      </nav>
    </header>
  );
}
