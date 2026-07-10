import { Body, Eyebrow, Headline } from "@/components/ui";
import { promoVideo } from "@/content/promo-video";
import { cn } from "@/lib/utils";

type MasterclassPromoVideoPlaceholderProps = {
  className?: string;
};

/**
 * 9:16 portrait promo slot — embedded YouTube Short (CLS-safe, lazy-loaded).
 */
export function MasterclassPromoVideoPlaceholder({
  className,
}: MasterclassPromoVideoPlaceholderProps) {
  return (
    <figure
      id="promo-video"
      className={cn("mx-auto w-full max-w-4xl scroll-mt-[var(--nav-h)]", className)}
    >
      <figcaption className="mb-4 max-w-2xl">
        <Eyebrow tone="accent" withRule>
          {promoVideo.eyebrow}
        </Eyebrow>
        <Headline as="p" size="h2" className="mt-3 text-balance">
          {promoVideo.title}
        </Headline>
        <Body size="lg" className="mt-2 text-pretty text-text-2">
          {promoVideo.caption}
        </Body>
      </figcaption>

      <div className="flex justify-center">
        <div
          className={cn(
            "relative aspect-[9/16] w-full max-w-[min(100%,20rem)] overflow-hidden rounded-lg border border-white/10 bg-surface",
            "shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]",
          )}
        >
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={promoVideo.embedSrc}
            title={promoVideo.iframeTitle}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </figure>
  );
}
