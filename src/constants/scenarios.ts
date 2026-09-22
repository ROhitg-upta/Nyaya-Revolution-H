/**
 * Interactive Scenario Simulations Dataset.
 *
 * Models multi-step, realistic legal dilemmas encountered by ordinary Indian citizens.
 * Each scenario tests decision-making with immediate feedback, risk ratings,
 * applicable statutory provisions, and branching pathways.
 *
 * CRITICAL INTEGRITY:
 * - Built strictly around verified Indian statutes (Model Tenancy Act, CrPC/BNSS,
 *   Consumer Protection Act 2019, IT Act 2000, POSH Act 2013).
 * - No fictitious legal procedures or speculative police rules.
 */
import type { ScenarioSimulation } from "@/types";

export const scenarioSimulations: ScenarioSimulation[] = [
  {
    id: "scen-pg-deposit",
    slug: "pg-deposit-refusal",
    title: "PG Landlord Refusing to Return Security Deposit",
    tagline: "Navigate illegal deductions and recover your hard-earned deposit legally.",
    category: "housing",
    difficulty: "beginner",
    estimatedMinutes: 5,
    context:
      "You are a student/young professional moving out of a rented PG in Bengaluru after completing your 11-month agreement. You gave a 30-day written notice as required. The landlord inspected the room, found no damage, but now claims: 'Company policy has changed. Deposits take 90 days, minus a 40% maintenance fee.'",
    initialStepId: "step-1",
    learningOutcomes: [
      "Understand Section 13 of the Model Tenancy Act refund timeline",
      "Draft a legally sound written demand notice before taking formal action",
      "Differentiate between civil recovery suits and Consumer Commission complaints",
    ],
    relatedLessonSlugs: ["know-your-campus-rights", "tenant-security-deposits"],
    relatedLawSlugs: ["model-tenancy-act-2021", "consumer-protection-act-2019"],
    relatedSituationSlugs: ["landlord-withholding-security-deposit"],
    source: {
      title: "Model Tenancy Act, 2021 — Ministry of Housing and Urban Affairs",
      url: "https://mohua.gov.in/",
      publisher: "Government of India",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    steps: {
      "step-1": {
        id: "step-1",
        prompt: "What is your immediate first step when the landlord informs you of this deduction?",
        options: [
          {
            id: "opt-1a",
            label: "Create a commotion at the PG gate and refuse to hand over the keys.",
            evaluation: "dangerous",
            feedback:
              "Creating a ruckus or withholding keys can lead to trespassing or criminal intimidation claims (BNS/IPC) against you, giving the landlord legal leverage to forfeit your deposit.",
            legalConcept: "Civil vs Criminal Conduct",
            statutorySection: "Indian Penal Code / Bharatiya Nyaya Sanhita",
            points: 0,
            nextStepId: "step-2-confront",
          },
          {
            id: "opt-1b",
            label: "Ask for an itemised bill of deductions in writing, citing your signed agreement and 30-day notice receipt.",
            evaluation: "optimal",
            feedback:
              "Under contract law and tenancy norms, arbitrary deductions cannot be made without proof of damage or written agreement terms. Documenting everything in writing is crucial evidence.",
            legalConcept: "Documentary Evidence in Contractual Disputes",
            statutorySection: "Indian Contract Act, 1872 (Section 73)",
            points: 25,
            nextStepId: "step-2-negotiate",
          },
          {
            id: "opt-1c",
            label: "Accept whatever deduction they offer and leave quietly to avoid conflict.",
            evaluation: "risky",
            feedback:
              "Accepting unilateral changes without protest waives your statutory rights and establishes an implied consent to unfair commercial practices.",
            legalConcept: "Waiver of Statutory Rights",
            points: 5,
            nextStepId: "step-2-negotiate",
          },
        ],
      },
      "step-2-negotiate": {
        id: "step-2-negotiate",
        situationUpdate:
          "The landlord refuses to provide an itemised receipt, ignores your emails, and stops taking your phone calls after you vacate.",
        prompt: "Seven days have passed since you vacated. What should your formal next step be?",
        options: [
          {
            id: "opt-2a",
            label: "Send a formal Legal Demand Notice via Registered Post AD and Email giving 15 days to refund.",
            evaluation: "optimal",
            feedback:
              "A formal demand notice via Registered Post AD creates verifiable legal proof of default. It is the necessary prerequisite before approaching the Rent Authority, Consumer Commission, or filing for summary recovery.",
            legalConcept: "Pre-Litigation Statutory Demand",
            statutorySection: "Model Tenancy Act 2021 / Consumer Protection Act 2019",
            points: 25,
            nextStepId: "step-3-legal",
          },
          {
            id: "opt-2b",
            label: "Post abusive reviews and the landlord's personal phone number on public social media forums.",
            evaluation: "dangerous",
            feedback:
              "Doxxing or defamatory posts can expose you to criminal defamation under Section 499 IPC / Section 356 BNS and violations of the Information Technology Act Section 66E (privacy violation).",
            legalConcept: "Defamation and Cyber Privacy Violations",
            statutorySection: "IT Act 2000 & BNS 2023",
            points: 0,
            nextStepId: "step-3-legal",
          },
          {
            id: "opt-2c",
            label: "File an FIR at the local police station for criminal theft of money.",
            evaluation: "acceptable",
            feedback:
              "Police usually treat security deposit disputes as a 'civil breach of contract' and issue a Non-Cognizable Report (NCR). However, a police station visit may facilitate an informal mediation if there was fraudulent inducement.",
            legalConcept: "Civil Breach vs Criminal Breach of Trust",
            statutorySection: "Section 405/406 IPC (Criminal Breach of Trust)",
            points: 15,
            nextStepId: "step-3-legal",
          },
        ],
      },
      "step-2-confront": {
        id: "step-2-confront",
        situationUpdate:
          "Because of the heated confrontation, the landlord has locked your luggage inside the room.",
        prompt: "Your belongings are now illegally locked inside the premises. How do you respond?",
        options: [
          {
            id: "opt-2ca",
            label: "Break open the door lock yourself to retrieve your luggage.",
            evaluation: "dangerous",
            feedback:
              "Breaking the lock constitutes housebreaking and criminal trespass. You must not take law into your own hands.",
            legalConcept: "Criminal Trespass",
            statutorySection: "Section 448 IPC",
            points: 0,
            nextStepId: "step-3-legal",
          },
          {
            id: "opt-2cb",
            label: "Call 112 (Police Emergency) immediately and request assistance to retrieve personal belongings without breach of peace.",
            evaluation: "optimal",
            feedback:
              "Police have the duty to prevent breach of peace and ensure you are not illegally dispossessed of your personal belongings without due process of law.",
            legalConcept: "Police Assistance in Wrongful Dispossession",
            statutorySection: "Police Act & CrPC Section 149",
            points: 25,
            nextStepId: "step-3-legal",
          },
        ],
      },
      "step-3-legal": {
        id: "step-3-legal",
        situationUpdate:
          "The 15-day notice period has expired with no response from the landlord. You have the signed agreement, bank transfer proofs, moving out emails, and the speed post tracking acknowledgment.",
        prompt: "Which legal forum offers the most cost-effective and accessible recourse for a student/tenant?",
        options: [
          {
            id: "opt-3a",
            label: "File a complaint before the District Consumer Disputes Redressal Commission for 'Deficiency in Service' or approach the Rent Authority.",
            evaluation: "optimal",
            feedback:
              "Commercial PG accommodations are recognized as commercial service providers under the Consumer Protection Act 2019. You can file online via e-Daakhil without hiring an expensive advocate!",
            legalConcept: "Consumer Redressal via e-Daakhil Portal",
            statutorySection: "Consumer Protection Act 2019 (Section 35)",
            points: 25,
            nextStepId: null, // Terminal
          },
          {
            id: "opt-3b",
            label: "Approach the High Court directly by filing a writ petition under Article 226.",
            evaluation: "risky",
            feedback:
              "Writ petitions under Article 226 are meant for enforcement of fundamental rights against State authorities, not private contract disputes with landlords where alternative statutory remedies exist.",
            legalConcept: "Maintainability of Writ Petitions against Private Parties",
            statutorySection: "Constitution of India Article 226",
            points: 10,
            nextStepId: null, // Terminal
          },
        ],
      },
    },
  },
  {
    id: "scen-police-stop",
    slug: "police-stop-warrantless-search",
    title: "Police Night Check & Warrantless Phone Search",
    tagline: "Know your constitutional rights when stopped by law enforcement at night.",
    category: "citizen",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    context:
      "You are riding home on your two-wheeler after work at 11:30 PM in an Indian metro city. Police personnel at a vehicle checkpoint signal you to pull over. You cooperate and produce your Driving License, RC, and Insurance on the mParivahan app. An officer suddenly demands: 'Hand over your phone, unlock it, and open your WhatsApp chats.'",
    initialStepId: "step-1",
    learningOutcomes: [
      "Understand Article 21 Fundamental Right to Privacy (*Puttaswamy judgment*)",
      "Recognize the scope of statutory search powers under CrPC/BNSS",
      "Politely assert constitutional protections without escalating hostility",
    ],
    relatedLessonSlugs: ["know-your-campus-rights"],
    relatedLawSlugs: ["article-21-protection-of-life-and-personal-liberty"],
    relatedSituationSlugs: ["police-harassment-or-unlawful-detention"],
    source: {
      title: "Supreme Court of India: Justice K.S. Puttaswamy (2017) 10 SCC 1",
      url: "https://main.sci.gov.in/",
      publisher: "Supreme Court of India",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    steps: {
      "step-1": {
        id: "step-1",
        prompt: "Do police officers have the legal authority to arbitrarily unlock and browse your private phone during a routine traffic stop?",
        options: [
          {
            id: "opt-1a",
            label: "Yes, police have unchecked authority to search any device during night checks.",
            evaluation: "dangerous",
            feedback:
              "Incorrect. Under Indian law, police officers CANNOT arbitrarily search personal electronic devices during a routine traffic stop without a valid warrant, formal FIR, or reasonable suspicion of a cognizable offence.",
            legalConcept: "Right to Privacy & Protection against Arbitrary Search",
            statutorySection: "Article 21 Constitution & CrPC Section 100/165",
            points: 0,
            nextStepId: "step-2",
          },
          {
            id: "opt-1b",
            label: "No. Politely ask the officer under which provision of law or case investigation the device is being demanded.",
            evaluation: "optimal",
            feedback:
              "In *Puttaswamy (2017)*, a 9-judge bench affirmed that digital privacy is protected under Article 21. Unless you are named in an FIR or under arrest with formal seizure memos, random phone searches are unauthorized.",
            legalConcept: "Right to Digital Privacy",
            statutorySection: "Article 21 & Supreme Court Guidelines",
            points: 25,
            nextStepId: "step-2",
          },
        ],
      },
      "step-2": {
        id: "step-2",
        situationUpdate:
          "The officer insists: 'If you have nothing to hide, why are you hesitating? Comply or I will take you to the police station.'",
        prompt: "How should you de-escalate while standing firm on your rights?",
        options: [
          {
            id: "opt-2a",
            label: "Remain calm, state politely that your phone contains confidential personal and banking data, and ask to speak with the senior officer/Inspector in charge of the checkpoint.",
            evaluation: "optimal",
            feedback:
              "Remaining calm and requesting to speak to the Supervisory Officer (Sub-Inspector or Inspector) often resolves misbehavior, as senior officers are aware of department circulars prohibiting warrantless phone checks.",
            legalConcept: "Hierarchy of Police Accountability",
            points: 25,
            nextStepId: "step-3",
          },
          {
            id: "opt-2b",
            label: "Start shouting at the officers, threaten them with political connections, and try to ride away.",
            evaluation: "dangerous",
            feedback:
              "Fleeing a checkpoint or using aggressive language can lead to serious criminal charges such as Section 353 IPC (obstructing public servant from discharge of duty) and reckless driving.",
            legalConcept: "Obstructing a Public Servant",
            statutorySection: "Section 353 IPC / Section 121 BNS",
            points: 0,
            nextStepId: "step-3",
          },
        ],
      },
      "step-3": {
        id: "step-3",
        situationUpdate:
          "The senior officer arrives and acknowledges your documents are valid. However, suppose an officer does seize your phone forcefully.",
        prompt: "If electronic evidence or a device is seized by police, what document MUST they provide you immediately?",
        options: [
          {
            id: "opt-3a",
            label: "A Seizure Memo (Panchnama) signed by independent witnesses detailing the device make, IMEI, and state.",
            evaluation: "optimal",
            feedback:
              "Under CrPC Section 100 / BNSS Section 105, any seizure without a proper Seizure Memo and independent witnesses is illegal. You have the right to receive a copy of this memo on the spot.",
            legalConcept: "Mandatory Seizure Memo & Hash Value Integrity",
            statutorySection: "CrPC Section 100(5) / BNSS Section 105",
            points: 25,
            nextStepId: null,
          },
          {
            id: "opt-3b",
            label: "A verbal assurance that you can collect it from the station tomorrow morning.",
            evaluation: "dangerous",
            feedback:
              "Never leave a device in police possession without an official Seizure Memo. Without it, there is no official record of who holds your device or whether evidence was tampered with.",
            legalConcept: "Chain of Custody",
            points: 0,
            nextStepId: null,
          },
        ],
      },
    },
  },
  {
    id: "scen-unauthorized-upi",
    slug: "unauthorized-upi-cyber-fraud",
    title: "Unauthorized UPI Debit & Online Phishing Scam",
    tagline: "Act within the golden hour to secure Zero Liability under RBI guidelines.",
    category: "cyber",
    difficulty: "beginner",
    estimatedMinutes: 5,
    context:
      "At 4:00 PM on a Saturday, your phone buzzes with three SMS alerts: '₹15,000 debited via UPI to merchant XYZ', '₹25,000 debited', and '₹10,000 debited'. You did not authorize these transactions, did not share your OTP, and have your phone and debit card in your possession.",
    initialStepId: "step-1",
    learningOutcomes: [
      "Understand RBI's Zero Liability Policy for unauthorized electronic banking transactions",
      "Action the 3-day notification deadline for 100% financial recovery",
      "Report fraud to 1930 and the National Cyber Crime Reporting Portal",
    ],
    relatedLessonSlugs: ["cyber-safety"],
    relatedLawSlugs: ["it-act-2000"],
    relatedSituationSlugs: ["online-financial-fraud-or-upi-scam"],
    source: {
      title: "RBI Circular on Customer Protection — Limiting Liability of Customers in Unauthorized Electronic Banking Transactions (2017)",
      url: "https://www.rbi.org.in/",
      publisher: "Reserve Bank of India",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    steps: {
      "step-1": {
        id: "step-1",
        prompt: "What is your critical first action within the next 15 minutes?",
        options: [
          {
            id: "opt-1a",
            label: "Immediately call your bank's 24x7 emergency helpline to freeze your UPI ID, block your debit card, and report unauthorized debits.",
            evaluation: "optimal",
            feedback:
              "Blocking your card and UPI prevents further draining of funds and establishes the exact time stamp of customer reporting, which is the cornerstone of RBI's Zero Liability protection.",
            legalConcept: "Immediate Mitigation of Electronic Loss",
            statutorySection: "RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18",
            points: 25,
            nextStepId: "step-2",
          },
          {
            id: "opt-1b",
            label: "Wait until Monday morning to visit your home branch in person.",
            evaluation: "dangerous",
            feedback:
              "Waiting until Monday allows the fraudsters to siphon more money and risks exceeding the crucial 3-day notification window for Zero Liability.",
            legalConcept: "Customer Contributory Negligence Due to Delay",
            points: 0,
            nextStepId: "step-2",
          },
        ],
      },
      "step-2": {
        id: "step-2",
        situationUpdate:
          "You blocked your card within 30 minutes and obtained a complaint ticket number from your bank. Now you need to alert law enforcement to freeze the fraudster's beneficiary account.",
        prompt: "Which official Government of India emergency helpline is dedicated to freezing cyber financial frauds in real time?",
        options: [
          {
            id: "opt-2a",
            label: "Dial 1930 immediately (National Cyber Crime Reporting Helpline) and file a report on cybercrime.gov.in.",
            evaluation: "optimal",
            feedback:
              "Helpline 1930 connects directly with the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS), allowing banks to freeze money in the fraudster's wallet or account before it is withdrawn at an ATM!",
            legalConcept: "Inter-Bank Financial Fraud Freezing",
            statutorySection: "Ministry of Home Affairs (I4C)",
            points: 25,
            nextStepId: "step-3",
          },
          {
            id: "opt-2b",
            label: "Hire a private ethical hacker from Telegram or Instagram who promises to retrieve the funds for a fee.",
            evaluation: "dangerous",
            feedback:
              "These online recovery agents are secondary scammers who prey on distress. Only certified law enforcement and banks can legally reverse transactions.",
            legalConcept: "Secondary Cyber Fraud Vulnerability",
            points: 0,
            nextStepId: "step-3",
          },
        ],
      },
      "step-3": {
        id: "step-3",
        situationUpdate:
          "You reported to both the bank and Helpline 1930 within 2 hours. The bank claims: 'Since UPI was used, customer must bear the loss.'",
        prompt: "Under RBI guidelines, if an unauthorized transaction occurs without customer negligence and you notify the bank within 3 working days, what is your maximum liability?",
        options: [
          {
            id: "opt-3a",
            label: "Zero Liability — The bank must credit the full shadow amount back within 10 working days.",
            evaluation: "optimal",
            feedback:
              "Under paragraph 6 of the RBI Circular, where the responsibility does not lie with the customer and the customer notifies the bank within three working days, the customer has ZERO LIABILITY. The bank must credit the disputed amount within 10 working days.",
            legalConcept: "RBI Zero Liability Doctrine",
            statutorySection: "RBI Notification July 6, 2017",
            points: 25,
            nextStepId: null,
          },
          {
            id: "opt-3b",
            label: "You must bear 50% of the lost amount as standard convenience fee.",
            evaluation: "acceptable",
            feedback:
              "False. There is no 50% deduction rule for prompt reporting of third-party breach.",
            legalConcept: "Statutory Banking Protections",
            points: 10,
            nextStepId: null,
          },
        ],
      },
    },
  },
];

export function getScenario(slug: string): ScenarioSimulation | undefined {
  return scenarioSimulations.find((s) => s.slug === slug);
}
