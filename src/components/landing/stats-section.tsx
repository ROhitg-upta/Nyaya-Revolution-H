import { CountUp } from "@/components/common/count-up";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/landing/section";
import { stats } from "@/constants/landing";

export function StatsSection() {
  return (
    <Section className="py-16 sm:py-20">
      <Reveal>
        <dl className="glass-strong lg:divide-border/60 grid grid-cols-2 gap-y-10 rounded-3xl px-6 py-10 sm:px-10 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 px-4 text-center"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-gradient-brand text-4xl font-bold sm:text-5xl">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
              <p className="text-muted-foreground max-w-[15rem] text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </Reveal>
      <p className="text-muted-foreground/60 mt-8 text-center text-xs">
        * Illustrative demo figures for a pre-launch product.
      </p>
    </Section>
  );
}
