/**
 * Searchable Indian Legal Glossary dataset.
 *
 * CRITICAL CONTENT INTEGRITY:
 * - All definitions reflect verified procedural and substantive Indian law
 *   (CrPC / BNSS, IPC / BNS, CPC, CPA 2019, IT Act, Constitution of India).
 * - Explanations are drafted in clear, plain language for ordinary citizens
 *   alongside formal legal references.
 */
import type { GlossaryTerm } from "@/types";

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "zero-fir",
    term: "Zero FIR",
    category: "criminal",
    simpleExplanation:
      "An FIR that can be registered at ANY police station in India, regardless of where the incident happened. The station assigns it number '0' and must immediately transfer it to the police station having territorial jurisdiction.",
    detailedExplanation:
      "Introduced following the Justice J.S. Verma Committee recommendations (2013). Prevents police from delaying investigation of serious crimes by claiming 'this area does not fall under our jurisdiction'. Now codified in Section 173(1) of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.",
    example:
      "If a woman is assaulted while travelling on an interstate train, she can lodge an FIR at the nearest station where she disembarks. The police cannot refuse registration by asking her to go back to the transit town.",
    relatedConcepts: ["FIR", "Cognizable Offence", "Territorial Jurisdiction"],
    relatedLaws: ["BNSS 2023 Section 173", "CrPC Section 154"],
    relatedSituations: ["facing-harassment", "police-complaint-fir", "domestic-abuse-awareness"],
    source: {
      title: "Ministry of Home Affairs Advisory on Zero FIR",
      publisher: "Ministry of Home Affairs, Government of India",
      citation: "MHA Advisory No. 15011/35/2013-SC/ST-W",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "cognizable-offence",
    term: "Cognizable Offence",
    category: "criminal",
    simpleExplanation:
      "A serious crime in which a police officer has the legal authority to arrest the accused WITHOUT an arrest warrant from a Magistrate, and is duty-bound to register an FIR immediately.",
    detailedExplanation:
      "Defined under Section 2(c) of CrPC / Section 2(1)(g) of BNSS 2023. Typically includes offences punishable with imprisonment of 3 years or more, such as theft, robbery, rape, murder, cyber impersonation causing financial loss, and severe domestic abuse.",
    example:
      "If someone steals your vehicle or snatches your bag, this is a cognizable offence. Police must register an FIR upon your complaint and begin investigation without waiting for court directions.",
    relatedConcepts: ["Non-Cognizable Offence", "FIR", "Arrest Warrant"],
    relatedLaws: ["BNSS 2023 Section 2(1)(g)", "CrPC Section 2(c)"],
    relatedSituations: ["scammed-online", "upi-fraud", "facing-harassment"],
    source: {
      title: "Code of Criminal Procedure / BNSS 2023",
      publisher: "India Code, Ministry of Law and Justice",
      citation: "Schedule I, BNSS 2023",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "non-cognizable-offence",
    term: "Non-Cognizable Offence",
    category: "criminal",
    simpleExplanation:
      "A relatively minor offence where police CANNOT arrest without a magistrate's warrant and cannot start a criminal investigation without magistrate authorization. The police record an NCR (Non-Cognizable Report) instead of an FIR.",
    detailedExplanation:
      "Defined under Section 2(l) of CrPC / Section 2(1)(o) of BNSS 2023. Includes minor scuffles, simple hurt without weapons, public nuisance, and civil cheating without element of forgery. The complainant must approach the Magistrate's court to obtain an order directing police investigation under Section 174(2) of BNSS.",
    example:
      "If someone uses foul language in an argument without physical threat or property damage, police record an NCR in their station diary and advise the complainant to petition the magistrate.",
    relatedConcepts: ["Cognizable Offence", "NCR", "Magistrate Warrant"],
    relatedLaws: ["BNSS 2023 Section 174", "CrPC Section 155"],
    relatedSituations: ["traffic-stop-challan", "family-domestic-dispute"],
    source: {
      title: "India Code — Criminal Procedure",
      publisher: "Ministry of Law and Justice",
      citation: "BNSS 2023 Section 2(1)(o)",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "anticipatory-bail",
    term: "Anticipatory Bail",
    category: "criminal",
    simpleExplanation:
      "A pre-arrest court order protecting a person from being jailed if they have reasonable grounds to believe that they may be falsely arrested on an accusation of having committed a non-bailable offence.",
    detailedExplanation:
      "Available under Section 438 of CrPC / Section 482 of BNSS 2023. Granted by the Sessions Court or the High Court. If granted, upon arrest by police, the person is entitled to immediate release on bail subject to conditions (e.g. cooperating with interrogation and not tampering with witnesses).",
    example:
      "A professional facing retaliatory criminal allegations from a disgruntled business partner can approach the Sessions Court for anticipatory bail to prevent arbitrary arrest while the inquiry takes place.",
    relatedConcepts: ["Regular Bail", "Arrest Warrant", "Interim Protection"],
    relatedLaws: ["BNSS 2023 Section 482", "CrPC Section 438"],
    relatedSituations: ["workplace-contract-dispute", "family-domestic-dispute"],
    source: {
      title: "Code of Criminal Procedure / BNSS",
      publisher: "India Code",
      citation: "CrPC Sec 438 / BNSS Sec 482",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "deficiency-in-service",
    term: "Deficiency in Service",
    category: "consumer",
    simpleExplanation:
      "Any fault, imperfection, shortcoming, or inadequacy in the quality, nature, and manner of performance of a service that is required to be maintained under contract or law.",
    detailedExplanation:
      "Defined under Section 2(11) of the Consumer Protection Act, 2019. Covers banking, telecom, courier, transport, medical care, hospitality, and e-commerce delivery failures. Consumers can claim full refunds plus compensation for mental harassment in Consumer Commissions.",
    example:
      "An airline cancels your flight without prior notice and refuses hotel accommodation or timely alternative booking. This constitutes deficiency in service under CPA 2019.",
    relatedConcepts: ["Unfair Trade Practice", "Product Liability", "Consumer Commission"],
    relatedLaws: ["Consumer Protection Act 2019 Section 2(11)"],
    relatedSituations: ["product-not-delivered", "refund-denied", "defective-product"],
    source: {
      title: "Consumer Protection Act, 2019",
      publisher: "Ministry of Consumer Affairs, India Code",
      citation: "Act No. 35 of 2019, Section 2(11)",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "unfair-trade-practice",
    term: "Unfair Trade Practice",
    category: "consumer",
    simpleExplanation:
      "A deceptive or fraudulent business practice used by sellers to promote sales — such as false discounts, misleading advertisements, refusing cash memo receipts, or fake warranty claims.",
    detailedExplanation:
      "Defined under Section 2(47) of the Consumer Protection Act, 2019. Includes hoarding, falsely claiming that second-hand goods are brand new, publishing deceptive discount markups, refusing returns of defective goods, and unauthorized disclosure of customer personal information.",
    example:
      "An online store advertises a 50% discount on shoes, but actually hiked the base price by 50% one day prior, making the sale price the same as normal MRP. This is an unfair trade practice.",
    relatedConcepts: ["Deficiency in Service", "Misleading Advertisement", "CCPA"],
    relatedLaws: ["Consumer Protection Act 2019 Section 2(47)"],
    relatedSituations: ["misleading-advertisement", "online-shopping-scam", "defective-product"],
    source: {
      title: "Consumer Protection Act, 2019",
      publisher: "India Code",
      citation: "Act No. 35 of 2019, Section 2(47)",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "model-tenancy-act",
    term: "Model Tenancy Act (MTA)",
    category: "housing",
    simpleExplanation:
      "A model law circulated by the Central Government in 2021 for states to adopt, establishing clear rules for rental agreements: caps residential security deposits at a maximum of 2 months' rent and creates dedicated Rent Authorities for quick dispute resolution.",
    detailedExplanation:
      "Replaces antiquated state rent control acts. Mandates formal written agreements registered with a digital Rent Authority, limits landlord entry notice to 24 hours in writing, forbids withholding essential utility supplies (water, electricity), and sets a 30-day timeline for deposit refund post-vacation.",
    example:
      "In a state that adopted the MTA, your landlord cannot demand a 10-month rent deposit for a flat; the legal cap is strictly 2 months of monthly rent.",
    relatedConcepts: ["Security Deposit", "Rent Authority", "Eviction Notice"],
    relatedLaws: ["Model Tenancy Act 2021"],
    relatedSituations: ["landlord-withholding-deposit", "tenants-eviction-concern"],
    source: {
      title: "Model Tenancy Act, 2021",
      publisher: "Ministry of Housing and Urban Affairs, Government of India",
      citation: "MOHUA Gazette Notification 2021",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "internal-complaints-committee-icc",
    term: "Internal Committee (IC / ICC)",
    category: "labour",
    simpleExplanation:
      "A mandatory, independent workplace committee that every organization with 10 or more employees must maintain to receive, investigate, and resolve complaints of sexual harassment.",
    detailedExplanation:
      "Created under Section 4 of the POSH Act, 2013. The Presiding Officer must be a senior woman employed at the workplace, at least 50% of the members must be women, and at least one external member must be from an NGO or legal association committed to women's rights to prevent management bias.",
    example:
      "If a manager sends inappropriate late-night messages to a team member, she can lodge a confidential written complaint directly with the Internal Committee without fear of termination.",
    relatedConcepts: ["POSH Act", "Local Complaints Committee", "Vishaka Guidelines"],
    relatedLaws: ["POSH Act 2013 Section 4"],
    relatedSituations: ["facing-harassment", "workplace-harassment"],
    source: {
      title: "Handbook on POSH Act, 2013",
      publisher: "Ministry of Women and Child Development",
      citation: "Act No. 14 of 2013, Section 4",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "injunction",
    term: "Injunction",
    category: "civil",
    simpleExplanation:
      "A court order that either stops a party from doing a specific wrongful act (temporary/permanent injunction) or mandates them to restore something to its previous state (mandatory injunction).",
    detailedExplanation:
      "Governed by the Specific Relief Act, 1963 and Order 39 of the Code of Civil Procedure (CPC). To grant an interim injunction, courts examine three factors: (1) Prima facie case in favour of the plaintiff, (2) Balance of convenience, and (3) Irreparable injury that cannot be compensated with money.",
    example:
      "If a builder attempts to demolish a boundary wall of your rented house while your lease is active, your lawyer can seek an immediate status quo temporary injunction from the civil court.",
    relatedConcepts: ["Stay Order", "Status Quo", "Specific Relief"],
    relatedLaws: ["Specific Relief Act 1963", "CPC Order 39"],
    relatedSituations: ["landlord-withholding-deposit", "tenants-eviction-concern"],
    source: {
      title: "Specific Relief Act, 1963 / CPC 1908",
      publisher: "India Code",
      citation: "Act No. 47 of 1963",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "lok-adalat",
    term: "Lok Adalat (People's Court)",
    category: "civil",
    simpleExplanation:
      "An alternative dispute resolution forum where pending cases or pre-litigation disputes are settled amicably without legal fees. An award passed by a Lok Adalat has the final status of a civil court decree, with NO appeal allowed.",
    detailedExplanation:
      "Statutory forum established under the Legal Services Authorities Act, 1987. Regular and National Lok Adalats handle traffic challans, cheque bounce cases, electricity bills, matrimonial settlements, and bank loan recoveries. If settled, the court fee paid in court is fully refunded.",
    example:
      "If you have an unpaid electricity bill dispute with the state power board, attending a National Lok Adalat allows you to negotiate a compromise settlement with interest waived, finalized on the spot.",
    relatedConcepts: ["Legal Services Authority", "Mediation", "Pre-litigation Settlement"],
    relatedLaws: ["Legal Services Authorities Act 1987 Section 19-21"],
    relatedSituations: ["traffic-challan-dispute", "family-domestic-dispute"],
    source: {
      title: "Legal Services Authorities Act, 1987",
      publisher: "National Legal Services Authority (NALSA)",
      url: "https://nalsa.gov.in",
      citation: "Act No. 39 of 1987",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "data-fiduciary",
    term: "Data Fiduciary",
    category: "privacy",
    simpleExplanation:
      "Any entity, company, or individual (like an app, bank, or university) that decides the purpose and means of collecting and processing your digital personal data.",
    detailedExplanation:
      "Defined under Section 2(i) of the Digital Personal Data Protection Act, 2023 (DPDPA). Data Fiduciaries must give clear notice, implement reasonable security safeguards to prevent data breaches, and delete personal data when the processing purpose is fulfilled.",
    example:
      "When you sign up for a food delivery app, that company acts as a Data Fiduciary regarding your phone number, name, and delivery address.",
    relatedConcepts: ["Data Principal", "Consent", "DPDP Act"],
    relatedLaws: ["DPDP Act 2023 Section 2(i)"],
    relatedSituations: ["data-misuse-privacy", "unauthorized-sharing-data"],
    source: {
      title: "Digital Personal Data Protection Act, 2023",
      publisher: "Ministry of Electronics and IT",
      citation: "Act No. 22 of 2023, Section 2(i)",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "good-samaritan",
    term: "Good Samaritan",
    category: "traffic",
    simpleExplanation:
      "A person who voluntarily helps a road accident victim in good faith. Under Indian law, Good Samaritans CANNOT be harassed by police, forced to pay hospital admissions, or compelled to reveal their identity.",
    detailedExplanation:
      "Codified in Section 134A of the Motor Vehicles Act (amended in 2019) pursuant to the Supreme Court judgment in SaveLIFE Foundation v. Union of India. Good Samaritans are protected from both civil and criminal liability for any accidental injury resulting from assistance rendered in emergency.",
    example:
      "You take an injured motorcyclist to the nearest trauma hospital in an auto-rickshaw. The hospital and police cannot detain you or demand you register as a witness if you choose not to.",
    relatedConcepts: ["Golden Hour", "Motor Vehicles Act", "Emergency Medical Care"],
    relatedLaws: ["Motor Vehicles Act 1988 Section 134A"],
    relatedSituations: ["road-accident-rights", "traffic-stop-challan"],
    source: {
      title: "Motor Vehicles (Amendment) Act, 2019",
      publisher: "Ministry of Road Transport and Highways",
      citation: "Section 134A, Act No. 32 of 2019",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}
