/**
 * Landmark Verified Indian Case Studies dataset.
 *
 * CRITICAL CONTENT INTEGRITY:
 * - All cases are verifiable judgments of the Supreme Court of India.
 * - Bench details, official citations, and ratio decidendi are based strictly
 *   on reported judgments in the Supreme Court Reports (SCR) and SCC.
 * - No fictitious parties, hypothetical courts, or fabricated outcomes.
 */
import type { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "puttaswamy-v-union-of-india-2017",
    title: "Justice K.S. Puttaswamy (Retd.) v. Union of India",
    citation: "(2017) 10 SCC 1",
    court: "Supreme Court of India",
    year: 2017,
    bench: "9-Judge Constitutional Bench",
    legalArea: "privacy",
    context:
      "A 91-year-old retired High Court judge, Justice K.S. Puttaswamy, challenged the constitutional validity of the Aadhaar biometric identity scheme, arguing that collecting biometric data without a statutory privacy framework infringed on citizen autonomy.",
    problem:
      "Earlier judgments (M.P. Sharma in 1954 and Kharak Singh in 1962) suggested that the Indian Constitution did not explicitly guarantee a fundamental right to privacy.",
    legalQuestion:
      "Is there a fundamental right to privacy recognized under Part III of the Constitution of India, specifically emanating from Article 21?",
    relevantConcept:
      "Informational privacy, bodily autonomy, right against arbitrary surveillance, and the proportionality standard for state interference.",
    verifiedOutcome:
      "A unanimous 9-judge bench overruled prior doubts, holding that privacy is a fundamental right intrinsic to life and personal liberty under Article 21. Any state restriction on privacy must satisfy a 3-fold test: (1) Legitimate law, (2) Legitimate state aim, and (3) Proportionality.",
    whyItMatters:
      "Transformed Indian constitutional jurisprudence by protecting personal data, digital communications, sexual orientation, and bodily choices from arbitrary state intrusion.",
    citizenLearning: [
      "Your personal data, health records, location, and communications are protected by the Constitution.",
      "The government or private companies cannot force arbitrary biometric or data disclosures without legal authority.",
      "Any government data collection must pass the proportionality test (minimal necessary intrusion).",
    ],
    relatedSituations: [
      "data-misuse-privacy",
      "unauthorized-sharing-data",
      "account-privacy-concern",
      "scammed-online",
    ],
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty"],
    relatedLessons: [
      {
        journeySlug: "digital-privacy",
        lessonSlug: "constitutional-right-to-privacy",
      },
      {
        journeySlug: "constitution-basics",
        lessonSlug: "fundamental-rights-overview",
      },
    ],
    source: {
      title: "Supreme Court Judgment: Justice K.S. Puttaswamy v. Union of India",
      publisher: "Supreme Court of India",
      url: "https://main.sci.gov.in/judgments",
      citation: "Writ Petition (Civil) No. 494 of 2012; (2017) 10 SCC 1",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "dk-basu-v-state-of-wb-1997",
    title: "D.K. Basu v. State of West Bengal",
    citation: "(1997) 1 SCC 416",
    court: "Supreme Court of India",
    year: 1997,
    bench: "2-Judge Bench (Dr. A.S. Anand & K.T. Thomas, JJ.)",
    legalArea: "criminal",
    context:
      "Executive Chairman of Legal Aid Services West Bengal addressed a letter to the Chief Justice drawing attention to increasing deaths and torture in police custody.",
    problem:
      "Police officers frequently abused custody, denied detentions, and tortured undertrials without logging arrest memos or allowing legal contact.",
    legalQuestion:
      "What mandatory guidelines and safeguards must police follow to prevent custodial violence and protect arrested persons under Articles 21 and 22(1)?",
    relevantConcept:
      "Procedural due process, custodial rights, mandatory arrest memos, and judicial accountability for police misconduct.",
    verifiedOutcome:
      "The Supreme Court formulated 11 mandatory guidelines (now largely codified in Section 41A–41D and Section 50 of CrPC / Sections 35–47 of BNSS 2023). Every arresting officer must wear clear identification badges, prepare a signed arrest memo with a witness, inform a relative within 8–12 hours, record medical examinations upon request, and permit legal consultation.",
    whyItMatters:
      "Every single police arrest in India must adhere to these guidelines; failure makes the officer liable for departmental punishment and contempt of court.",
    citizenLearning: [
      "You have the right to see the arresting officer's name badge and designation.",
      "An arrest memo stating date, time, and reason must be signed by at least one witness.",
      "A relative or friend of your choice must be notified by police within hours of arrest.",
      "You have the right to request a medical examination at the time of arrest to document your physical condition.",
    ],
    relatedSituations: [
      "police-complaint-fir",
      "traffic-stop-challan",
      "domestic-abuse-awareness",
    ],
    relatedArticles: [
      "article-21-protection-of-life-and-personal-liberty",
      "article-22-protection-against-arrest-and-detention",
    ],
    relatedLessons: [
      {
        journeySlug: "police-fir-process",
        lessonSlug: "rights-during-arrest",
      },
    ],
    source: {
      title: "Supreme Court Judgment: D.K. Basu v. State of West Bengal",
      publisher: "Supreme Court of India",
      url: "https://main.sci.gov.in/judgments",
      citation: "Writ Petition (Crl.) No. 592 of 1987; (1997) 1 SCC 416",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "vishaka-v-state-of-rajasthan-1997",
    title: "Vishaka and Others v. State of Rajasthan",
    citation: "(1997) 6 SCC 241",
    court: "Supreme Court of India",
    year: 1997,
    bench: "3-Judge Bench (J.S. Verma CJI, Sujata V. Manohar & B.N. Kirpal, JJ.)",
    legalArea: "labour",
    context:
      "Bhanwari Devi, a social worker in Rajasthan, was gang-raped by upper-caste men in retaliation for her efforts to stop child marriage. The trial court acquitted the accused, triggering massive public outrage.",
    problem:
      "India had no statute addressing sexual harassment at the workplace, leaving working women unprotected under civil and labour law.",
    legalQuestion:
      "Does the absence of domestic legislation prevent the Supreme Court from formulating binding guidelines under Articles 14, 19, and 21, read with international conventions like CEDAW?",
    relevantConcept:
      "Gender equality at the workplace, safe working conditions as a fundamental right, and judicial gap-filling through constitutional directives.",
    verifiedOutcome:
      "The Supreme Court laid down the famous 'Vishaka Guidelines', defining sexual harassment and obligating every employer to set up a complaints mechanism. This served as binding law until Parliament enacted the POSH Act in 2013.",
    whyItMatters:
      "Recognized that sexual harassment at work is a direct violation of women's fundamental rights to equality (Art 14), non-discrimination (Art 15), and life with dignity (Art 21).",
    citizenLearning: [
      "Workplace sexual harassment is not just a personal grievance — it is an actionable legal violation.",
      "Every employer must provide an accessible, confidential complaint and redressal mechanism.",
      "Women have the right to a harassment-free environment in public, private, and informal sectors.",
    ],
    relatedSituations: [
      "facing-harassment",
      "workplace-harassment",
      "workplace-discrimination",
    ],
    relatedArticles: [
      "article-14-equality-before-law",
      "article-21-protection-of-life-and-personal-liberty",
    ],
    relatedLessons: [
      {
        journeySlug: "womens-rights",
        lessonSlug: "workplace-safety-posh",
      },
      {
        journeySlug: "employment-rights",
        lessonSlug: "safe-working-environment",
      },
    ],
    source: {
      title: "Supreme Court Judgment: Vishaka v. State of Rajasthan",
      publisher: "Supreme Court of India",
      url: "https://main.sci.gov.in/judgments",
      citation: "Writ Petition (Crl.) Nos. 666-70 of 1992; (1997) 6 SCC 241",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "shreya-singhal-v-union-of-india-2015",
    title: "Shreya Singhal v. Union of India",
    citation: "(2015) 5 SCC 1",
    court: "Supreme Court of India",
    year: 2015,
    bench: "2-Judge Bench (J. Chelameswar & R.F. Nariman, JJ.)",
    legalArea: "cyber",
    context:
      "Two college girls in Mumbai were arrested by police under Section 66A of the IT Act merely for posting and 'liking' a comment on Facebook questioning a city shutdown. A law student, Shreya Singhal, filed a PIL challenging the section's constitutionality.",
    problem:
      "Section 66A punished sending 'grossly offensive' or 'annoying' online messages with up to 3 years imprisonment. Its vague wording was widely misused by police to arrest citizens for legitimate political or civic criticism.",
    legalQuestion:
      "Is Section 66A of the IT Act unconstitutionally vague and violative of the freedom of speech under Article 19(1)(a)?",
    relevantConcept:
      "Vagueness doctrine, overbreadth, chilling effect on digital speech, and distinction between advocacy vs incitement.",
    verifiedOutcome:
      "The Supreme Court struck down Section 66A in its entirety, ruling that its terms were open-ended and had an intolerable chilling effect on free speech. The Court held that speech can only be curtailed if it reaches the threshold of clear incitement.",
    whyItMatters:
      "Saved digital democracy in India by prohibiting police from arbitrarily arresting citizens for lawful online opinions, critical reviews, or social media commentary.",
    citizenLearning: [
      "Police cannot register an FIR under Section 66A of the IT Act — it has been declared null and void.",
      "Expressing political opinions or questioning public disruptions online is a protected constitutional right.",
      "If police threaten Section 66A, citizens and lawyers can immediately cite the Shreya Singhal judgment.",
    ],
    relatedSituations: [
      "social-media-impersonation",
      "cyber-harassment",
      "college-demanding-illegal-fees",
    ],
    relatedArticles: ["article-19-protection-of-certain-rights-regarding-freedom-of-speech"],
    relatedLessons: [
      {
        journeySlug: "cyber-safety",
        lessonSlug: "free-speech-vs-harassment",
      },
      {
        journeySlug: "constitution-basics",
        lessonSlug: "freedoms-under-article-19",
      },
    ],
    source: {
      title: "Supreme Court Judgment: Shreya Singhal v. Union of India",
      publisher: "Supreme Court of India",
      url: "https://main.sci.gov.in/judgments",
      citation: "Writ Petition (Criminal) No. 167 of 2012; (2015) 5 SCC 1",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
