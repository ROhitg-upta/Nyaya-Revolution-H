import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { testimonials } from "@/constants/landing";
import { Quote } from "@/lib/icons";

export function TestimonialsSection() {
  return (
    <Section muted>
      <SectionHeading
        eyebrow="Voices"
        title="Loved by people learning their rights"
        description="How a situation-first approach helps everyday citizens feel prepared."
      />

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal
            key={testimonial.name}
            delay={index * 0.08}
            className="h-full"
          >
            <figure className="glass glow-hover flex h-full flex-col gap-5 rounded-2xl p-6 hover:-translate-y-1">
              <Quote className="text-brand/50 size-8" aria-hidden="true" />
              <blockquote className="text-foreground flex-1 text-[0.95rem] leading-relaxed">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar className="ring-brand/20 ring-1">
                  <AvatarFallback className="bg-brand/15 text-brand text-xs font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-foreground text-sm font-semibold">
                    {testimonial.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </span>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="text-muted-foreground/60 mt-10 text-center text-xs">
        * Illustrative demo testimonials — not real users.
      </p>
    </Section>
  );
}
