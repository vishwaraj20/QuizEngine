require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });
const { createClient } = require('../backend/node_modules/@supabase/supabase-js');

const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const passageRC = `The relationship between authority and legitimacy is neither automatic nor absolute. Though frequently treated as interchangeable in political discourse, they operate within distinct philosophical frameworks. Authority refers to the recognized right to exercise power, often codified through constitutional or institutional mechanisms, whereas legitimacy is rooted in public consent and ethical justification. The tension between authority and legitimacy constitutes a persistent concern in political theory and civic governance. Institutions derive authority from legal mandates, electoral processes, or historical precedent, thereby ensuring procedural continuity and administrative order. However, legitimacy is contingent upon societal trust and normative approval, which may fluctuate over time. Regimes that maintain authority without sustaining legitimacy often encounter dissent, civil unrest, or moral criticism. Historical examples include governments that enacted discriminatory policies under lawful authority yet faced widespread resistance for violating ethical norms. Conversely, reform movements—though initially lacking formal authority—may acquire legitimacy through collective endorsement and moral persuasion. This distinction reveals that authority does not invariably command legitimacy, and legitimacy can at times challenge established authority. Nevertheless, conflating the two concepts can undermine democratic balance. In pluralistic societies, diverse constituencies interpret legitimacy through varying cultural, ideological, and historical lenses. If authority were to enforce a singular conception of legitimacy, it might suppress dissent and erode institutional neutrality. Contemporary debates surrounding surveillance, digital governance, and environmental regulation further illuminate this dynamic. Legal authorization may permit certain actions, yet public legitimacy may question their ethical ramifications. Therefore, a resilient political system must harmonize institutional authority with evolving standards of legitimacy, while citizens remain vigilant participants in shaping both.`;

const rawQuestions = [
  {
    id: 1,
    question: "If '+' means '×', '−' means '÷', '×' means '+', and '÷' means '−', then find: 18 + 6 × 16 − 4 ÷ 2 = ?",
    options: { A: "108", B: "110", C: "112", D: "114" },
    correct: "B",
    explanation: "Replacing the signs according to the given rules: '+' becomes '×', '×' becomes '+', '−' becomes '÷', and '÷' becomes '−'. The expression becomes: 18 × 6 + 16 ÷ 4 − 2. According to BODMAS rule, division is performed first: 16 ÷ 4 = 4. Then multiplication: 18 × 6 = 108. Then addition and subtraction: 108 + 4 − 2 = 110."
  },
  {
    id: 2,
    question: "A is the mother of B. B is the sister of C. C is the father of D. How is A related to C?",
    options: { A: "Aunt", B: "Mother", C: "Grandmother", D: "Sister" },
    correct: "B",
    explanation: "Since B is the sister of C, B and C are siblings. Given that A is the mother of B, A must also be the mother of C."
  },
  {
    id: 3,
    question: "Find the odd one out.",
    options: { A: "Newton", B: "Einstein", C: "Galileo", D: "Shakespeare" },
    correct: "D",
    explanation: "Isaac Newton, Albert Einstein, and Galileo Galilei are renowned physicists and scientists. William Shakespeare is a famous playwright and poet, making him the odd one out."
  },
  {
    id: 4,
    question: "Statement: A growing number of students are enrolling in online certification courses.\nConclusions:\nI. Students want flexible learning options.\nII. Traditional colleges are shutting down.",
    options: { A: "Only I follows", B: "Only II follows", C: "Both follow", D: "Neither follows" },
    correct: "A",
    explanation: "Enrolling in online certification courses directly reflects a preference or need for flexible learning options, so Conclusion I follows logically. However, this trend does not imply that traditional colleges are shutting down, so Conclusion II does not follow."
  },
  {
    id: 5,
    question: "Statement: A ≥ B < C ≤ D = E > F\nConclusion:\nI. C > B\nII. F < D",
    options: { A: "Only Conclusion I is true", B: "Only Conclusion II is true", C: "Both are true", D: "Both are false" },
    correct: "C",
    explanation: "From the statement, we clearly have B < C, which means C > B is strictly true (Conclusion I). Also, we have D = E > F, which means D > F or F < D is strictly true (Conclusion II). Thus, both conclusions are true."
  },
  {
    id: 6,
    question: "P is the only son of Q. Q is the only daughter of R. How is P related to R?",
    options: { A: "Son", B: "Grandson", C: "Nephew", D: "Cousin" },
    correct: "B",
    explanation: "Q is the daughter of R, and P is the son of Q. Therefore, P is the grandson of R."
  },
  {
    id: 7,
    question: "What comes next in the series: BZ, CY, DX, ?",
    options: { A: "EW", B: "EV", C: "FV", D: "FW" },
    correct: "A",
    explanation: "The first letters follow a forward alphabetical sequence: B, C, D, next is E. The second letters follow a backward sequence: Z, Y, X, next is W. Combining them gives EW."
  },
  {
    id: 8,
    question: "If 6 men can complete a work in 10 days, how many men are needed to complete it in 5 days?",
    options: { A: "10", B: "12", C: "8", D: "6" },
    correct: "B",
    explanation: "Total work = 6 men × 10 days = 60 man-days. To complete 60 man-days of work in 5 days, the number of men required = 60 ÷ 5 = 12 men."
  },
  {
    id: 9,
    question: "The series below contains a sequence of numbers. Identify the incorrect number: 5, 20, 80, 310, 1280",
    options: { A: "20", B: "80", C: "310", D: "1280" },
    correct: "C",
    explanation: "The pattern is multiplication by 4: 5 × 4 = 20; 20 × 4 = 80; 80 × 4 = 320 (instead of 310); 320 × 4 = 1280. Therefore, 310 is the incorrect number."
  },
  {
    id: 10,
    question: "Select the letter-cluster that can replace the question mark (?) in the series: DGK, ILP, NQU, ?",
    options: { A: "RVW", B: "RWX", C: "TXY", D: "SVZ" },
    correct: "D",
    explanation: "Each letter shifts forward by 5 positions: D(+5)=I(+5)=N(+5)=S; G(+5)=L(+5)=Q(+5)=V; K(+5)=P(+5)=U(+5)=Z. Thus, the next cluster is SVZ."
  },
  {
    id: 11,
    question: "A and B invest in a business in the ratio 3:4. If the total profit is ₹14,000, what is B’s share?",
    options: { A: "₹6,000", B: "₹7,000", C: "₹8,000", D: "₹9,000" },
    correct: "C",
    explanation: "The total ratio parts = 3 + 4 = 7. B's share = (4 / 7) × ₹14,000 = 4 × ₹2,000 = ₹8,000."
  },
  {
    id: 12,
    question: "Statements:\nI. The company introduced a work-from-home policy.\nII. Employee productivity increased.",
    options: { A: "I is the cause and II is the effect", B: "II is the cause and I is the effect", C: "Both are effects of the same cause", D: "No relation" },
    correct: "A",
    explanation: "Introducing a flexible work-from-home policy (Statement I) improved employee morale and flexibility, directly serving as the cause that resulted in increased productivity (Statement II as the effect)."
  },
  {
    id: 13,
    question: "Statement: Many people prefer electric vehicles over petrol vehicles.\nConclusions:\nI. Electric vehicles are eco-friendly.\nII. Petrol vehicles are banned.",
    options: { A: "Only I follows", B: "Only II follows", C: "Both follow", D: "Neither follows" },
    correct: "A",
    explanation: "The growing preference for electric vehicles is widely driven by their eco-friendly benefits and lower running costs (Conclusion I follows logically). However, a preference does not mean petrol vehicles are legally banned (Conclusion II does not follow)."
  },
  {
    id: 14,
    question: "If 7 # 1 = 36 and 6 # 1 = 25, then 5 # 1 = ?",
    options: { A: "12", B: "16", C: "9", D: "7" },
    correct: "B",
    explanation: "The operation represents the square of the difference between the two numbers: (7 − 1)² = 6² = 36; (6 − 1)² = 5² = 25. Therefore, (5 − 1)² = 4² = 16."
  },
  {
    id: 15,
    question: "Find out the WRONG number in the given series: 420, 400, 380, 370, 340",
    options: { A: "400", B: "380", C: "370", D: "340" },
    correct: "C",
    explanation: "The series follows a constant subtraction of 20: 420 − 20 = 400; 400 − 20 = 380; 380 − 20 should be 360 (not 370); 360 − 20 = 340. Hence, 370 is wrong."
  },
  {
    id: 16,
    question: "If 'MOON' is coded as 'QSSR', how is 'STAR' coded?",
    options: { A: "WXEV", B: "WUET", C: "VXEQ", D: "WXFV" },
    correct: "A",
    explanation: "Each letter is shifted forward by 4 positions in the alphabet: M(+4)=Q, O(+4)=S, O(+4)=S, N(+4)=R. Applying +4 to STAR: S(+4)=W, T(+4)=X, A(+4)=E, R(+4)=V. Thus, WXEV."
  },
  {
    id: 17,
    question: "Find the alternative that will replace the question mark: STOP : TOPS :: DRAW : ?",
    options: { A: "WARD", B: "RADW", C: "ADRW", D: "RAWD" },
    correct: "D",
    explanation: "In STOP -> TOPS, the first letter (S) is moved to the very end of the word. Applying the same rule to DRAW, moving the first letter (D) to the end gives RAWD."
  },
  {
    id: 18,
    question: "If COLD is coded as DPME, how is WARM coded?",
    options: { A: "XBSN", B: "XBSL", C: "VZQL", D: "XCRM" },
    correct: "A",
    explanation: "Each letter is shifted forward by +1 position: C+1=D, O+1=P, L+1=M, D+1=E. For WARM: W+1=X, A+1=B, R+1=S, M+1=N. Thus, XBSN."
  },
  {
    id: 19,
    question: "Choose the address that is the exact same as: B-22, Shanti Vihar, Ring Road, Bhopal, Madhya Pradesh - 462001",
    options: {
      A: "B-22, Shanti Vihar, Ring Road, Bhopal, Rajasthan - 462001",
      B: "B-22, Shanti Vihar, Ring Road, Bhopal, Madhya Pradesh - 462001",
      C: "B-22, Shanti Vihar, Ring Rd, Bhopal, Madhya Pradesh - 462010",
      D: "B-23, Shanti Vihar, Ring Road, Bhopal, Madhya Pradesh - 462001"
    },
    correct: "B",
    explanation: "Option B is an identical character-by-character match to the given sample address."
  },
  {
    id: 20,
    question: "Statement: Employees are advised to switch off computers after office hours.\nConclusions:\nI. This reduces electricity consumption.\nII. Computers are unsafe to use.",
    options: { A: "Only I follows", B: "Only II follows", C: "Both follow", D: "Neither follows" },
    correct: "A",
    explanation: "Advising employees to switch off idle electronics after office hours is aimed at conserving energy and reducing electricity bills (Conclusion I follows). It does not mean computers are hazardous or unsafe to use (Conclusion II does not follow)."
  },
  {
    id: 21,
    question: "What comes next in the series: 1, 9, 25, 49, 81, ?",
    options: { A: "121", B: "144", C: "100", D: "169" },
    correct: "A",
    explanation: "The series represents squares of consecutive odd numbers: 1² = 1, 3² = 9, 5² = 25, 7² = 49, 9² = 81. The next odd number is 11, and 11² = 121."
  },
  {
    id: 22,
    question: "If '+' means '÷', '-' means '+', '×' means '-', and '÷' means '×', then find: 16 + 8 × 4 - 2 ÷ 2 = ?",
    options: { A: "6", B: "8", C: "2", D: "4" },
    correct: "C",
    explanation: "Replacing the operators: 16 ÷ 8 − 4 + 2 × 2. According to BODMAS: Division first (16 ÷ 8 = 2), then Multiplication (2 × 2 = 4). Expression becomes: 2 − 4 + 4 = 2."
  },
  {
    id: 23,
    question: "If '+' means '×', '-' means '+', '×' means '÷', and '÷' means '-', then find: 18 + 6 × 3 - 4 ÷ 2 = ?",
    options: { A: "38", B: "36", C: "40", D: "39" },
    correct: "A",
    explanation: "Replacing the operators: 18 × 6 ÷ 3 + 4 − 2. According to BODMAS: Division first (6 ÷ 3 = 2), then Multiplication (18 × 2 = 36). Expression becomes: 36 + 4 − 2 = 38."
  },
  {
    id: 24,
    question: "Choose the address that is the exact same as: 14, Blue Lotus Tower, M.G. Road, Pune, Maharashtra - 411001",
    options: {
      A: "14, Blue Lotus Tower, M.G. Road, Pune, Maharashtra - 411001",
      B: "14 Blue Lotus Tower, MG Road, Pune, Maharashtra - 411001",
      C: "14, Blue Lotus Tower, M.G Road, Pune, Maharashtra - 411010",
      D: "14, Blue Lotus Towers, M.G. Road, Pune, Maharashtra - 411001"
    },
    correct: "A",
    explanation: "Option A matches the sample address exactly without any missing punctuation or spelling alterations."
  },
  {
    id: 25,
    question: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
    options: { A: "95", B: "125", C: "127", D: "131" },
    correct: "C",
    explanation: "Each number is obtained by multiplying the previous number by 2 and adding 1: 3×2+1=7; 7×2+1=15; 15×2+1=31; 31×2+1=63; 63×2+1 = 127."
  },
  {
    id: 26,
    question: "Mixed economy implies:",
    options: {
      A: "State ownership only",
      B: "Private ownership only",
      C: "Coexistence of public and private sectors",
      D: "Foreign investment only"
    },
    correct: "C",
    explanation: "A mixed economic system combines elements of both capitalism and socialism, featuring the harmonious coexistence of both public (government-run) and private enterprises."
  },
  {
    id: 27,
    question: "As per international standards, the weight of a table tennis ball is:",
    options: { A: "2.7 g", B: "3.0 g", C: "3.5 g", D: "4.0 g" },
    correct: "A",
    explanation: "According to the International Table Tennis Federation (ITTF) regulations, a standard table tennis ball must weigh exactly 2.7 grams and have a diameter of 40 mm."
  },
  {
    id: 28,
    question: "Standard athletics tracks mark each lane with lines of width:",
    options: { A: "2 cm", B: "5 cm", C: "10 cm", D: "15 cm" },
    correct: "B",
    explanation: "According to World Athletics rules, all track lane lines must be painted white and have a precise width of 5 cm."
  },
  {
    id: 29,
    question: "Which of the following best describes the constitutional status of the Finance Commission of India?",
    options: {
      A: "It functions as a permanent body with continuous existence.",
      B: "It is constituted periodically by the President to make recommendations on fiscal distribution.",
      C: "It has the power to levy and collect taxes on behalf of states.",
      D: "It is a statutory body created by an Act of Parliament."
    },
    correct: "B",
    explanation: "Under Article 280 of the Indian Constitution, the Finance Commission is a constitutional body constituted every five years (or earlier) by the President of India to recommend financial distributions between the Union and States."
  },
  {
    id: 30,
    question: "Consider the following statements about enzymes:\n1. They lower activation energy.\n2. They are substrate specific.\n3. They are unaffected by temperature.\nWhich are correct?",
    options: { A: "1 and 2", B: "2 and 3", C: "1 and 3", D: "1, 2, and 3" },
    correct: "A",
    explanation: "Enzymes act as biological catalysts by lowering activation energy (1 is correct) and exhibit high specificity to their substrates (2 is correct). However, enzymes are highly sensitive to temperature and denature at extreme heat (3 is false)."
  },
  {
    id: 31,
    question: "Consider the following statements:\n1. Article 136 empowers the Supreme Court to grant Special Leave to Appeal from any court or tribunal in India.\n2. Article 136 applies automatically to all military court (court-martial) decisions without exception.\nWhich of the statements given above is/are correct?",
    options: { A: "Only 1", B: "Only 2", C: "Both 1 and 2", D: "Neither 1 nor 2" },
    correct: "A",
    explanation: "Article 136(1) grants discretionary power to the Supreme Court to grant special leave to appeal from any court or tribunal in India (Statement 1 is correct). However, Article 136(2) explicitly states that this does not apply to any court or tribunal constituted by or under any law relating to the Armed Forces (Statement 2 is false)."
  },
  {
    id: 32,
    question: "Assertion (A): India has increased coastal radar cooperation with neighbors.\nReason (R): Maritime domain awareness is vital for regional security.",
    options: {
      A: "Both A and R true, R explains A",
      B: "Both true but R not explanation",
      C: "A true R false",
      D: "A false R true"
    },
    correct: "A",
    explanation: "Enhancing Maritime Domain Awareness (MDA) is crucial for tracking sea threats and safeguarding regional security (R), which provides the strategic justification for India sharing coastal radar systems with friendly Indian Ocean nations (A)."
  },
  {
    id: 33,
    question: "Taxes on professions, trades, callings, and employments are limited by Article:",
    options: { A: "276", B: "265", C: "280", D: "246" },
    correct: "A",
    explanation: "Article 276 of the Indian Constitution empowers state legislatures to levy taxes on professions, trades, callings, and employments, with a maximum constitutional cap per person per annum."
  },
  {
    id: 34,
    question: "Arrange the following monuments in chronological order of construction (earliest to latest):",
    options: {
      A: "Qutub Minar -> Humayun’s Tomb -> Taj Mahal",
      B: "Humayun’s Tomb -> Qutub Minar -> Taj Mahal",
      C: "Taj Mahal -> Humayun’s Tomb -> Qutub Minar",
      D: "Qutub Minar -> Taj Mahal -> Humayun’s Tomb"
    },
    correct: "A",
    explanation: "Qutub Minar construction began around 1199 CE under Qutb-ud-din Aibak. Humayun's Tomb was commissioned in 1565/1570 CE during Akbar's reign. The Taj Mahal was constructed between 1632 and 1653 CE under Shah Jahan."
  },
  {
    id: 35,
    question: "Which historical pair is correctly matched?",
    options: {
      A: "Lord Dalhousie – Doctrine of Lapse",
      B: "Lord Curzon – Vernacular Press Act",
      C: "Lord Ripon – Subsidiary Alliance",
      D: "Lord Hastings – Permanent Settlement"
    },
    correct: "A",
    explanation: "Lord Dalhousie aggressively applied the Doctrine of Lapse (Option A is correct). The Vernacular Press Act was passed by Lord Lytton (1878), Subsidiary Alliance was popularized by Lord Wellesley, and Permanent Settlement was introduced by Lord Cornwallis (1793)."
  },
  {
    id: 36,
    question: "The devotional hymn 'Vaishnava Jana To' is commonly rendered in which Hindustani rhythmic cycle (tala)?",
    options: { A: "Dadra", B: "Teentaal", C: "Ektaal", D: "Jhaptaal" },
    correct: "D",
    explanation: "The iconic Gujarati bhajan 'Vaishnava Jana To', written by Narsinh Mehta and revered by Mahatma Gandhi, is traditionally set and rendered in Jhaptaal (a 10-beat rhythmic cycle)."
  },
  {
    id: 37,
    question: "The Nehru Trophy Boat Race held in Kerala is mainly associated with which traditional activity?",
    options: { A: "Elephant processions", B: "Snake boat racing", C: "Temple rituals", D: "Folk theatre" },
    correct: "B",
    explanation: "The Nehru Trophy Boat Race is a premier Vallam Kali (snake boat racing) event conducted annually on the Punnamada Lake in Alappuzha, Kerala."
  },
  {
    id: 38,
    question: "Assertion (A): Disinvestment in India has often sparked public and political debate.\nReason (R): Disinvestment involves dilution of government ownership in public sector enterprises.",
    options: {
      A: "Both A and R are true and R is the correct explanation of A.",
      B: "Both A and R are true but R is not the correct explanation of A.",
      C: "A is true but R is false.",
      D: "A is false but R is true."
    },
    correct: "A",
    explanation: "Because disinvestment dilutes government ownership and privatizes public assets (Reason R), it naturally raises concerns regarding job security and national assets, triggering political and public debates (Assertion A)."
  },
  {
    id: 39,
    question: "The widespread entry of Multinational Corporations (MNCs) into the Indian market is linked with:",
    options: { A: "Liberalisation", B: "Nationalisation", C: "Swadeshi", D: "Protectionism" },
    correct: "A",
    explanation: "The historic Economic Liberalisation reforms launched in 1991 under the LPG (Liberalisation, Privatisation, Globalisation) policy removed trade barriers and opened Indian markets to foreign direct investment and MNCs."
  },
  {
    id: 40,
    question: "Identify the correctly matched Gupta-era administrative term and its meaning:",
    options: { A: "Uparikara – Additional tax", B: "Vishti – Land grant", C: "Bhoga – Judicial penalty", D: "Kara – Religious donation" },
    correct: "A",
    explanation: "In Gupta Empire inscriptions, 'Uparikara' denoted an extra or additional tax levied on agricultural subjects. ('Vishti' referred to forced unpaid labor, and 'Bhoga' referred to regular customary supplies of fruits/firewood to the king)."
  },
  {
    id: 41,
    question: "Which Western Chalukya ruler is known for defeating the Chola king Rajadhiraja I in the Battle of Koppam (1054 CE)?",
    options: { A: "Pulakeshin II", B: "Vikramaditya VI", C: "Someshvara I", D: "Tailapa II" },
    correct: "C",
    explanation: "In the fierce Battle of Koppam (1054 CE), Western Chalukya king Someshvara I (Ahavamalla) engaged the Chola forces, resulting in the death of Chola monarch Rajadhiraja I on the battlefield."
  },
  {
    id: 42,
    question: "At the 87th Senior National Badminton Championships 2025 held in Vijayawada, who won the men’s and women’s singles titles, respectively?",
    options: {
      A: "Kiran George and Tanvi Sharma",
      B: "Rithvik Sanjeevi and Surya Charishma Tamiri",
      C: "Rithvik Sanjeevi and Tanvi Patri",
      D: "Kiran George and Surya Charishma Tamiri"
    },
    correct: "C",
    explanation: "Rithvik Sanjeevi secured the men's singles championship, while rising star Tanvi Patri won the women's singles title at the 87th Senior National Badminton Championships in Vijayawada."
  },
  {
    id: 43,
    question: "'The Ministry of Utmost Happiness' was written by which renowned author who is also a recipient of the Sahitya Akademi Award?",
    options: { A: "Kiran Desai", B: "Arundhati Roy", C: "Jhumpa Lahiri", D: "Anita Desai" },
    correct: "B",
    explanation: "Arundhati Roy authored 'The Ministry of Utmost Happiness' (2017). She was also awarded the Sahitya Akademi Award in 2006 for her essay collection 'The Algebra of Infinite Justice'."
  },
  {
    id: 44,
    question: "The traditional dance Gaur Maria, featuring headgear adorned with bison horns and vigorous tribal movements, is associated with which tribe and state?",
    options: { A: "Santhal — Jharkhand", B: "Gaur (Maria) — Chhattisgarh", C: "Bhil — Rajasthan", D: "Toda — Tamil Nadu" },
    correct: "B",
    explanation: "The Gaur Maria dance is a celebrated traditional dance of the Maria Gond tribe in the Bastar district of Chhattisgarh, representing the hunting movements of the Indian bison (Gaur)."
  },
  {
    id: 45,
    question: "The Green Credit Programme launched by the Government of India primarily rewards:",
    options: { A: "Polluters", B: "Voluntary eco-friendly actions", C: "Industrial taxes", D: "Mining firms" },
    correct: "B",
    explanation: "The Green Credit Programme (under the Environment Protection Act) is designed to incentivize voluntary eco-friendly actions like afforestation, water conservation, and sustainable waste management by individuals and organizations."
  },
  {
    id: 46,
    question: "Regarding the 75th All India Inter Services Basketball Championship 2025:\n1. It was hosted by the Western Command at the DSOI Stadium, Pune.\n2. The Indian Air Force team defeated the Indian Army team to clinch the title.\nWhich statement(s) is/are correct?",
    options: { A: "Only 1 is correct", B: "Only 2 is correct", C: "Both 1 and 2 are correct", D: "Neither 1 nor 2 is correct" },
    correct: "C",
    explanation: "Both statements are accurate. The championship took place at DSOI Pune under Western Command, and the Indian Air Force (IAF) basketball team secured the trophy by beating the Indian Army Red team."
  },
  {
    id: 47,
    question: "Core inflation declines when:",
    options: { A: "Commodity prices fall", B: "Wages rise", C: "Taxes increase", D: "Currency weakens" },
    correct: "A",
    explanation: "Core inflation measures inflation excluding volatile food and energy sectors. When broad underlying commodity and industrial raw material prices decline, production costs drop, leading to lower core inflation."
  },
  {
    id: 48,
    question: "Energy transition investment depends greatly on:",
    options: { A: "Fossil fuel imports", B: "Policy stability", C: "High tariffs", D: "Coal reserves" },
    correct: "B",
    explanation: "Large-scale capital investments in clean energy transition require predictable regulatory frameworks and long-term policy stability to mitigate risks for investors."
  },
  {
    id: 49,
    question: "The traditional Dumhal dance of Jammu & Kashmir is especially known for which distinctive feature?",
    options: {
      A: "Dancers carrying tall conical headgear",
      B: "Performers balancing earthen pots",
      C: "Use of large percussion drums only",
      D: "Solo devotional singing"
    },
    correct: "A",
    explanation: "Dumhal is a famous dance of the Wattal tribe in Jammu & Kashmir, easily recognized by male dancers wearing colorful robes and tall, conical, bead-encrusted headgear."
  },
  {
    id: 50,
    question: "Identify the incorrect match among the atmospheric layers and their features:",
    options: { A: "Troposphere – weather", B: "Stratosphere – ozone", C: "Mesosphere – satellites", D: "Thermosphere – auroras" },
    correct: "C",
    explanation: "Most artificial satellites orbit in the Exosphere or Thermosphere. The Mesosphere is characterized by cold temperatures where meteors burn upon entry, making 'Mesosphere – satellites' the incorrect match."
  },
  {
    id: 51,
    question: "Evaluate: 18³ + 14³ − 32³ + 24192 = ?",
    options: { A: "0", B: "1", C: "-24192", D: "48384" },
    correct: "A",
    explanation: "Using the identity: if a + b + c = 0, then a³ + b³ + c³ = 3abc. Here let a = 18, b = 14, c = -32. Since 18 + 14 - 32 = 0, we have 18³ + 14³ + (-32)³ = 3(18)(14)(-32) = -24192. Thus, the expression becomes -24192 + 24192 = 0."
  },
  {
    id: 52,
    question: "If sin α = 4/5 and α ∈ (0, π/2), then find (1 − cot α) / (1 + cot α) = ?",
    options: { A: "3/7", B: "1/4", C: "-1/7", D: "1/7" },
    correct: "D",
    explanation: "In a right triangle with sin α = 4/5, opposite = 4 and hypotenuse = 5. By Pythagoras theorem, adjacent side = √(5² − 4²) = 3. Therefore, cot α = adjacent/opposite = 3/4. Substituting: (1 − 3/4) / (1 + 3/4) = (1/4) / (7/4) = 1/7."
  },
  {
    id: 53,
    question: "If tan θ + cot θ = 2 and θ ∈ (0, π/2), what is the value of sec θ + cosec θ = ?",
    options: { A: "2√2", B: "√2", C: "2", D: "4√2" },
    correct: "A",
    explanation: "If tan θ + 1/tan θ = 2, solving gives tan θ = 1, which means θ = 45°. Substituting θ = 45°: sec 45° + cosec 45° = √2 + √2 = 2√2."
  },
  {
    id: 54,
    question: "A tree is 30 meters tall. What is the length of the shadow cast by the tree when the sun’s elevation angle is 30°?",
    options: { A: "10 m", B: "15√3 m", C: "30√3 m", D: "30 m" },
    correct: "C",
    explanation: "Using trigonometry: tan 30° = height / shadow. 1/√3 = 30 / shadow. Therefore, shadow = 30√3 meters."
  },
  {
    id: 55,
    question: "A refrigerator is priced at ₹45,000. A customer gets a discount of ₹5,000 on it. After the discount, the customer buys a voltage stabilizer for ₹2,000 at a 15% discount. What is the total amount spent?",
    options: { A: "₹42,000", B: "₹41,500", C: "₹42,700", D: "₹41,700" },
    correct: "D",
    explanation: "Refrigerator price after discount = ₹45,000 − ₹5,000 = ₹40,000. Stabilizer price after 15% discount = ₹2,000 − ₹300 = ₹1,700. Total spent = ₹40,000 + ₹1,700 = ₹41,700."
  },
  {
    id: 56,
    question: "Two pipes A and B can fill a tank in 10 and 15 minutes respectively. After both are opened together for 3 minutes, the rate of pipe A becomes one-third, and pipe B becomes 2.5 times its original. In how many more minutes will the tank be full?",
    options: { A: "2 min 15 sec", B: "3 min 10 sec", C: "2 min 30 sec", D: "1 min 45 sec" },
    correct: "C",
    explanation: "Let tank capacity = 30 units (LCM of 10 and 15). Rate A = 3 units/min, Rate B = 2 units/min. In 3 mins, they fill (3+2)×3 = 15 units. Remaining = 15 units. New rates: A = 3×(1/3) = 1 unit/min; B = 2×2.5 = 5 units/min. Combined new rate = 6 units/min. Time for remaining work = 15 ÷ 6 = 2.5 mins = 2 min 30 sec."
  },
  {
    id: 57,
    question: "In △ ABC, AD is the perpendicular bisector of BC. Are the triangles ABD and ACD congruent? If so, by what rule?",
    options: { A: "Yes, by SSS", B: "Yes, by ASA", C: "Yes, by SAS", D: "No, they are not congruent" },
    correct: "C",
    explanation: "Since AD bisects BC perpendicularly: BD = CD (Side), ∠ADB = ∠ADC = 90° (Angle), and AD = AD (common Side). Thus, △ABD ≅ △ACD by SAS congruence criterion."
  },
  {
    id: 58,
    question: "A conical vessel is cut at one-fourth its height from the top, parallel to its base. What is the ratio of the volume of the top cone part to the bottom frustum part?",
    options: { A: "1:15", B: "1:63", C: "1:64", D: "1:27" },
    correct: "B",
    explanation: "The height ratio of the top small cone to the full cone is 1 : 4. Since volume scales as the cube of linear dimensions, the volume ratio is 1³ : 4³ = 1 : 64. Thus, if top part volume = 1 unit, bottom frustum volume = 64 − 1 = 63 units. Ratio = 1 : 63."
  },
  {
    id: 59,
    question: "Simplify the expression: √(14 + 6√5)",
    options: { A: "2 + √5", B: "5 + √3", C: "3 + √5", D: "4 + √2" },
    correct: "C",
    explanation: "We can express 14 + 6√5 as 9 + 5 + 2(3)(√5) = 3² + (√5)² + 2(3)(√5) = (3 + √5)². Taking the square root yields 3 + √5."
  },
  {
    id: 60,
    question: "Sneha lent ₹24,000 to Vikas on 4 April 2024 at a simple interest rate of 5% per annum. Vikas plans to pay back the entire amount on 16 June 2024. What is the total amount Vikas needs to return?",
    options: { A: "₹24,120", B: "₹24,180", C: "₹24,240", D: "₹24,300" },
    correct: "C",
    explanation: "Number of loan days between April 4 and June 16 = 26 days (April) + 31 days (May) + 16 days (June) = 73 days (which is exactly 73/365 = 1/5 of a year). Interest = (24000 × 5 × 1/5) / 100 = ₹240. Total return amount = ₹24,000 + ₹240 = ₹24,240."
  },
  {
    id: 61,
    question: "What is the result of (0.7³ + 0.2³ − 0.9³) ÷ (3 × 0.7 × 0.2 × (−0.9)) = ?",
    options: { A: "1", B: "-1", C: "0", D: "2" },
    correct: "A",
    explanation: "Let a = 0.7, b = 0.2, c = -0.9. Since a + b + c = 0, algebraic identity states a³ + b³ + c³ = 3abc. The given expression is exactly (a³ + b³ + c³) ÷ (3abc) = 3abc ÷ 3abc = 1."
  },
  {
    id: 62,
    question: "If P, Q, and R are three amounts of money such that Q is the simple interest on P, and R is the simple interest on Q, all for the same time period and rate of interest, then which relation is true?",
    options: { A: "Q² = PR", B: "P² = QR", C: "R² = PQ", D: "P + Q = R" },
    correct: "A",
    explanation: "Let time be T and rate be r%. Given Q = (P × r × T)/100, so (rT)/100 = Q/P. Also given R = (Q × r × T)/100, so (rT)/100 = R/Q. Equating both gives Q/P = R/Q, which simplifies to Q² = PR."
  },
  {
    id: 63,
    question: "The graph of the linear equation 2x + 5y = 10 passes through which point?",
    options: { A: "(5, 0)", B: "(0, 2)", C: "(-5, 4)", D: "All of the above" },
    correct: "D",
    explanation: "Checking each point: For (5,0): 2(5)+5(0)=10. For (0,2): 2(0)+5(2)=10. For (-5,4): 2(-5)+5(4)=-10+20=10. All three points satisfy the equation."
  },
  {
    id: 64,
    question: "A circle is inscribed in a right triangle with legs of length 10 and 24. What is the radius of the circle?",
    options: { A: "2", B: "4", C: "6", D: "8" },
    correct: "B",
    explanation: "Hypotenuse c = √(10² + 24²) = √(100 + 576) = √676 = 26. For any right-angled triangle with legs a, b and hypotenuse c, the inradius r = (a + b − c) / 2 = (10 + 24 − 26) / 2 = 8 / 2 = 4."
  },
  {
    id: 65,
    question: "What is the value of sin 75° cos 15° + cos 75° sin 15° = ?",
    options: { A: "1/2", B: "√3/2", C: "0", D: "1" },
    correct: "D",
    explanation: "Using the trigonometric compound angle identity: sin A cos B + cos A sin B = sin(A + B). Here A = 75° and B = 15°. Thus, sin(75° + 15°) = sin(90°) = 1."
  },
  {
    id: 66,
    question: "The sides of a rectangular prism are in the ratio 1:2:3. If the volume of the prism is 384 cm³, what is the length of its longest side?",
    options: { A: "8 cm", B: "16 cm", C: "12 cm", D: "24 cm" },
    correct: "C",
    explanation: "Let the side lengths be x, 2x, and 3x. Volume = x × 2x × 3x = 6x³ = 384. Solving gives x³ = 64, so x = 4 cm. The longest side = 3x = 3 × 4 = 12 cm."
  },
  {
    id: 67,
    question: "If x + 1/x = −1, then compute the value of: x⁵ + 1/x⁵ + 4x³ + 4/x³",
    options: { A: "4", B: "7", C: "-3", D: "5" },
    correct: "B",
    explanation: "If x + 1/x = −1, multiplying by (x − 1) yields x³ − 1 = 0, so x³ = 1. Thus, 4x³ + 4/x³ = 4(1) + 4(1) = 8. For x⁵ + 1/x⁵, since x³ = 1, this simplifies to x² + 1/x². Squaring x + 1/x = −1 gives x² + 1/x² + 2 = 1, meaning x² + 1/x² = −1. Total expression = −1 + 8 = 7."
  },
  {
    id: 68,
    question: "If 20% of P = 15% of Q = 12% of R, find the ratio P : Q : R.",
    options: { A: "3 : 4 : 5", B: "5 : 4 : 3", C: "15 : 20 : 12", D: "4 : 5 : 6" },
    correct: "A",
    explanation: "Given 20P = 15Q = 12R. Dividing by 60 (the LCM of 20, 15, and 12) gives P/3 = Q/4 = R/5. Thus, P : Q : R = 3 : 4 : 5."
  },
  {
    id: 69,
    question: "A right-angled triangle has legs of 9 cm and 12 cm. A second right-angled triangle is similar to the first, and its hypotenuse is 45 cm. What is the area of the second triangle?",
    options: { A: "216 cm²", B: "324 cm²", C: "405 cm²", D: "486 cm²" },
    correct: "D",
    explanation: "Hypotenuse of first triangle = √(9² + 12²) = 15 cm. Area of first triangle = 0.5 × 9 × 12 = 54 cm². The scale factor k between the triangles = 45 / 15 = 3. Since area scales by k², area of second triangle = 54 × 3² = 54 × 9 = 486 cm²."
  },
  {
    id: 70,
    question: "Which of the following statements is correct?\ni. √10 + √3 > √8 + √5\nii. √10 + √3 < √8 + √5\niii. √10 + √3 = √8 + √5",
    options: { A: "Only i", B: "Only ii", C: "Only iii", D: "None of the above" },
    correct: "B",
    explanation: "Squaring both expressions: (√10 + √3)² = 13 + 2√30; (√8 + √5)² = 13 + 2√40. Since √40 > √30, we clearly have √8 + √5 > √10 + √3, making statement ii true."
  },
  {
    id: 71,
    question: "A solid sphere is placed inside a cube such that it touches all six faces. What percentage of the cube's volume is occupied by the sphere?",
    options: { A: "47.64%", B: "42.54%", C: "55.45%", D: "52.36%" },
    correct: "D",
    explanation: "Let the radius of the sphere be r. The side length of the bounding cube is a = 2r. Volume of cube = (2r)³ = 8r³. Volume of sphere = (4/3)πr³. Percentage occupied = [((4/3)πr³) / 8r³] × 100 = (π/6) × 100 ≈ 52.36%."
  },
  {
    id: 72,
    question: "A rectangle is a quadrilateral in which:",
    options: {
      A: "All four interior angles are 90° and opposite sides are equal.",
      B: "Diagonals intersect at 90° and bisect angles.",
      C: "Only one pair of opposite sides is parallel.",
      D: "All four sides are equal in length."
    },
    correct: "A",
    explanation: "By Euclidean definition, a rectangle is a quadrilateral having four right angles (90°) with opposite sides equal and parallel."
  },
  {
    id: 73,
    question: "A sector of a circle has a central angle of 60° and a radius of 12 cm. Another sector of the same circle has a central angle of π/2 radians. What is the ratio of the area of the first sector to the area of the second sector?",
    options: { A: "1:2", B: "2:3", C: "3:4", D: "4:5" },
    correct: "B",
    explanation: "Since both sectors share the same circle radius (12 cm), the ratio of their areas equals the ratio of their central angles. π/2 radians = 90°. Ratio = 60° / 90° = 2 : 3."
  },
  {
    id: 74,
    question: "A hemisphere of radius 6 cm is carved from a sphere. What is the volume of the hemisphere?",
    options: { A: "72π cm³", B: "144π cm³", C: "216π cm³", D: "288π cm³" },
    correct: "B",
    explanation: "Volume of a hemisphere = (2/3)πr³ = (2/3) × π × 6³ = (2/3) × π × 216 = 144π cm³."
  },
  {
    id: 75,
    question: "The length of each of two tangents drawn from an external point to a circle is 15 cm. What is the distance from the external point to the center of the circle, if the radius is 8 cm?",
    options: { A: "12 cm", B: "15 cm", C: "17 cm", D: "23 cm" },
    correct: "C",
    explanation: "A tangent is perpendicular to the circle's radius at the point of contact, forming a right-angled triangle. By Pythagoras theorem, distance to center = √(tangent² + radius²) = √(15² + 8²) = √289 = 17 cm."
  },
  {
    id: 76,
    question: "Choose the correct meaning of the idiom: Hoist with one's own petard",
    options: {
      A: "To rise unexpectedly",
      B: "To gain fame unfairly",
      C: "To be ruined by one’s own device",
      D: "To be praised excessively"
    },
    correct: "C",
    explanation: "The Shakespearean idiom 'hoist with one's own petard' means to fall into a trap that one had set for someone else, or to be harmed/ruined by one's own scheming."
  },
  {
    id: 77,
    question: "Select the correct spelling of a word meaning ‘a person who avoids work or effort’.",
    options: { A: "Sluggard", B: "Sluggurd", C: "Sluggared", D: "Slugard" },
    correct: "A",
    explanation: "'Sluggard' is the correctly spelled English word referring to a habitually lazy, idle, or inactive person."
  },
  {
    id: 78,
    question: "Select the most appropriate antonym of the given word: Refulgent",
    options: { A: "Radiant", B: "Gleaming", C: "Dull", D: "Shining" },
    correct: "C",
    explanation: "'Refulgent' means shining brightly, radiant, or resplendent. Its direct antonym (opposite in meaning) is 'Dull' or dark."
  },
  {
    id: 79,
    question: "Choose the correct semantic fit:\nThe regulatory intervention was regarded as a ______ to escalating hostilities between the rival factions.",
    options: { A: "deterrent", B: "detraction", C: "detention", D: "deviation" },
    correct: "A",
    explanation: "A 'deterrent' is a preventative factor or action designed to discourage or hinder escalating conflict or unwanted behavior."
  },
  {
    id: 80,
    question: "Find the part of the sentence that contains an error:\nNo sooner had the policy been announced (1)/ when the opposition not only criticized it (2)/ but also (3)/ demanded its immediate withdrawal. (4)",
    options: { A: "(1)", B: "(2)", C: "(3)", D: "(4)" },
    correct: "B",
    explanation: "According to standard English grammar rules, the correlative conjunction 'No sooner' must always be paired with 'than' (not 'when'). Therefore, part (2) contains the grammatical error."
  },
  {
    id: 81,
    question: "Convert the sentence provided below from its passive voice structure to an active voice structure:\nThe amendments are believed to have been approved by the regulatory authority last quarter.",
    options: {
      A: "The regulatory authority approved the amendments last quarter.",
      B: "The amendments were approved last quarter.",
      C: "The regulatory authority is believed to have approved the amendments last quarter.",
      D: "The regulatory authority has approved the amendments last quarter."
    },
    correct: "C",
    explanation: "Transforming the infinitive clause 'to have been approved by the regulatory authority' into active voice makes 'the regulatory authority' the subject of the infinitive clause: 'The regulatory authority is believed to have approved the amendments last quarter.'"
  },
  {
    id: 82,
    question: `${passageRC}<br><br>What central idea does the passage emphasize about authority and legitimacy?`,
    options: {
      A: "Authority always guarantees legitimacy",
      B: "They are distinct and not always aligned",
      C: "Legitimacy is legally enforced",
      D: "Authority replaces ethical standards"
    },
    correct: "B",
    explanation: "The passage explicitly notes that authority and legitimacy operate within distinct philosophical frameworks and highlights historical instances where lawful authority lacked moral legitimacy."
  },
  {
    id: 83,
    question: `${passageRC}<br><br>Why does the author refer to reform movements lacking formal authority?`,
    options: {
      A: "To criticize constitutional systems",
      B: "To illustrate authority’s permanence",
      C: "To demonstrate legitimacy emerging without official power",
      D: "To argue against democratic governance"
    },
    correct: "C",
    explanation: "The passage cites reform movements acquiring moral endorsement to demonstrate how social legitimacy can develop independently without official government power or formal legal authority."
  },
  {
    id: 84,
    question: `${passageRC}<br><br>What risk does the passage associate with conflating authority and legitimacy?`,
    options: {
      A: "Institutional growth",
      B: "Administrative efficiency",
      C: "Suppression of dissent",
      D: "Economic stagnation"
    },
    correct: "C",
    explanation: "The author warns that if authority enforces a singular conception of legitimacy, it risks suppressing public dissent and eroding institutional neutrality."
  },
  {
    id: 85,
    question: `${passageRC}<br><br>What contemporary issue does the passage cite to highlight the authority–legitimacy tension?`,
    options: {
      A: "Agricultural reforms",
      B: "Electoral funding",
      C: "Digital governance and surveillance",
      D: "Maritime trade policies"
    },
    correct: "C",
    explanation: "The passage specifically cites contemporary debates surrounding 'surveillance, digital governance, and environmental regulation' as illuminating modern tensions between legal authority and ethical legitimacy."
  },
  {
    id: 86,
    question: `${passageRC}<br><br>What is the author’s ultimate recommendation?`,
    options: {
      A: "Authority should override legitimacy",
      B: "Legitimacy must reject authority",
      C: "Authority and legitimacy must be harmonized",
      D: "Citizens should disengage from governance"
    },
    correct: "C",
    explanation: "In the final concluding sentence, the author argues that a resilient political system must harmonize institutional authority with evolving standards of societal legitimacy."
  },
  {
    id: 87,
    question: "Rearrange the following sentences to form a coherent paragraph:\n1. This mechanism, integral to ecological balance, ensures nutrient recycling within ecosystems.\n2. Decomposers break down organic matter into simpler substances.\n3. These substances enrich the soil, promoting plant growth.\n4. Over time, accumulated biomass undergoes gradual decomposition.",
    options: { A: "4, 2, 3, 1", B: "2, 3, 4, 1", C: "1, 4, 2, 3", D: "3, 2, 4, 1" },
    correct: "A",
    explanation: "Sentence 4 sets the context (biomass undergoes decomposition). Sentence 2 explains the actors involved (decomposers break it down). Sentence 3 states the direct effect (enriching soil). Sentence 1 concludes by summarizing the overall ecological importance of this mechanism. Order: 4, 2, 3, 1."
  },
  {
    id: 88,
    question: "Choose the correct one-word substitute for: ‘A system of governance in which rulers exploit public wealth for personal gain’.",
    options: { A: "Plutocracy", B: "Autocracy", C: "Kleptocracy", D: "Bureaucracy" },
    correct: "C",
    explanation: "'Kleptocracy' (literally rule by thieves) refers to a corrupt system of governance where leaders exploit national wealth and resources for their own personal enrichment."
  },
  {
    id: 89,
    question: "Choose the option that most accurately conveys the sentence in indirect speech:\nShe said, \"Where have you kept the confidential files?\"",
    options: {
      A: "She asked where I had kept the confidential files.",
      B: "She asked where had I kept the confidential files.",
      C: "She said where I have kept the confidential files.",
      D: "She questioned where did I keep the confidential files."
    },
    correct: "A",
    explanation: "In indirect speech for interrogative sentences, the question changes to declarative word order (subject before verb), and the present perfect tense ('have kept') shifts to past perfect ('had kept'). Thus: She asked where I had kept the confidential files."
  },
  {
    id: 90,
    question: "Rearrange the following sentences in correct order to make a logical passage:\n1. This necessitates strategic planning and institutional coherence.\n2. Policy reform frequently encounters bureaucratic inertia.\n3. Transparent dialogue can mitigate resistance and foster cooperation.\n4. Nevertheless, reform remains essential for systemic advancement.",
    options: { A: "2-4-1-3", B: "4-2-1-3", C: "3-1-2-4", D: "1-3-2-4" },
    correct: "A",
    explanation: "Sentence 2 introduces the problem (reform encounters inertia). Sentence 4 contrasts it with importance (nevertheless, reform is essential). Sentence 1 states what is needed (necessitates planning). Sentence 3 offers a practical solution (transparent dialogue can mitigate resistance). Order: 2-4-1-3."
  },
  {
    id: 91,
    question: "Change the following from active to passive voice:\nThe committee might have revised the regulatory framework during the session.",
    options: {
      A: "The regulatory framework might revise by the committee during the session.",
      B: "The regulatory framework might be revised by the committee during the session.",
      C: "The regulatory framework might have been revised by the committee during the session.",
      D: "The regulatory framework has been revised by the committee during the session."
    },
    correct: "C",
    explanation: "The passive transformation of the modal perfect structure 'might have revised' is 'might have been revised'. Thus: The regulatory framework might have been revised by the committee during the session."
  },
  {
    id: 92,
    question: "Choose the option that accurately conveys the sentence in direct speech:\nThe consultant remarked that had the audit been conducted earlier, the discrepancies would have been detected.",
    options: {
      A: "\"If the audit was conducted earlier, the discrepancies would have been detected,\" said the consultant.",
      B: "\"If only the audit had been conducted earlier, the discrepancies were detected,\" he said.",
      C: "\"Had the audit been conducted earlier, the discrepancies would have been detected,\" said the consultant.",
      D: "\"Had we conduct the audit earlier, the discrepancies would be detected,\" said the consultant."
    },
    correct: "C",
    explanation: "Direct speech accurately preserves the third conditional inversion structure used by the speaker: \"Had the audit been conducted earlier, the discrepancies would have been detected,\" said the consultant."
  },
  {
    id: 93,
    question: "Choose the correct one-word substitution for: ‘A person who pretends to be someone else in order to deceive others’.",
    options: { A: "Mimic", B: "Actor", C: "Impostor", D: "Spectator" },
    correct: "C",
    explanation: "An 'impostor' is defined as a person who assumes a false identity or title with the intention of deceiving or defrauding others."
  },
  {
    id: 94,
    question: "Choose the option that conveys the sentence in indirect speech:\nHe said, \"Water boils at one hundred degrees Celsius.\"",
    options: {
      A: "He said that water boiled at one hundred degrees Celsius.",
      B: "He said that water boils at one hundred degrees Celsius.",
      C: "He said that water had boiled at one hundred degrees Celsius.",
      D: "He said that water has boiled at one hundred degrees Celsius."
    },
    correct: "B",
    explanation: "Universal scientific facts and general laws of nature do not undergo a tense shift when converted into indirect speech. Therefore, 'boils' remains in the simple present tense."
  },
  {
    id: 95,
    question: "Choose the most suitable preposition to replace the highlighted part:\nThe committee has been reviewing the draft policy since four days.",
    options: { A: "from four days", B: "by four days", C: "for four days", D: "since four day" },
    correct: "C",
    explanation: "In present perfect continuous constructions, 'for' is used to denote a specific duration or length of time ('for four days'), whereas 'since' is used to denote a specific starting point in time (e.g., 'since Monday')."
  },
  {
    id: 96,
    question: "Which of these is the correct spelling of a philosophical theory centered on utility and maximizing consequences?",
    options: { A: "Utilitarianism", B: "Utiliterianism", C: "Utilitarionism", D: "Utillitarianism" },
    correct: "A",
    explanation: "'Utilitarianism' is the correctly spelled normative ethical theory advocating actions that maximize overall happiness and utility."
  },
  {
    id: 97,
    question: "Select the most appropriate synonym of the given word: FELICITOUS",
    options: { A: "Inappropriate", B: "Awkward", C: "Incongruous", D: "Suitable" },
    correct: "D",
    explanation: "'Felicitous' means well-chosen, highly pleasing, apt, or suited to the circumstances. Its synonym is 'Suitable'."
  },
  {
    id: 98,
    question: "Select the most appropriate synonym of the given word: DILATORY",
    options: { A: "Sluggish", B: "Immediate", C: "Active", D: "Resolute" },
    correct: "A",
    explanation: "'Dilatory' describes someone or something slow to act, intended to cause delay, or procrastinating. Its synonym is 'Sluggish'."
  },
  {
    id: 99,
    question: "Find the part of the sentence that contains an error:\nShe delivered (1)/ a comprehensive overview of the proposal (2)/ but failed to substantiate her claims (3)/ with sufficient evidences. (4)",
    options: { A: "(1)", B: "(2)", C: "(3)", D: "(4)" },
    correct: "D",
    explanation: "In English grammar, 'evidence' is an uncountable noun and does not take a plural '-s' form ('evidences'). Part (4) is grammatical incorrect."
  },
  {
    id: 100,
    question: "Select the sentence containing the homonym of the highlighted word in:\n'The basilica dominates the skyline with its ornate domes.'",
    options: {
      A: "The historian studied the architecture of the ancient basilica.",
      B: "Tourists gathered inside the grand basilica at sunset.",
      C: "The chef garnished the dish with freshly chopped basilica leaves.",
      D: "The choir performed hymns within the basilica hall."
    },
    correct: "C",
    explanation: "In the reference sentence, 'basilica' refers to a grand architectural church building. In option C, 'basilica' refers to basil (the culinary herb, historically referred to as basilica), representing a homonym/homograph wordplay."
  }
];

async function runImport() {
  console.log("Starting import for SSC CGL 2025 - 22...");

  // Save local JSON backup
  fs.writeFileSync('ssc_cgl_2025_22.json', JSON.stringify({
    title: "SSC CGL 2025 - 22",
    category: "SSC CGL",
    questions: rawQuestions
  }, null, 2));
  console.log("Saved local backup to ssc_cgl_2025_22.json");

  // Insert quiz into Supabase
  const { data: quizData, error: quizError } = await supabase.from('quizzes').insert([{
    title: "SSC CGL 2025 - 22",
    category: "SSC CGL",
    difficulty: "moderate",
    time_limit: 60,
    pass_percent: 50,
    show_explanation: "after_quiz",
    status: "Published"
  }]).select();

  if (quizError) {
    console.error("Error inserting quiz:", quizError);
    process.exit(1);
  }

  const quizId = quizData[0].id;
  console.log(`Created Quiz in Supabase with ID: ${quizId}`);

  // Prepare question rows
  const questionRows = rawQuestions.map(q => ({
    quiz_id: quizId,
    question_text: q.question,
    option_a: q.options.A,
    option_b: q.options.B,
    option_c: q.options.C,
    option_d: q.options.D,
    correct_option: q.correct,
    explanation: q.explanation,
    difficulty: "moderate"
  }));

  const { error: qError } = await supabase.from('questions').insert(questionRows);

  if (qError) {
    console.error("Error inserting questions:", qError);
    process.exit(1);
  }

  console.log("Successfully imported all 100 questions into Supabase!");
}

runImport();
