const supabase = require('./database');

async function seedCompanies() {
  console.log("Starting universal placement seeding for all Drive companies...");
  
  const companies = [
    {
      name: "AMCAT",
      tracks: [
        { cat: "AMCAT - AMCAT Papers", title: "AMCAT Employability Test Series - Set 1", time: 45, isQB: false },
        { cat: "AMCAT - AMCAT Papers", title: "AMCAT Employability Test Series - Set 2", time: 45, isQB: false },
        { cat: "AMCAT - AMCAT Question Bank", title: "AMCAT Automata & Aptitude Question Bank", time: 30, isQB: true },
        { cat: "AMCAT - Quantitative Aptitude", title: "AMCAT Arithmetic & Algebra Practice", time: 30, isQB: false }
      ]
    },
    {
      name: "CoCubes",
      tracks: [
        { cat: "CoCubes - CoCubes Papers", title: "CoCubes Pre-Assessed Test - Paper I", time: 60, isQB: false },
        { cat: "CoCubes - CoCubes Papers", title: "CoCubes Pre-Assessed Test - Paper II", time: 60, isQB: false },
        { cat: "CoCubes - CoCubes Question Bank", title: "CoCubes Complete Aptitude Question Bank", time: 30, isQB: true }
      ]
    },
    {
      name: "eLitmus",
      tracks: [
        { cat: "eLitmus - eLitmus Papers", title: "eLitmus pH Test - Advanced Aptitude Set 1", time: 60, isQB: false },
        { cat: "eLitmus - eLitmus Question Bank", title: "eLitmus Cryptarithm & Puzzles Question Bank", time: 40, isQB: true },
        { cat: "eLitmus - Logical Reasoning", title: "eLitmus High-Level Reasoning Practice", time: 45, isQB: false }
      ]
    },
    {
      name: "Infosys",
      tracks: [
        { cat: "Infosys - Infosys Papers", title: "Infosys Specialist Programmer & System Eng Paper", time: 50, isQB: false },
        { cat: "Infosys - Infosys Papers", title: "Infosys Placement Test Series - Mock 1", time: 40, isQB: false },
        { cat: "Infosys - Infosys Question Bank", title: "Infosys Mathematical Reasoning Question Bank", time: 30, isQB: true },
        { cat: "Infosys - Logical Reasoning", title: "Infosys Crypto & Syllogism Test", time: 30, isQB: false }
      ]
    },
    {
      name: "Wipro",
      tracks: [
        { cat: "Wipro - Wipro Papers", title: "Wipro NLTH / Elite Placement Paper 1", time: 45, isQB: false },
        { cat: "Wipro - Wipro Papers", title: "Wipro Turbo Technical & Aptitude Paper", time: 50, isQB: false },
        { cat: "Wipro - Wipro Question Bank", title: "Wipro Essay Writing & Verbal Question Bank", time: 30, isQB: true }
      ]
    },
    {
      name: "Cognizant",
      tracks: [
        { cat: "Cognizant - Cognizant Papers", title: "Cognizant GenC & GenC Next Paper I", time: 50, isQB: false },
        { cat: "Cognizant - Cognizant Question Bank", title: "Cognizant Automata Fix & Aptitude Bank", time: 30, isQB: true },
        { cat: "Cognizant - Verbal Ability", title: "Cognizant English Comprehension Test", time: 25, isQB: false }
      ]
    },
    {
      name: "Capgemini",
      tracks: [
        { cat: "Capgemini - Capgemini Papers", title: "Capgemini Analyst & Exceller Test Paper 1", time: 50, isQB: false },
        { cat: "Capgemini - Capgemini Question Bank", title: "Capgemini Game-Based Aptitude Question Bank", time: 30, isQB: true }
      ]
    },
    {
      name: "Deloitte",
      tracks: [
        { cat: "Deloitte - Deloitte Papers", title: "Deloitte NLA (National Level Assessment) Paper 1", time: 45, isQB: false },
        { cat: "Deloitte - Deloitte Question Bank", title: "Deloitte Logical & Business Aptitude Bank", time: 30, isQB: true }
      ]
    },
    {
      name: "Tech Mahindra",
      tracks: [
        { cat: "Tech Mahindra - Tech Mahindra Papers", title: "Tech Mahindra Placement Paper Series 1", time: 40, isQB: false },
        { cat: "Tech Mahindra - Tech Mahindra Question Bank", title: "Tech Mahindra Aptitude & Verbal Bank", time: 30, isQB: true }
      ]
    },
    {
      name: "HCLTech",
      tracks: [
        { cat: "HCLTech - HCLTech Papers", title: "HCLTech First Careers Placement Paper 1", time: 45, isQB: false },
        { cat: "HCLTech - HCLTech Question Bank", title: "HCLTech Technical & Aptitude Question Bank", time: 30, isQB: true }
      ]
    },
    {
      name: "Dell",
      tracks: [
        { cat: "Dell - Dell Papers", title: "Dell Technologies Placement Assessment 1", time: 50, isQB: false },
        { cat: "Dell - Dell Question Bank", title: "Dell IT & Engineering Question Bank", time: 30, isQB: true }
      ]
    },
    {
      name: "EPAM",
      tracks: [
        { cat: "EPAM - EPAM Papers", title: "EPAM Systems Junior Engineer Assessment 1", time: 60, isQB: false },
        { cat: "EPAM - EPAM Question Bank", title: "EPAM Java & DSA Aptitude Question Bank", time: 35, isQB: true }
      ]
    },
    {
      name: "IBM",
      tracks: [
        { cat: "IBM - IBM Papers", title: "IBM Cognitive Ability Assessment Paper 1", time: 45, isQB: false },
        { cat: "IBM - IBM Question Bank", title: "IBM Number Series & Grid Puzzles Bank", time: 30, isQB: true }
      ]
    }
  ];

  const sampleQuestions = [
    {
      q: "If the sum of two numbers is 55 and the H.C.F. and L.C.M. of these numbers are 5 and 120 respectively, then the sum of the reciprocals of the numbers is equal to:",
      a: "11/120", b: "55/600", c: "601/120", d: "12/55",
      ans: "A", exp: "Let the numbers be a and b. Then, a + b = 55 and ab = 5 * 120 = 600. The required sum = (1/a + 1/b) = (a + b)/ab = 55/600 = 11/120."
    },
    {
      q: "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How will 'MEDICINE' be written in that code language?",
      a: "EOJDJEFM", b: "EOJDEJFM", c: "MFEJDJOE", d: "EOJDJFEM",
      ans: "D", exp: "The letters of the word are written in reverse order and then each letter is moved one step forward to obtain the code."
    },
    {
      q: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
      a: "120 metres", b: "150 metres", c: "180 metres", d: "324 metres",
      ans: "B", exp: "Speed = (60 * 5/18) m/sec = (50/3) m/sec. Length of train = (Speed * Time) = (50/3 * 9) = 150 metres."
    },
    {
      q: "Which of the following data structures is most suitable for implementing a priority queue?",
      a: "Array", b: "Linked List", c: "Heap", d: "Stack",
      ans: "C", exp: "A heap (specifically a Binary Heap) allows O(log n) insertion and O(log n) deletion of the highest/lowest priority element, making it ideal for priority queues."
    },
    {
      q: "Choose the word which is most nearly the OPPOSITE in meaning to the word: 'METICULOUS'",
      a: "Careful", b: "Sloppy", c: "Accurate", d: "Methodical",
      ans: "B", exp: "'Meticulous' means showing great attention to detail; very careful and precise. 'Sloppy' is the exact opposite."
    },
    {
      q: "If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?",
      a: "Brother", b: "Sister", c: "Nephew", d: "Cannot be determined",
      ans: "D", exp: "The gender of D is not mentioned. Hence, D can be either Nephew or Niece of A."
    },
    {
      q: "What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?",
      a: "O(1)", b: "O(n)", c: "O(log n)", d: "O(n log n)",
      ans: "C", exp: "In a balanced BST like AVL or Red-Black tree, the height is bounded by O(log n), so search takes O(log n) time."
    },
    {
      q: "A bag contains 6 black and 8 white balls. One ball is drawn at random. What is the probability that the ball drawn is white?",
      a: "3/4", b: "4/7", c: "1/8", d: "3/7",
      ans: "B", exp: "Total number of balls = (6 + 8) = 14. Number of white balls = 8. P(getting a white ball) = 8/14 = 4/7."
    },
    {
      q: "Identify the correct SQL statement to select all records from a table named 'Employees' where the 'Salary' is greater than 50000.",
      a: "SELECT * FROM Employees WHERE Salary > 50000;", b: "GET * FROM Employees IF Salary > 50000;", c: "EXTRACT * FROM Employees WHERE Salary > 50000;", d: "FETCH FROM Employees WHERE Salary > 50000;",
      ans: "A", exp: "The standard SQL syntax for filtering records is SELECT * FROM table_name WHERE condition;"
    },
    {
      q: "In Object-Oriented Programming, which concept refers to wrapping data and methods into a single unit and restricting direct access to some of the object's components?",
      a: "Polymorphism", b: "Inheritance", c: "Encapsulation", d: "Abstraction",
      ans: "C", exp: "Encapsulation is the bundling of data and the methods that operate on that data within a single unit or class, hiding internal details."
    }
  ];

  let totalQuizzes = 0;
  let totalQuestions = 0;

  for (const comp of companies) {
    console.log(`\nSeeding modules for [${comp.name}]...`);
    for (const track of comp.tracks) {
      // Check if already exists
      const { data: existing } = await supabase.from('quizzes').select('id').eq('title', track.title).single();
      if (existing) {
        console.log(` -> [${track.title}] already exists, skipping.`);
        continue;
      }

      const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
        title: track.title,
        category: track.cat,
        difficulty: 'moderate',
        time_limit: track.time,
        pass_percent: 60,
        show_explanation: 'after_quiz',
        status: 'Live'
      }).select().single();

      if (quizErr) {
        console.error(`Error inserting quiz [${track.title}]:`, quizErr.message);
        continue;
      }
      totalQuizzes++;

      // Insert 10 sample questions per module
      const qsToInsert = sampleQuestions.map((q, idx) => ({
        quiz_id: quiz.id,
        question_text: `${q.q} [${comp.name} Practice Q${idx+1}]`,
        option_a: q.a,
        option_b: q.b,
        option_c: q.c,
        option_d: q.d,
        correct_option: q.ans,
        explanation: q.exp,
        difficulty: 'moderate'
      }));

      const { error: qErr } = await supabase.from('questions').insert(qsToInsert);
      if (qErr) {
        console.error(`Error inserting questions for [${track.title}]:`, qErr.message);
      } else {
        totalQuestions += qsToInsert.length;
        console.log(` -> Created [${track.title}] with ${qsToInsert.length} questions.`);
      }
    }
  }

  console.log(`\n🎉 Finished seeding! Added ${totalQuizzes} new placement modules and ${totalQuestions} questions across 13 companies!`);
}

seedCompanies();
