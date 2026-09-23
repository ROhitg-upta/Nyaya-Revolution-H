-- =============================================================================
-- Seed: seed.sql
-- Description: Deterministic initial seed data for development and testing.
-- Disclosures:
--   - REAL VERIFIED CONTENT: Sourced from official gazettes, Supreme Court reports, and statutes.
--   - DEMO CURRICULUM: Illustrative educational modules and scenario decision trees.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Legal Areas
-- -----------------------------------------------------------------------------
INSERT INTO public.legal_areas (id, title, description, icon_name, display_order)
VALUES
  ('constitutional', 'Constitutional Law', 'Fundamental rights, directive principles, and writ jurisdictions.', 'Landmark', 1),
  ('criminal', 'Criminal Law (BNS & BNSS)', 'Rights upon arrest, FIR procedures, bail, and personal liberty protections.', 'ShieldAlert', 2),
  ('consumer', 'Consumer Protection', 'Rights against defective goods, unfair trade practices, and consumer forum filings.', 'ShoppingBag', 3),
  ('cyber', 'Cyber & Digital Law', 'Online fraud recovery, digital harassment, IT Act, and privacy safeguards.', 'Lock', 4),
  ('labour', 'Employment & Labour Rights', 'Workplace safety, gratuity, statutory contracts, and wage entitlements.', 'Briefcase', 5),
  ('housing', 'Tenancy & Housing Law', 'Security deposit refunds, rent control, eviction safeguards, and RERA rights.', 'Building2', 6),
  ('traffic', 'Traffic & Road Transport', 'Motor Vehicles Act, fine dispute recourse, vehicle impound rules, and e-challans.', 'CarFront', 7),
  ('privacy', 'Data Privacy & Surveillance', 'Digital Personal Data Protection Act, biometric rights, and digital consent.', 'Eye', 8)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- -----------------------------------------------------------------------------
-- 2. Verified Legal Sources (Official Provenance)
-- -----------------------------------------------------------------------------
INSERT INTO public.legal_sources (id, title, publisher, source_type, url, citation)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'The Constitution of India',
    'Legislative Department, Ministry of Law and Justice, Government of India',
    'constitution',
    'https://legislative.gov.in/constitution-of-india',
    'Constitution of India'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'The Consumer Protection Act, 2019',
    'Gazette of India, Extraordinary, Part II, Section 1',
    'central_act',
    'https://www.indiacode.nic.in/handle/123456789/15256',
    'Act No. 35 of 2019'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Justice K.S. Puttaswamy (Retd.) v. Union of India',
    'Supreme Court of India (Nine-Judge Constitutional Bench)',
    'supreme_court',
    'https://main.sci.gov.in/supremecourt/2012/35728/35728_2012_Judgement_24-Aug-2017.pdf',
    '(2017) 10 SCC 1'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Statutory Acts (Verified Official Central Legislation)
-- -----------------------------------------------------------------------------
INSERT INTO public.statutory_acts (id, slug, title, short_title, year, enacted_by, legal_area_id, overview, source_id, verification_status)
VALUES
  (
    '00000000-0000-0000-0000-000000000010',
    'consumer-protection-act-2019',
    'The Consumer Protection Act, 2019',
    'CPA 2019',
    2019,
    'Parliament of India',
    'consumer',
    'An Act to provide for protection of the interests of consumers and for the said purpose, to establish authorities for timely and effective administration and settlement of consumers disputes.',
    '00000000-0000-0000-0000-000000000002',
    'published'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Law Articles (Verified Constitutional Provisions)
-- -----------------------------------------------------------------------------
INSERT INTO public.law_articles (
  id, slug, article_or_section, act_id, legal_area_id, title,
  simple_explanation, detailed_explanation, why_it_exists, who_it_protects,
  real_world_example, myth, reality, derived_rights, source_id, verification_status, version
)
VALUES
  (
    '00000000-0000-0000-0000-000000000020',
    'article-21-protection-of-life-and-personal-liberty',
    'Article 21',
    NULL,
    'constitutional',
    'Protection of Life and Personal Liberty',
    'No person can be deprived of their life or personal liberty except according to procedure established by law.',
    'Article 21 is the heart of fundamental rights in the Indian Constitution. Through landmark judicial interpretation (Maneka Gandhi, Francis Coralie, Puttaswamy), "life" means living with human dignity, not mere animal existence.',
    'To prevent arbitrary state action and authoritarian deprivation of citizen freedoms without fair, just, and reasonable law.',
    'Every person living in India — citizens and non-citizens alike.',
    'If police detain an individual without following statutory procedures or denying communication with family and counsel, Article 21 is violated.',
    'Article 21 only means the government cannot execute you without a trial.',
    'The Supreme Court has expanded Article 21 to guarantee clean drinking water, privacy, speedy trial, medical care, shelter, and dignity.',
    ARRAY['Right to Privacy', 'Right to Dignity', 'Right to Speedy Trial', 'Right to Free Legal Aid'],
    '00000000-0000-0000-0000-000000000001',
    'published',
    1
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5. Landmark Case Studies (Verified Supreme Court Judgments)
-- -----------------------------------------------------------------------------
INSERT INTO public.case_studies (
  id, slug, title, citation, court, year, bench, legal_area_id,
  context, problem, legal_question, relevant_concept, ratio_decidendi,
  verified_outcome, why_it_matters, citizen_learning, source_id, verification_status
)
VALUES
  (
    '00000000-0000-0000-0000-000000000030',
    'puttaswamy-v-union-of-india-2017',
    'Justice K.S. Puttaswamy (Retd.) v. Union of India',
    '(2017) 10 SCC 1',
    'Supreme Court of India',
    2017,
    '9-Judge Constitutional Bench',
    'privacy',
    'A retired High Court judge challenged the mandatory collection of biometric data under the Aadhaar scheme.',
    'Government counsel argued that the Indian Constitution contained no explicit fundamental right to privacy.',
    'Is the right to privacy a fundamental right guaranteed under Part III of the Constitution of India?',
    'Informational Self-Determination & Fundamental Privacy',
    'The right to privacy is an intrinsic part of the right to life and personal liberty under Article 21 and forms an integral part of the freedoms guaranteed in Part III.',
    'Unanimous 9-0 declaration establishing the fundamental right to privacy in India.',
    'Paved the way for digital data protection legislation and decriminalization of consensual private relations.',
    ARRAY[
      'Your digital data, biometrics, and communications are protected under Article 21.',
      'Any state intrusion on privacy must pass the proportionality test: legality, legitimate aim, and minimal intrusion.'
    ],
    '00000000-0000-0000-0000-000000000003',
    'published'
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 6. Situation Categories
-- -----------------------------------------------------------------------------
INSERT INTO public.situation_categories (id, title, description, icon_name, display_order)
VALUES
  ('students', 'Campus & Student Rights', 'Fee refunds, ragging redressal, withholding of educational certificates.', 'GraduationCap', 1),
  ('tenants', 'Tenancy & Housing Disputes', 'Security deposit withholding, illegal eviction, and repair agreements.', 'KeyRound', 2),
  ('cyber', 'Cyber Safety & Digital Fraud', 'Unauthorized UPI transactions, account takeovers, and identity theft.', 'Lock', 3),
  ('consumers', 'Consumer Rights & Purchases', 'Defective electronics, refund refusals, and unfair contracts.', 'ShoppingBag', 4),
  ('traffic', 'Traffic & Vehicle Encounters', 'On-spot challan validity, vehicle seizure limits, and inspection rights.', 'TrafficCone', 5),
  ('workers', 'Workplace & Freelancer Rights', 'Unpaid salary, wrongful termination, and contract enforcement.', 'Briefcase', 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- -----------------------------------------------------------------------------
-- 7. Verified Situation Records
-- -----------------------------------------------------------------------------
INSERT INTO public.situations (
  id, slug, title, category_id, subcategory, tagline, summary,
  rights, immediate_actions, dont_do, documents, verification_status
)
VALUES
  (
    '00000000-0000-0000-0000-000000000040',
    'unauthorized-upi-cyber-fraud',
    'Unauthorized UPI Debits from Bank Account',
    'cyber',
    'Banking Fraud',
    'Immediate steps to halt liability and recover stolen funds within 72 hours.',
    'A cyber fraudster initiates unauthorized debits from your bank account without your authorization or through a deceptive phishing link.',
    ARRAY[
      'Zero liability if reported within 3 days (RBI Circular 2017)',
      'Right to block net-banking and UPI access immediately',
      'Right to file a grievance with the Banking Ombudsman'
    ],
    ARRAY[
      'Call 1930 Cyber Fraud Helpline immediately',
      'Lock bank account and toggle UPI status via banking app',
      'Report incident on cybercrime.gov.in within 24 hours'
    ],
    ARRAY[
      'Do not click further links sent by the fraudster claiming to process a refund',
      'Never share OTP or approve reverse requests on PhonePe/GPay'
    ],
    ARRAY[
      'Bank statement showing transaction reference number (UTR)',
      'Screenshot of phishing SMS or WhatsApp message',
      '1930 acknowledgment slip'
    ],
    'published'
  )
ON CONFLICT (id) DO NOTHING;
