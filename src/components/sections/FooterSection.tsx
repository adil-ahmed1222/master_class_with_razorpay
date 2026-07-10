import type { ReactNode } from "react";
import { ConversionSectionScrim } from "@/components/background/ConversionSectionScrim";
import { BrandWordmark, Container, Caption, EventPrice, EventTitle } from "@/components/ui";
import { FooterDemoLink } from "@/components/sections/FooterDemoLink";
import { event } from "@/content/event";
import { footer } from "@/content/footer";
import { cn } from "@/lib/utils";

const linkClass = cn(
  "font-sans text-body text-text-2 transition-opacity duration-200",
  "hover:text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
);

const emailLinkClass = cn(linkClass, "inline-block max-w-full break-all");

type FooterNavProps = {
  id: string;
  heading: string;
  children: ReactNode;
};

function FooterNav({ id, heading, children }: FooterNavProps) {
  return (
    <nav aria-labelledby={id}>
      <h3
        id={id}
        className="mb-4 font-sans text-overline uppercase tracking-[0.16em] text-text-2"
      >
        {heading}
      </h3>
      {children}
    </nav>
  );
}

/**
 * Footer — premium event closure after Final CTA (Phase 6.6).
 * Quiet visual weight; trust and wayfinding only — not a conversion block.
 */
export function FooterSection() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="relative z-20 overflow-hidden border-t border-white/8"
    >
      <ConversionSectionScrim topFade />
      <Container as="div" className="relative py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-8 md:gap-y-16 lg:gap-x-12">
          {/* Event identity — primary footer column */}
          <div className="md:col-span-5 lg:col-span-5">
            <div className="mb-1">
              <BrandWordmark variant="footer" />
            </div>
            <EventTitle size="footer" className="mt-3" />
            <ul className="mt-6 flex flex-col gap-2 font-sans text-body text-text-2">
              <li>{event.schedule.footerDate}</li>
              <li>{event.schedule.footerTime}</li>
              <li>{event.mode}</li>
              <li className="text-text">
                <EventPrice size="sm" />
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-6">
            <FooterNav id="footer-contact" heading={footer.contact.heading}>
              <ul className="flex flex-col gap-3">
                <li className="min-w-0">
                  <span className="sr-only">{footer.contact.label}</span>
                  <a href={footer.contact.href} className={emailLinkClass}>
                    {footer.contact.email}
                  </a>
                </li>
              </ul>
            </FooterNav>
          </div>

          {/* Quick links */}
          <div className="min-w-0 md:col-span-2 lg:col-span-2">
            <FooterNav id="footer-quick-links" heading={footer.quickLinks.heading}>
              <ul className="flex flex-col gap-3">
                {footer.quickLinks.items.map((item) =>
                  item.id === "demo" ? (
                    <li key={item.id}>
                      <FooterDemoLink label={item.label} />
                    </li>
                  ) : (
                    <li key={item.id}>
                      <a href={item.href} className={cn(linkClass, "inline-block")}>
                        {item.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </FooterNav>
          </div>

          {/* Legal */}
          <div className="min-w-0 md:col-span-2 lg:col-span-2">
            <FooterNav id="footer-legal" heading={footer.legal.heading}>
              <ul className="flex flex-col gap-3">
                {footer.legal.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className={cn(
                        linkClass,
                        "inline-block",
                        item.href === "#" && "pointer-events-none opacity-50",
                      )}
                      aria-disabled={item.href === "#" ? true : undefined}
                      tabIndex={item.href === "#" ? -1 : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterNav>
          </div>
        </div>

        <div className="mt-14 border-t border-white/8 pt-8 md:mt-16">
          <Caption as="p" className="text-center text-text-2 md:text-left">
            {footer.copyright}
          </Caption>
        </div>
      </Container>
    </footer>
  );
}
