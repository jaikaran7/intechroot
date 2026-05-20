import Card from "../../../components/Card";
import { FEATURED_TESTIMONIAL } from "../../../constants/testimonials";
import { TRUSTED_CLIENTS_COMPACT } from "../../../constants/trustedClients";

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-[#7c3aed] text-lg leading-none"
          style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { name, company, quote } = FEATURED_TESTIMONIAL;

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 grid grid-cols-2 gap-8 opacity-40 grayscale group">
            {TRUSTED_CLIENTS_COMPACT.map((clientName) => (
              <div
                key={clientName}
                className="h-24 bg-surface-container-high rounded-xl flex items-center justify-center p-6 hover:grayscale-0 transition-all duration-500 hover:opacity-100"
              >
                <span className="font-black text-primary/40 tracking-tighter text-lg sm:text-xl text-center leading-tight">
                  {clientName}
                </span>
              </div>
            ))}
          </div>
          <div className="lg:w-1/2 w-full">
            <Card className="glass-card p-8 sm:p-10 rounded-2xl relative">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-12 h-12 shrink-0 rounded-full bg-surface-container-high border border-outline-variant/25 flex items-center justify-center"
                  aria-hidden
                >
                  <span className="material-symbols-outlined text-2xl text-on-primary-container/35">person</span>
                </div>
                <div className="min-w-0">
                  <div className="text-base font-headline font-bold text-primary">{name}</div>
                  {company ? (
                    <div className="text-xs text-on-primary-container">{company}</div>
                  ) : null}
                </div>
              </div>
              <p className="text-sm font-body font-normal leading-relaxed text-on-primary-container/90 mb-6">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="pt-5 border-t border-outline-variant/20">
                <StarRating count={FEATURED_TESTIMONIAL.rating} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
