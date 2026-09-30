"use client";

import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Section } from "@/components/landing/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const REAL_FAQS = [
  {
    question: "Is Nyaya Revolution a substitute for a lawyer or advocate?",
    answer:
      "No. Nyaya Revolution is an educational legal awareness and citizen case preparation platform. It helps you understand statutory rights, critical filing windows, and official complaint procedures. For specific court representation or personalized legal advice, you should always consult a licensed advocate or visit your local District Legal Services Authority (DLSA).",
  },
  {
    question: "How does the Grounded Nyaya AI Companion work?",
    answer:
      "Nyaya AI is grounded directly in Indian statutes — including the Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Consumer Protection Act 2019, and landmark Supreme Court rulings. It provides plain-language explanations with statutory section references, avoiding synthetic hallucinations.",
  },
  {
    question: "Is the platform free for Indian citizens?",
    answer:
      "Yes. All educational situations, learning journeys, interactive scenario simulations, quizzes, certificates, and the verified legal services directory are completely free for all citizens.",
  },
  {
    question: "How does Nyaya Revolution protect my privacy and case details?",
    answer:
      "We practice strict privacy-by-design. Your case preparation workspaces and private binders are locked to your authenticated account with Row-Level Security (RLS) and never indexed in public search. When sharing with legal aid clinics, you can generate temporary, 60-minute expiring tokens.",
  },
  {
    question: "Can I use Nyaya Revolution in Hindi or other regional languages?",
    answer:
      "Yes. The Action Center supports multilingual voice triage and bilingual case prep generation in Hindi and English. We also normalize everyday Hinglish search queries across the entire platform.",
  },
  {
    question: "What is a District Legal Services Authority (DLSA) and how can Nyaya help me contact them?",
    answer:
      "Under the Legal Services Authorities Act, 1987, every district in India has a DLSA offering free legal assistance, legal aid counsel, and Lok Adalat conciliation to eligible citizens (including women, children, workers, and undertrials). Our Action Center includes a verified geo-locator for DLSAs across all 36 States and UTs.",
  },
];

export function FaqSection() {
  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="Frequently asked questions"
        title="Clear Answers About Nyaya Revolution"
        description="Everything you need to know about our legal awareness tools, AI grounding, privacy guarantees, and free access."
      />

      <Reveal className="mx-auto mt-14 max-w-3xl">
        <Accordion
          multiple={false}
          className="glass-strong w-full rounded-3xl px-6 py-2 sm:px-8"
        >
          {REAL_FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={String(index)}>
              <AccordionTrigger className="py-5 text-sm font-semibold sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}
