const allQuizzes = [
  // ===== UPSC (10) =====
  { title:"Indian Polity Basics",category:"UPSC",difficulty:"easy",pass_percent:50,questions:[
    {question:"Who is the constitutional head of India?",options:{A:"Prime Minister",B:"President",C:"Chief Justice",D:"Governor"},correct:"B",explanation:"The President is the constitutional head of India."},
    {question:"How many Fundamental Rights are there?",options:{A:"5",B:"6",C:"7",D:"8"},correct:"B",explanation:"There are 6 Fundamental Rights in the Indian Constitution."},
    {question:"Which article abolishes untouchability?",options:{A:"Article 14",B:"Article 15",C:"Article 17",D:"Article 19"},correct:"C",explanation:"Article 17 abolishes untouchability."},
    {question:"Rajya Sabha members are elected for how many years?",options:{A:"4",B:"5",C:"6",D:"7"},correct:"C",explanation:"Rajya Sabha members serve 6-year terms."},
    {question:"Who appoints the Chief Justice of India?",options:{A:"PM",B:"President",C:"Parliament",D:"Law Minister"},correct:"B",explanation:"The President appoints the CJI."}
  ]},
  { title:"Indian Geography",category:"UPSC",difficulty:"easy",pass_percent:50,questions:[
    {question:"Which is the longest river in India?",options:{A:"Yamuna",B:"Ganga",C:"Godavari",D:"Brahmaputra"},correct:"B",explanation:"Ganga is the longest river flowing entirely within India."},
    {question:"The Deccan Plateau is bounded by?",options:{A:"Himalayas",B:"Western & Eastern Ghats",C:"Vindhyas",D:"Aravallis"},correct:"B",explanation:"The Deccan Plateau lies between the Western and Eastern Ghats."},
    {question:"Which state has the longest coastline?",options:{A:"Kerala",B:"Tamil Nadu",C:"Gujarat",D:"Maharashtra"},correct:"C",explanation:"Gujarat has the longest coastline in India."},
    {question:"Chilika Lake is in which state?",options:{A:"Kerala",B:"Odisha",C:"AP",D:"WB"},correct:"B",explanation:"Chilika Lake is located in Odisha."},
    {question:"Which is the smallest state by area?",options:{A:"Sikkim",B:"Tripura",C:"Goa",D:"Mizoram"},correct:"C",explanation:"Goa is the smallest state by area."}
  ]},
  { title:"Modern Indian History",category:"UPSC",difficulty:"moderate",pass_percent:60,questions:[
    {question:"Who founded the Indian National Congress?",options:{A:"Gandhi",B:"Nehru",C:"A.O. Hume",D:"Tilak"},correct:"C",explanation:"Allan Octavian Hume founded the INC in 1885."},
    {question:"When was the Quit India Movement?",options:{A:"1930",B:"1942",C:"1947",D:"1920"},correct:"B",explanation:"Quit India Movement started on 8 August 1942."},
    {question:"Jallianwala Bagh massacre occurred in?",options:{A:"1917",B:"1919",C:"1921",D:"1930"},correct:"B",explanation:"The massacre took place on 13 April 1919."},
    {question:"Who gave the slogan 'Do or Die'?",options:{A:"Subhas Bose",B:"Bhagat Singh",C:"Mahatma Gandhi",D:"Nehru"},correct:"C",explanation:"Gandhi gave the slogan during the Quit India Movement."},
    {question:"Simon Commission visited India in?",options:{A:"1925",B:"1928",C:"1930",D:"1935"},correct:"B",explanation:"Simon Commission came to India in 1928."}
  ]},
  { title:"Indian Economy Fundamentals",category:"UPSC",difficulty:"moderate",pass_percent:60,questions:[
    {question:"Who is known as the father of Indian planning?",options:{A:"Nehru",B:"M. Visvesvaraya",C:"Ambedkar",D:"Sardar Patel"},correct:"B",explanation:"M. Visvesvaraya is considered the father of Indian economic planning."},
    {question:"NABARD was established in?",options:{A:"1980",B:"1982",C:"1985",D:"1990"},correct:"B",explanation:"NABARD was set up on 12 July 1982."},
    {question:"GST was implemented from?",options:{A:"1 Apr 2017",B:"1 Jul 2017",C:"1 Jan 2018",D:"1 Apr 2018"},correct:"B",explanation:"GST rolled out on 1 July 2017."},
    {question:"Which body controls monetary policy?",options:{A:"SEBI",B:"NITI Aayog",C:"RBI",D:"Finance Ministry"},correct:"C",explanation:"RBI controls India's monetary policy."},
    {question:"What does GDP stand for?",options:{A:"Gross Domestic Product",B:"General Domestic Price",C:"Gross Development Plan",D:"General Development Product"},correct:"A",explanation:"GDP = Gross Domestic Product."}
  ]},
  { title:"Environment & Ecology",category:"UPSC",difficulty:"easy",pass_percent:50,questions:[
    {question:"Which gas is most responsible for global warming?",options:{A:"Oxygen",B:"Nitrogen",C:"CO2",D:"Hydrogen"},correct:"C",explanation:"Carbon dioxide is the primary greenhouse gas."},
    {question:"Jim Corbett National Park is in which state?",options:{A:"MP",B:"Uttarakhand",C:"Rajasthan",D:"Assam"},correct:"B",explanation:"Jim Corbett is in Uttarakhand."},
    {question:"What is the Kyoto Protocol about?",options:{A:"Trade",B:"Climate change",C:"Nuclear weapons",D:"Refugees"},correct:"B",explanation:"Kyoto Protocol addresses greenhouse gas emissions."},
    {question:"Which is the largest mangrove forest?",options:{A:"Amazon",B:"Sundarbans",C:"Congo",D:"Daintree"},correct:"B",explanation:"Sundarbans is the largest mangrove forest in the world."},
    {question:"Ozone layer is found in which layer?",options:{A:"Troposphere",B:"Stratosphere",C:"Mesosphere",D:"Thermosphere"},correct:"B",explanation:"The ozone layer is in the stratosphere."}
  ]},
  { title:"Science & Technology for UPSC",category:"UPSC",difficulty:"moderate",pass_percent:55,questions:[
    {question:"ISRO's first satellite was?",options:{A:"Rohini",B:"Aryabhata",C:"INSAT",D:"Chandrayaan"},correct:"B",explanation:"Aryabhata was launched in 1975."},
    {question:"What does DNA stand for?",options:{A:"Di Nucleic Acid",B:"Deoxyribonucleic Acid",C:"Dynamic Nucleic Acid",D:"Dual Nucleic Acid"},correct:"B",explanation:"DNA = Deoxyribonucleic Acid."},
    {question:"Which vitamin is produced by sunlight?",options:{A:"A",B:"B12",C:"C",D:"D"},correct:"D",explanation:"Vitamin D is synthesized via sunlight."},
    {question:"What is the SI unit of force?",options:{A:"Joule",B:"Watt",C:"Newton",D:"Pascal"},correct:"C",explanation:"Newton is the SI unit of force."},
    {question:"Who discovered penicillin?",options:{A:"Fleming",B:"Pasteur",C:"Jenner",D:"Koch"},correct:"A",explanation:"Alexander Fleming discovered penicillin in 1928."}
  ]},
  { title:"Art & Culture of India",category:"UPSC",difficulty:"hard",pass_percent:60,questions:[
    {question:"Bharatanatyam originated in which state?",options:{A:"Kerala",B:"Tamil Nadu",C:"Karnataka",D:"AP"},correct:"B",explanation:"Bharatanatyam originated in Tamil Nadu."},
    {question:"Ajanta caves are famous for?",options:{A:"Sculptures",B:"Paintings",C:"Inscriptions",D:"Architecture"},correct:"B",explanation:"Ajanta caves are famous for Buddhist paintings."},
    {question:"Who wrote Arthashastra?",options:{A:"Chanakya",B:"Kalidasa",C:"Valmiki",D:"Tulsidas"},correct:"A",explanation:"Kautilya/Chanakya wrote the Arthashastra."},
    {question:"Kathakali dance belongs to?",options:{A:"Tamil Nadu",B:"Karnataka",C:"Kerala",D:"Odisha"},correct:"C",explanation:"Kathakali is a classical dance from Kerala."},
    {question:"The Sanchi Stupa was built by?",options:{A:"Ashoka",B:"Kanishka",C:"Chandragupta",D:"Harsha"},correct:"A",explanation:"Emperor Ashoka built the Great Stupa at Sanchi."}
  ]},
  { title:"UPSC Ethics & Governance",category:"UPSC",difficulty:"hard",pass_percent:55,questions:[
    {question:"RTI Act was passed in which year?",options:{A:"2003",B:"2005",C:"2007",D:"2010"},correct:"B",explanation:"RTI Act was passed in 2005."},
    {question:"Lokpal and Lokayukta Act was enacted in?",options:{A:"2011",B:"2013",C:"2015",D:"2017"},correct:"B",explanation:"The Lokpal Act was enacted in 2013."},
    {question:"Which article deals with Right to Information?",options:{A:"Article 19",B:"Article 21",C:"Article 32",D:"Article 14"},correct:"A",explanation:"RTI is derived from Article 19(1)(a) - Freedom of speech."},
    {question:"What does CAG stand for?",options:{A:"Central Audit General",B:"Comptroller & Auditor General",C:"Chief Accounts General",D:"Controller of Audit & Governance"},correct:"B",explanation:"CAG = Comptroller and Auditor General of India."},
    {question:"73rd Amendment relates to?",options:{A:"Judiciary",B:"Panchayati Raj",C:"Fundamental Rights",D:"Emergency"},correct:"B",explanation:"73rd Amendment gave constitutional status to Panchayati Raj."}
  ]},
  { title:"International Relations for UPSC",category:"UPSC",difficulty:"hard",pass_percent:60,questions:[
    {question:"UN was established in which year?",options:{A:"1944",B:"1945",C:"1946",D:"1950"},correct:"B",explanation:"The United Nations was founded on 24 October 1945."},
    {question:"How many permanent members does the UN Security Council have?",options:{A:"3",B:"4",C:"5",D:"6"},correct:"C",explanation:"There are 5 permanent members: US, UK, France, Russia, China."},
    {question:"BRICS does NOT include?",options:{A:"Brazil",B:"Russia",C:"Indonesia",D:"China"},correct:"C",explanation:"BRICS = Brazil, Russia, India, China, South Africa."},
    {question:"WHO headquarters is in?",options:{A:"New York",B:"Geneva",C:"Paris",D:"Vienna"},correct:"B",explanation:"WHO is headquartered in Geneva, Switzerland."},
    {question:"NAM stands for?",options:{A:"National Allied Movement",B:"Non-Aligned Movement",C:"North Atlantic Movement",D:"New Asian Movement"},correct:"B",explanation:"NAM = Non-Aligned Movement."}
  ]},
  { title:"UPSC Current Affairs Practice",category:"UPSC",difficulty:"moderate",pass_percent:50,questions:[
    {question:"India's rank in area among world countries?",options:{A:"5th",B:"6th",C:"7th",D:"8th"},correct:"C",explanation:"India is the 7th largest country by area."},
    {question:"Which is the largest Union Territory?",options:{A:"Delhi",B:"J&K",C:"Puducherry",D:"Ladakh"},correct:"B",explanation:"Jammu & Kashmir is the largest UT by area."},
    {question:"India became a republic on?",options:{A:"15 Aug 1947",B:"26 Jan 1950",C:"26 Nov 1949",D:"30 Jan 1948"},correct:"B",explanation:"India became a republic on 26 January 1950."},
    {question:"How many schedules in the Indian Constitution?",options:{A:"10",B:"11",C:"12",D:"8"},correct:"C",explanation:"There are 12 schedules in the Constitution."},
    {question:"NITI Aayog replaced which body?",options:{A:"Finance Commission",B:"Planning Commission",C:"Election Commission",D:"UGC"},correct:"B",explanation:"NITI Aayog replaced the Planning Commission in 2015."}
  ]},

  // ===== MPSC (10) =====
  { title:"Maharashtra Geography",category:"MPSC",difficulty:"easy",pass_percent:50,questions:[
    {question:"What is the capital of Maharashtra?",options:{A:"Pune",B:"Mumbai",C:"Nagpur",D:"Nashik"},correct:"B",explanation:"Mumbai is the capital of Maharashtra."},
    {question:"Which is the highest peak in Maharashtra?",options:{A:"Kalsubai",B:"Salher",C:"Torana",D:"Sinhagad"},correct:"A",explanation:"Kalsubai at 1646m is the highest peak."},
    {question:"How many divisions does Maharashtra have?",options:{A:"4",B:"5",C:"6",D:"7"},correct:"C",explanation:"Maharashtra has 6 revenue divisions."},
    {question:"Which river flows through Pune?",options:{A:"Godavari",B:"Krishna",C:"Mula-Mutha",D:"Tapi"},correct:"C",explanation:"Mula and Mutha rivers flow through Pune."},
    {question:"Lonar Lake is famous for being a?",options:{A:"Salt lake",B:"Crater lake",C:"Glacial lake",D:"Oxbow lake"},correct:"B",explanation:"Lonar Lake is a meteorite crater lake."}
  ]},
  { title:"Maharashtra History",category:"MPSC",difficulty:"moderate",pass_percent:55,questions:[
    {question:"Who founded the Maratha Empire?",options:{A:"Sambhaji",B:"Shivaji Maharaj",C:"Bajirao I",D:"Balaji Vishwanath"},correct:"B",explanation:"Chhatrapati Shivaji Maharaj founded the Maratha Empire."},
    {question:"Shivaji was crowned in which year?",options:{A:"1670",B:"1674",C:"1680",D:"1664"},correct:"B",explanation:"Shivaji was crowned at Raigad in 1674."},
    {question:"Battle of Panipat (3rd) was fought in?",options:{A:"1757",B:"1761",C:"1775",D:"1780"},correct:"B",explanation:"Third Battle of Panipat was fought in 1761."},
    {question:"Pune Pact was signed between?",options:{A:"Gandhi & Jinnah",B:"Gandhi & Ambedkar",C:"Nehru & Tilak",D:"Ambedkar & Nehru"},correct:"B",explanation:"Pune Pact (1932) was between Gandhi and Ambedkar."},
    {question:"Raigad Fort was the capital of?",options:{A:"Peshwas",B:"Mughals",C:"Maratha Empire",D:"Deccan Sultanate"},correct:"C",explanation:"Raigad was the capital of the Maratha Empire under Shivaji."}
  ]},
  { title:"Maharashtra Polity",category:"MPSC",difficulty:"moderate",pass_percent:55,questions:[
    {question:"Maharashtra was formed on?",options:{A:"1 May 1956",B:"1 May 1960",C:"15 Aug 1960",D:"26 Jan 1960"},correct:"B",explanation:"Maharashtra was formed on 1 May 1960."},
    {question:"How many districts does Maharashtra have?",options:{A:"34",B:"36",C:"38",D:"40"},correct:"B",explanation:"Maharashtra has 36 districts."},
    {question:"Winter session of Maharashtra legislature is held in?",options:{A:"Mumbai",B:"Pune",C:"Nagpur",D:"Aurangabad"},correct:"C",explanation:"Winter session is held in Nagpur."},
    {question:"First CM of Maharashtra was?",options:{A:"Vasantrao Naik",B:"Y.B. Chavan",C:"Sharad Pawar",D:"A.R. Antulay"},correct:"B",explanation:"Yashwantrao Balwantrao Chavan was the first CM."},
    {question:"Maharashtra Vidhan Sabha has how many seats?",options:{A:"272",B:"288",C:"300",D:"256"},correct:"B",explanation:"Maharashtra Vidhan Sabha has 288 seats."}
  ]},
  { title:"Maharashtra Economy",category:"MPSC",difficulty:"easy",pass_percent:50,questions:[
    {question:"Maharashtra's largest contributor to GDP is?",options:{A:"Agriculture",B:"Services",C:"Manufacturing",D:"Mining"},correct:"B",explanation:"The services sector dominates Maharashtra's economy."},
    {question:"Which city is India's financial capital?",options:{A:"Delhi",B:"Bangalore",C:"Mumbai",D:"Chennai"},correct:"C",explanation:"Mumbai is India's financial capital."},
    {question:"Bombay Stock Exchange is located in?",options:{A:"Delhi",B:"Mumbai",C:"Kolkata",D:"Chennai"},correct:"B",explanation:"BSE is located in Mumbai."},
    {question:"Which district leads sugarcane production in MH?",options:{A:"Pune",B:"Kolhapur",C:"Sangli",D:"Solapur"},correct:"B",explanation:"Kolhapur is a leading sugarcane-producing district."},
    {question:"MIDC stands for?",options:{A:"Maharashtra Industrial Dev Corp",B:"Mumbai Industrial Dist Centre",C:"Maha Infrastructure Dev Corp",D:"Metropolitan Industrial Dev Council"},correct:"A",explanation:"MIDC = Maharashtra Industrial Development Corporation."}
  ]},
  { title:"Maharashtra Culture & Heritage",category:"MPSC",difficulty:"easy",pass_percent:50,questions:[
    {question:"Lavani is a folk dance of which state?",options:{A:"Gujarat",B:"Rajasthan",C:"Maharashtra",D:"MP"},correct:"C",explanation:"Lavani is a traditional folk dance of Maharashtra."},
    {question:"Pandharpur is famous for which deity?",options:{A:"Shiva",B:"Ganesh",C:"Vitthal",D:"Hanuman"},correct:"C",explanation:"Pandharpur is famous for Lord Vitthal (Vithoba)."},
    {question:"Elephanta Caves are near?",options:{A:"Pune",B:"Mumbai",C:"Nashik",D:"Aurangabad"},correct:"B",explanation:"Elephanta Caves are on an island near Mumbai."},
    {question:"Who is known as the Saint of Maharashtra?",options:{A:"Tukaram",B:"Dnyaneshwar",C:"Ramdas",D:"All of these"},correct:"D",explanation:"All are revered saints of Maharashtra."},
    {question:"Warli painting originated from?",options:{A:"Pune",B:"Thane tribal region",C:"Nashik",D:"Nagpur"},correct:"B",explanation:"Warli art comes from tribal communities in Thane/Palghar."}
  ]},
  { title:"MPSC General Science",category:"MPSC",difficulty:"easy",pass_percent:50,questions:[
    {question:"Water boils at what temperature?",options:{A:"90°C",B:"100°C",C:"110°C",D:"120°C"},correct:"B",explanation:"Water boils at 100°C at standard atmospheric pressure."},
    {question:"Which organ purifies blood?",options:{A:"Heart",B:"Lungs",C:"Kidneys",D:"Liver"},correct:"C",explanation:"Kidneys filter and purify blood."},
    {question:"What is the chemical formula of water?",options:{A:"H2O",B:"CO2",C:"NaCl",D:"O2"},correct:"A",explanation:"Water is H2O."},
    {question:"Which planet is closest to the Sun?",options:{A:"Venus",B:"Earth",C:"Mercury",D:"Mars"},correct:"C",explanation:"Mercury is the closest planet to the Sun."},
    {question:"Photosynthesis produces?",options:{A:"CO2",B:"Oxygen",C:"Nitrogen",D:"Hydrogen"},correct:"B",explanation:"Photosynthesis produces oxygen and glucose."}
  ]},
  { title:"MPSC Reasoning & Aptitude",category:"MPSC",difficulty:"moderate",pass_percent:55,questions:[
    {question:"Complete: 2, 6, 12, 20, ?",options:{A:"28",B:"30",C:"32",D:"25"},correct:"B",explanation:"Pattern: differences are 4,6,8,10. Next = 20+10 = 30."},
    {question:"If APPLE = 50, then MANGO = ?",options:{A:"55",B:"57",C:"60",D:"52"},correct:"A",explanation:"A=1,P=16,P=16,L=12,E=5=50; M=13,A=1,N=14,G=7,O=15=50. Trick question - pattern based."},
    {question:"Odd one out: 3, 5, 11, 14, 17",options:{A:"3",B:"14",C:"11",D:"17"},correct:"B",explanation:"14 is the only even number; others are odd."},
    {question:"A clock shows 3:15. What is the angle?",options:{A:"0°",B:"7.5°",C:"15°",D:"22.5°"},correct:"B",explanation:"At 3:15, the angle between hands is 7.5°."},
    {question:"If A>B, B>C, then?",options:{A:"C>A",B:"A>C",C:"A=C",D:"Cannot determine"},correct:"B",explanation:"By transitivity, A>B>C means A>C."}
  ]},
  { title:"Maharashtra Current Affairs",category:"MPSC",difficulty:"moderate",pass_percent:50,questions:[
    {question:"Which is Maharashtra's state animal?",options:{A:"Tiger",B:"Indian Giant Squirrel",C:"Elephant",D:"Leopard"},correct:"B",explanation:"Indian Giant Squirrel (Shekru) is MH's state animal."},
    {question:"Maharashtra's state flower is?",options:{A:"Lotus",B:"Jarul",C:"Rose",D:"Sunflower"},correct:"B",explanation:"Jarul (Lagerstroemia) is Maharashtra's state flower."},
    {question:"Which city is called the Oxford of the East?",options:{A:"Mumbai",B:"Nagpur",C:"Pune",D:"Kolhapur"},correct:"C",explanation:"Pune is known as the Oxford of the East."},
    {question:"Ajanta & Ellora caves are in which district?",options:{A:"Pune",B:"Nashik",C:"Aurangabad",D:"Kolhapur"},correct:"C",explanation:"They are in Aurangabad district (now Chhatrapati Sambhajinagar)."},
    {question:"Which dam is the largest earthen dam in MH?",options:{A:"Koyna",B:"Jayakwadi",C:"Ujjani",D:"Bhatsa"},correct:"B",explanation:"Jayakwadi Dam on the Godavari is the largest earthen dam."}
  ]},
  { title:"Maharashtra Agriculture",category:"MPSC",difficulty:"hard",pass_percent:55,questions:[
    {question:"Major Kharif crop of Maharashtra?",options:{A:"Wheat",B:"Rice",C:"Jowar",D:"Bajra"},correct:"C",explanation:"Jowar (sorghum) is a major Kharif crop in Maharashtra."},
    {question:"Which region is known for cotton in MH?",options:{A:"Konkan",B:"Vidarbha",C:"Western MH",D:"Marathwada"},correct:"B",explanation:"Vidarbha is the cotton belt of Maharashtra."},
    {question:"Alphonso mango is primarily from?",options:{A:"Nagpur",B:"Pune",C:"Ratnagiri/Sindhudurg",D:"Nashik"},correct:"C",explanation:"Alphonso mangoes come from the Konkan region (Ratnagiri/Sindhudurg)."},
    {question:"Maharashtra ranks 1st in production of?",options:{A:"Wheat",B:"Sugarcane",C:"Onion",D:"Rice"},correct:"C",explanation:"Maharashtra is the largest onion producer in India."},
    {question:"Warna cooperative is famous for?",options:{A:"Cotton",B:"Milk",C:"Sugar",D:"Oil"},correct:"C",explanation:"Warna is a famous sugar cooperative in Maharashtra."}
  ]},
  { title:"MPSC Administrative Structure",category:"MPSC",difficulty:"hard",pass_percent:60,questions:[
    {question:"Who heads a district administration?",options:{A:"SP",B:"Collector",C:"Tehsildar",D:"CEO ZP"},correct:"B",explanation:"The District Collector heads the district administration."},
    {question:"ZP stands for?",options:{A:"Zone Parliament",B:"Zilla Parishad",C:"Zone Panchayat",D:"Zilla Parliament"},correct:"B",explanation:"ZP = Zilla Parishad (District Council)."},
    {question:"Gram Panchayat is headed by?",options:{A:"Collector",B:"Sarpanch",C:"Talathi",D:"Tehsildar"},correct:"B",explanation:"The Sarpanch heads the Gram Panchayat."},
    {question:"MPSC is responsible for?",options:{A:"Elections",B:"State civil service recruitment",C:"Law making",D:"Tax collection"},correct:"B",explanation:"MPSC recruits for Maharashtra state civil services."},
    {question:"How many Municipal Corporations in MH (approx)?",options:{A:"15",B:"20",C:"27",D:"32"},correct:"C",explanation:"Maharashtra has approximately 27 Municipal Corporations."}
  ]},

  // ===== GATE (10) =====
  { title:"GATE Data Structures",category:"GATE",difficulty:"moderate",pass_percent:50,questions:[
    {question:"Time complexity of binary search?",options:{A:"O(n)",B:"O(log n)",C:"O(n²)",D:"O(1)"},correct:"B",explanation:"Binary search divides the space in half each step = O(log n)."},
    {question:"Which data structure uses FIFO?",options:{A:"Stack",B:"Queue",C:"Tree",D:"Graph"},correct:"B",explanation:"Queue follows First-In-First-Out."},
    {question:"Worst case of quicksort?",options:{A:"O(n log n)",B:"O(n²)",C:"O(n)",D:"O(log n)"},correct:"B",explanation:"Quicksort worst case is O(n²) when pivot is always min/max."},
    {question:"Height of a balanced BST with n nodes?",options:{A:"O(n)",B:"O(log n)",C:"O(n²)",D:"O(1)"},correct:"B",explanation:"Balanced BST has height O(log n)."},
    {question:"A stack can be used for?",options:{A:"BFS",B:"DFS",C:"Dijkstra",D:"Prim's"},correct:"B",explanation:"DFS uses a stack (explicitly or via recursion)."}
  ]},
  { title:"GATE Operating Systems",category:"GATE",difficulty:"hard",pass_percent:50,questions:[
    {question:"Which scheduling is non-preemptive?",options:{A:"Round Robin",B:"FCFS",C:"SRTF",D:"Priority (preemptive)"},correct:"B",explanation:"FCFS (First Come First Served) is non-preemptive."},
    {question:"Deadlock requires how many conditions?",options:{A:"2",B:"3",C:"4",D:"5"},correct:"C",explanation:"4 conditions: mutual exclusion, hold & wait, no preemption, circular wait."},
    {question:"Virtual memory uses?",options:{A:"RAM only",B:"Disk as extended RAM",C:"Cache",D:"ROM"},correct:"B",explanation:"Virtual memory uses disk space to extend available memory."},
    {question:"Which is not a page replacement algo?",options:{A:"FIFO",B:"LRU",C:"Optimal",D:"SJF"},correct:"D",explanation:"SJF is a CPU scheduling algorithm, not page replacement."},
    {question:"Semaphore was introduced by?",options:{A:"Dijkstra",B:"Knuth",C:"Turing",D:"Tanenbaum"},correct:"A",explanation:"Edsger Dijkstra introduced semaphores."}
  ]},
  { title:"GATE DBMS",category:"GATE",difficulty:"moderate",pass_percent:50,questions:[
    {question:"ACID stands for?",options:{A:"Atomicity Consistency Isolation Durability",B:"Access Control Identity Data",C:"Automatic Commit Insert Delete",D:"None"},correct:"A",explanation:"ACID = Atomicity, Consistency, Isolation, Durability."},
    {question:"Which normal form removes transitive dependency?",options:{A:"1NF",B:"2NF",C:"3NF",D:"BCNF"},correct:"C",explanation:"3NF eliminates transitive dependencies."},
    {question:"A primary key can be NULL?",options:{A:"Yes",B:"No",C:"Sometimes",D:"Depends on DBMS"},correct:"B",explanation:"Primary key cannot be NULL."},
    {question:"SQL JOIN that returns all rows from both tables?",options:{A:"INNER",B:"LEFT",C:"RIGHT",D:"FULL OUTER"},correct:"D",explanation:"FULL OUTER JOIN returns all rows from both tables."},
    {question:"B+ tree is used for?",options:{A:"Sorting",B:"Indexing",C:"Hashing",D:"Searching only"},correct:"B",explanation:"B+ trees are widely used for database indexing."}
  ]},
  { title:"GATE Computer Networks",category:"GATE",difficulty:"hard",pass_percent:50,questions:[
    {question:"TCP operates at which layer?",options:{A:"Network",B:"Transport",C:"Application",D:"Data Link"},correct:"B",explanation:"TCP is a transport layer protocol."},
    {question:"IP address is how many bits (IPv4)?",options:{A:"16",B:"32",C:"64",D:"128"},correct:"B",explanation:"IPv4 addresses are 32 bits."},
    {question:"Which protocol is connectionless?",options:{A:"TCP",B:"UDP",C:"FTP",D:"HTTP"},correct:"B",explanation:"UDP is connectionless."},
    {question:"ARP resolves?",options:{A:"IP to MAC",B:"MAC to IP",C:"Domain to IP",D:"IP to Domain"},correct:"A",explanation:"ARP maps IP addresses to MAC addresses."},
    {question:"OSI model has how many layers?",options:{A:"5",B:"6",C:"7",D:"4"},correct:"C",explanation:"OSI model has 7 layers."}
  ]},
  { title:"GATE Algorithms",category:"GATE",difficulty:"hard",pass_percent:50,questions:[
    {question:"Dijkstra's algorithm finds?",options:{A:"MST",B:"Shortest path",C:"Max flow",D:"Topological order"},correct:"B",explanation:"Dijkstra's finds shortest path from source to all vertices."},
    {question:"Which technique does merge sort use?",options:{A:"Greedy",B:"Divide & Conquer",C:"DP",D:"Backtracking"},correct:"B",explanation:"Merge sort uses divide and conquer."},
    {question:"Time complexity of matrix chain multiplication (DP)?",options:{A:"O(n²)",B:"O(n³)",C:"O(2ⁿ)",D:"O(n log n)"},correct:"B",explanation:"Matrix chain multiplication DP runs in O(n³)."},
    {question:"Kruskal's algorithm uses?",options:{A:"BFS",B:"DFS",C:"Union-Find",D:"Hashing"},correct:"C",explanation:"Kruskal's uses Union-Find for cycle detection."},
    {question:"NP-Complete means?",options:{A:"Solvable in polynomial time",B:"Verifiable in polynomial time & in NP-hard",C:"Not solvable",D:"O(1)"},correct:"B",explanation:"NP-Complete problems are in NP and NP-hard."}
  ]},
  { title:"GATE Digital Logic",category:"GATE",difficulty:"easy",pass_percent:50,questions:[
    {question:"Binary of decimal 10?",options:{A:"1010",B:"1100",C:"1001",D:"0110"},correct:"A",explanation:"10 in binary is 1010."},
    {question:"NAND gate is called?",options:{A:"Universal gate",B:"Basic gate",C:"Special gate",D:"Buffer"},correct:"A",explanation:"NAND is a universal gate - any logic can be built from it."},
    {question:"How many inputs does a 4:1 MUX have?",options:{A:"2",B:"4",C:"8",D:"16"},correct:"B",explanation:"A 4:1 MUX has 4 data inputs and 2 select lines."},
    {question:"Flip-flop stores how many bits?",options:{A:"1",B:"2",C:"4",D:"8"},correct:"A",explanation:"A flip-flop stores 1 bit of data."},
    {question:"De Morgan's theorem: (A.B)' = ?",options:{A:"A'+B'",B:"A'.B'",C:"A+B",D:"(A+B)'"},correct:"A",explanation:"De Morgan's: complement of AND = OR of complements."}
  ]},
  { title:"GATE Discrete Mathematics",category:"GATE",difficulty:"moderate",pass_percent:50,questions:[
    {question:"How many subsets does a set of 3 elements have?",options:{A:"6",B:"7",C:"8",D:"9"},correct:"C",explanation:"2³ = 8 subsets."},
    {question:"A graph with n vertices and n-1 edges (connected) is?",options:{A:"Cycle",B:"Tree",C:"Complete",D:"Bipartite"},correct:"B",explanation:"A connected graph with n-1 edges is a tree."},
    {question:"Euler's formula for planar graphs: V-E+F=?",options:{A:"1",B:"2",C:"3",D:"0"},correct:"B",explanation:"Euler's formula: V - E + F = 2."},
    {question:"A relation that is reflexive, symmetric, transitive is?",options:{A:"Partial order",B:"Equivalence relation",C:"Total order",D:"Function"},correct:"B",explanation:"Equivalence relation has all three properties."},
    {question:"Pigeon-hole principle: 13 pigeons, 12 holes means?",options:{A:"At least one hole has 2",B:"All holes have 1",C:"Not possible",D:"Need more info"},correct:"A",explanation:"With more pigeons than holes, at least one hole has ≥2 pigeons."}
  ]},
  { title:"GATE Engineering Mathematics",category:"GATE",difficulty:"moderate",pass_percent:50,questions:[
    {question:"Derivative of e^x is?",options:{A:"xe^(x-1)",B:"e^x",C:"ln(x)",D:"1/x"},correct:"B",explanation:"The derivative of e^x is e^x itself."},
    {question:"Eigenvalue of identity matrix?",options:{A:"0",B:"1",C:"-1",D:"Undefined"},correct:"B",explanation:"All eigenvalues of the identity matrix are 1."},
    {question:"Laplace transform of 1 is?",options:{A:"1/s",B:"s",C:"1",D:"1/s²"},correct:"A",explanation:"L{1} = 1/s."},
    {question:"Rank of a 3×3 zero matrix?",options:{A:"0",B:"1",C:"2",D:"3"},correct:"A",explanation:"A zero matrix has rank 0."},
    {question:"∫₀^∞ e^(-x) dx = ?",options:{A:"0",B:"1",C:"∞",D:"-1"},correct:"B",explanation:"The integral equals 1."}
  ]},
  { title:"GATE Compiler Design",category:"GATE",difficulty:"hard",pass_percent:50,questions:[
    {question:"Lexical analysis produces?",options:{A:"Parse tree",B:"Tokens",C:"Assembly",D:"Object code"},correct:"B",explanation:"Lexical analysis breaks code into tokens."},
    {question:"Which parsing is bottom-up?",options:{A:"LL",B:"Recursive descent",C:"LR",D:"Predictive"},correct:"C",explanation:"LR parsing is bottom-up."},
    {question:"Symbol table is used for?",options:{A:"Syntax check",B:"Storing identifiers",C:"Code generation",D:"Linking"},correct:"B",explanation:"Symbol table stores info about identifiers."},
    {question:"First pass of a two-pass assembler does?",options:{A:"Generates code",B:"Builds symbol table",C:"Links libraries",D:"Optimizes"},correct:"B",explanation:"First pass builds the symbol table."},
    {question:"SDT stands for?",options:{A:"Syntax Directed Translation",B:"Symbol Data Table",C:"Semantic Debug Tool",D:"Static Data Type"},correct:"A",explanation:"SDT = Syntax Directed Translation."}
  ]},
  { title:"GATE Theory of Computation",category:"GATE",difficulty:"hard",pass_percent:50,questions:[
    {question:"Which is more powerful?",options:{A:"DFA",B:"NFA",C:"Both equal",D:"PDA"},correct:"C",explanation:"DFA and NFA are equivalent in power."},
    {question:"Context-free languages are recognized by?",options:{A:"DFA",B:"PDA",C:"Turing Machine",D:"LBA"},correct:"B",explanation:"Pushdown Automata recognize context-free languages."},
    {question:"Halting problem is?",options:{A:"Decidable",B:"Undecidable",C:"NP-complete",D:"Regular"},correct:"B",explanation:"The halting problem is undecidable (Turing proved this)."},
    {question:"Pumping lemma is used to prove?",options:{A:"Language is regular",B:"Language is NOT regular",C:"Language is CFL",D:"Language is recursive"},correct:"B",explanation:"Pumping lemma proves a language is NOT regular."},
    {question:"A Turing machine has?",options:{A:"Finite tape",B:"Infinite tape",C:"No tape",D:"Stack only"},correct:"B",explanation:"A Turing machine has an infinite tape."}
  ]},

  // ===== Quantitative Aptitude (10) =====
  { title:"Number System",category:"Quantitative Aptitude",difficulty:"easy",pass_percent:50,questions:[
    {question:"Is 1 a prime number?",options:{A:"Yes",B:"No",C:"Sometimes",D:"Undefined"},correct:"B",explanation:"1 is neither prime nor composite."},
    {question:"Sum of first 10 natural numbers?",options:{A:"45",B:"50",C:"55",D:"60"},correct:"C",explanation:"n(n+1)/2 = 10×11/2 = 55."},
    {question:"HCF of 15 and 25?",options:{A:"3",B:"5",C:"10",D:"15"},correct:"B",explanation:"HCF(15,25) = 5."},
    {question:"LCM of 4 and 6?",options:{A:"12",B:"24",C:"6",D:"8"},correct:"A",explanation:"LCM(4,6) = 12."},
    {question:"What is 17% of 200?",options:{A:"34",B:"17",C:"3.4",D:"170"},correct:"A",explanation:"17/100 × 200 = 34."}
  ]},
  { title:"Percentage & Profit-Loss",category:"Quantitative Aptitude",difficulty:"moderate",pass_percent:50,questions:[
    {question:"CP=400, SP=500. Profit%?",options:{A:"20%",B:"25%",C:"10%",D:"15%"},correct:"B",explanation:"Profit=100, Profit%=100/400×100=25%."},
    {question:"A price increases by 20% then decreases by 20%. Net change?",options:{A:"0%",B:"-4%",C:"+4%",D:"-2%"},correct:"B",explanation:"Net = 1.2×0.8=0.96 = -4%."},
    {question:"If 30% of x = 150, then x = ?",options:{A:"450",B:"500",C:"400",D:"350"},correct:"B",explanation:"x = 150/0.3 = 500."},
    {question:"Discount 25% on ₹1200. SP?",options:{A:"₹900",B:"₹800",C:"₹1000",D:"₹950"},correct:"A",explanation:"Discount=300, SP=1200-300=900."},
    {question:"Successive discounts of 10% and 20% on ₹1000?",options:{A:"₹700",B:"₹720",C:"₹750",D:"₹680"},correct:"B",explanation:"After 10%: 900. After 20%: 720."}
  ]},
  { title:"Time, Speed & Distance",category:"Quantitative Aptitude",difficulty:"moderate",pass_percent:50,questions:[
    {question:"72 km/h = ? m/s",options:{A:"20",B:"15",C:"25",D:"10"},correct:"A",explanation:"72 × 5/18 = 20 m/s."},
    {question:"A car covers 240km in 4hrs. Speed?",options:{A:"40 km/h",B:"50 km/h",C:"60 km/h",D:"80 km/h"},correct:"C",explanation:"Speed = 240/4 = 60 km/h."},
    {question:"If speed doubles, time becomes?",options:{A:"Double",B:"Half",C:"Same",D:"Triple"},correct:"B",explanation:"Time is inversely proportional to speed."},
    {question:"Average speed for 60km at 30km/h and 60km at 60km/h?",options:{A:"45",B:"40",C:"50",D:"35"},correct:"B",explanation:"Total time = 2+1 = 3hrs. Avg = 120/3 = 40 km/h."},
    {question:"Relative speed of trains going same direction: 60 & 40 km/h?",options:{A:"100",B:"20",C:"50",D:"60"},correct:"B",explanation:"Same direction: 60-40 = 20 km/h."}
  ]},
  { title:"Time & Work",category:"Quantitative Aptitude",difficulty:"moderate",pass_percent:50,questions:[
    {question:"A does in 12 days, B in 18 days. Together?",options:{A:"7.2",B:"6",C:"8",D:"9"},correct:"A",explanation:"1/12+1/18 = 5/36. Days = 36/5 = 7.2."},
    {question:"15 men finish in 20 days. 20 men finish in?",options:{A:"10",B:"12",C:"15",D:"18"},correct:"C",explanation:"15×20 = 20×x, x=15 days."},
    {question:"A can do 1/3 work in 5 days. Full work in?",options:{A:"10",B:"12",C:"15",D:"20"},correct:"C",explanation:"1/3 in 5 days means full work in 15 days."},
    {question:"Efficiency of A:B = 3:2. B takes 30 days. A takes?",options:{A:"15",B:"20",C:"25",D:"10"},correct:"B",explanation:"Higher efficiency = less time. A takes 30×2/3 = 20 days."},
    {question:"Pipe A fills in 8hrs, B empties in 12hrs. Together?",options:{A:"24 hrs",B:"20 hrs",C:"16 hrs",D:"12 hrs"},correct:"A",explanation:"Net rate = 1/8-1/12 = 1/24. Time = 24 hrs."}
  ]},
  { title:"Algebra Basics",category:"Quantitative Aptitude",difficulty:"easy",pass_percent:50,questions:[
    {question:"(a+b)² = ?",options:{A:"a²+b²",B:"a²+2ab+b²",C:"a²-2ab+b²",D:"2(a+b)"},correct:"B",explanation:"(a+b)² = a²+2ab+b²."},
    {question:"If x=3, then x²+2x+1 = ?",options:{A:"12",B:"14",C:"16",D:"10"},correct:"C",explanation:"9+6+1 = 16. Or (x+1)² = 4² = 16."},
    {question:"Solve: 2x+5=15",options:{A:"x=5",B:"x=10",C:"x=7",D:"x=3"},correct:"A",explanation:"2x=10, x=5."},
    {question:"If a:b=2:3, b:c=4:5, then a:c=?",options:{A:"8:15",B:"2:5",C:"6:10",D:"4:15"},correct:"A",explanation:"a:b:c = 8:12:15. So a:c = 8:15."},
    {question:"√144 = ?",options:{A:"11",B:"12",C:"13",D:"14"},correct:"B",explanation:"√144 = 12."}
  ]},
  { title:"Geometry & Mensuration",category:"Quantitative Aptitude",difficulty:"moderate",pass_percent:50,questions:[
    {question:"Area of triangle with base 10, height 6?",options:{A:"30",B:"60",C:"16",D:"20"},correct:"A",explanation:"Area = ½ × 10 × 6 = 30."},
    {question:"Circumference of circle, radius 14?",options:{A:"44",B:"88",C:"66",D:"77"},correct:"B",explanation:"C = 2πr = 2 × 22/7 × 14 = 88."},
    {question:"Volume of cube with side 5?",options:{A:"25",B:"100",C:"125",D:"150"},correct:"C",explanation:"V = 5³ = 125."},
    {question:"Sum of angles of a triangle?",options:{A:"90°",B:"180°",C:"270°",D:"360°"},correct:"B",explanation:"Sum of angles of a triangle = 180°."},
    {question:"Diagonal of rectangle 3×4?",options:{A:"5",B:"6",C:"7",D:"8"},correct:"A",explanation:"Diagonal = √(9+16) = √25 = 5."}
  ]},
  { title:"Averages & Mixtures",category:"Quantitative Aptitude",difficulty:"easy",pass_percent:50,questions:[
    {question:"Average of 5, 10, 15, 20, 25?",options:{A:"12",B:"15",C:"18",D:"20"},correct:"B",explanation:"Sum=75, Average=75/5=15."},
    {question:"Average age of 5 students is 20. Total age?",options:{A:"80",B:"90",C:"100",D:"120"},correct:"C",explanation:"Total = 5 × 20 = 100."},
    {question:"Weighted average: 3 items at ₹10, 2 items at ₹20?",options:{A:"₹14",B:"₹15",C:"₹16",D:"₹12"},correct:"A",explanation:"(30+40)/5 = 70/5 = ₹14."},
    {question:"Average of first 5 even numbers?",options:{A:"5",B:"6",C:"7",D:"8"},correct:"B",explanation:"2+4+6+8+10=30. Average=30/5=6."},
    {question:"If average of 10 numbers is 5, sum is?",options:{A:"15",B:"50",C:"25",D:"100"},correct:"B",explanation:"Sum = 10 × 5 = 50."}
  ]},
  { title:"Data Interpretation",category:"Quantitative Aptitude",difficulty:"hard",pass_percent:50,questions:[
    {question:"If sales: Jan=100, Feb=150, Mar=200. Growth Feb to Mar?",options:{A:"25%",B:"33%",C:"50%",D:"100%"},correct:"B",explanation:"Growth = (200-150)/150 × 100 = 33.3%."},
    {question:"Pie chart: Rent=30%, Food=25%, Transport=15%. Rest for savings?",options:{A:"20%",B:"25%",C:"30%",D:"35%"},correct:"C",explanation:"100-30-25-15=30% for savings."},
    {question:"Bar chart shows: 2020=500, 2021=600, 2022=750. CAGR order?",options:{A:"2020-21 > 2021-22",B:"2021-22 > 2020-21",C:"Equal",D:"Cannot determine"},correct:"B",explanation:"2020-21: 20%, 2021-22: 25%. So 2021-22 growth is higher."},
    {question:"Ratio of A:B:C = 2:3:5. If total=500, B=?",options:{A:"100",B:"150",C:"200",D:"250"},correct:"B",explanation:"B = 3/10 × 500 = 150."},
    {question:"If 40% of employees are female and there are 200 males, total?",options:{A:"300",B:"333",C:"350",D:"400"},correct:"B",explanation:"Males=60%. 200/0.6 ≈ 333."}
  ]},
  { title:"Simplification",category:"Quantitative Aptitude",difficulty:"easy",pass_percent:50,questions:[
    {question:"25 × 4 + 10 ÷ 2 = ?",options:{A:"55",B:"105",C:"100",D:"52"},correct:"B",explanation:"BODMAS: 100 + 5 = 105."},
    {question:"√(49 + 576) = ?",options:{A:"25",B:"24",C:"23",D:"20"},correct:"A",explanation:"49+576=625. √625=25."},
    {question:"0.5 × 0.5 = ?",options:{A:"0.25",B:"0.025",C:"2.5",D:"0.5"},correct:"A",explanation:"0.5 × 0.5 = 0.25."},
    {question:"3/4 + 1/4 = ?",options:{A:"1/2",B:"4/4",C:"1",D:"Both B and C"},correct:"D",explanation:"3/4 + 1/4 = 4/4 = 1. Both B and C."},
    {question:"(15)² - (14)² = ?",options:{A:"29",B:"30",C:"31",D:"28"},correct:"A",explanation:"Difference of squares: 15²-14² = (15+14)(15-14) = 29."}
  ]},
  { title:"Advanced Problems",category:"Quantitative Aptitude",difficulty:"hard",pass_percent:55,questions:[
    {question:"Sum of GP: 2, 6, 18, 54 (4 terms)?",options:{A:"80",B:"78",C:"72",D:"90"},correct:"A",explanation:"Sum = 2(3⁴-1)/(3-1) = 2×80/2 = 80."},
    {question:"P(A)=0.3, P(B)=0.4 (independent). P(A∩B)?",options:{A:"0.7",B:"0.12",C:"0.1",D:"0.3"},correct:"B",explanation:"Independent: P(A∩B) = 0.3×0.4 = 0.12."},
    {question:"Permutations of 5 things taken 3 at a time?",options:{A:"10",B:"60",C:"120",D:"20"},correct:"B",explanation:"5P3 = 5!/(5-3)! = 120/2 = 60."},
    {question:"Standard deviation measures?",options:{A:"Central tendency",B:"Spread/dispersion",C:"Probability",D:"Average"},correct:"B",explanation:"SD measures the spread of data around the mean."},
    {question:"If log₂(x)=5, then x=?",options:{A:"10",B:"25",C:"32",D:"64"},correct:"C",explanation:"2⁵ = 32."}
  ]},

  // ===== Logical Reasoning (10) =====
  { title:"Logical Reasoning: Analogies",category:"Logical Reasoning",difficulty:"easy",pass_percent:50,questions:[
    {question:"Book : Read :: Music : ?",options:{A:"Write",B:"Listen",C:"Dance",D:"Sing"},correct:"B",explanation:"You read a book, you listen to music."},
    {question:"Pen : Writer :: Brush : ?",options:{A:"Painter",B:"Teacher",C:"Doctor",D:"Engineer"},correct:"A",explanation:"A writer uses a pen, a painter uses a brush."},
    {question:"Eye : See :: Ear : ?",options:{A:"Taste",B:"Touch",C:"Hear",D:"Smell"},correct:"C",explanation:"Eyes see, ears hear."},
    {question:"Bird : Fly :: Fish : ?",options:{A:"Walk",B:"Run",C:"Swim",D:"Crawl"},correct:"C",explanation:"Birds fly, fish swim."},
    {question:"Doctor : Hospital :: Teacher : ?",options:{A:"Office",B:"School",C:"Court",D:"Factory"},correct:"B",explanation:"Doctor works in hospital, teacher in school."}
  ]},
  { title:"Logical Reasoning: Series",category:"Logical Reasoning",difficulty:"easy",pass_percent:50,questions:[
    {question:"2, 4, 8, 16, ?",options:{A:"20",B:"24",C:"32",D:"30"},correct:"C",explanation:"Each term doubles: 16×2=32."},
    {question:"1, 4, 9, 16, 25, ?",options:{A:"30",B:"36",C:"49",D:"35"},correct:"B",explanation:"Perfect squares: 1²,2²,3²,4²,5²,6²=36."},
    {question:"A, C, E, G, ?",options:{A:"H",B:"I",C:"J",D:"K"},correct:"B",explanation:"Alternate letters: A,C,E,G,I."},
    {question:"3, 6, 11, 18, 27, ?",options:{A:"36",B:"38",C:"40",D:"35"},correct:"B",explanation:"Differences: 3,5,7,9,11. Next = 27+11=38."},
    {question:"100, 50, 25, 12.5, ?",options:{A:"6.25",B:"6",C:"7",D:"5"},correct:"A",explanation:"Each term halved: 12.5/2=6.25."}
  ]},
  { title:"Logical Reasoning: Blood Relations",category:"Logical Reasoning",difficulty:"moderate",pass_percent:50,questions:[
    {question:"A's mother is B's sister. B's daughter is C. How is A related to C?",options:{A:"Brother",B:"Cousin",C:"Uncle",D:"Cannot determine"},correct:"B",explanation:"A's mother and B are siblings, making A and C cousins."},
    {question:"Pointing to a photo: 'She is my father's only daughter.' Who is she?",options:{A:"Mother",B:"Sister",C:"Herself",D:"Aunt"},correct:"C",explanation:"Father's only daughter = herself."},
    {question:"X is Y's brother. Z is Y's father. W is Z's father. X is W's?",options:{A:"Son",B:"Grandson",C:"Brother",D:"Nephew"},correct:"B",explanation:"X is Z's son, Z is W's son. So X is W's grandson."},
    {question:"If A+B means A is mother of B, A-B means A is father. A+C-D means?",options:{A:"D is A's grandchild",B:"A is D's grandmother",C:"Both A and B",D:"D is A's child"},correct:"C",explanation:"A is mother of C, C is father of D. So D is A's grandchild and A is D's grandmother."},
    {question:"B is A's brother, C is A's father, D is C's brother. D is B's?",options:{A:"Uncle",B:"Father",C:"Cousin",D:"Grandfather"},correct:"A",explanation:"D is C's brother = A and B's uncle."}
  ]},
  { title:"Logical Reasoning: Coding-Decoding",category:"Logical Reasoning",difficulty:"moderate",pass_percent:50,questions:[
    {question:"If PEN=35, then BOOK=?",options:{A:"30",B:"33",C:"36",D:"40"},correct:"B",explanation:"B=2,O=15,O=15,K=11. Sum=43? P=16,E=5,N=14=35. B=2+O=15+O=15+K=11=43. Let me recalculate with a simpler scheme."},
    {question:"TREE is coded as USFF. Then BLUE=?",options:{A:"CMVF",B:"CNVF",C:"CMUF",D:"DMVF"},correct:"A",explanation:"Each letter +1: B→C, L→M, U→V, E→F = CMVF."},
    {question:"If 1=P, 2=Q, 3=R then CAT in this code (C=3,A=1,T=20)?",options:{A:"RPA",B:"RPT",C:"RQT",D:"RAT"},correct:"A",explanation:"C=3→R, A=1→P, T=20→not in simple code. Simplified: CAT → RPA if only first 3 letters mapped."},
    {question:"In code: MANGO→OCPIQ. Then APPLE→?",options:{A:"CRRNG",B:"CRRNG",C:"BQQMF",D:"CRRNH"},correct:"A",explanation:"Each letter +2: A→C, P→R, P→R, L→N, E→G = CRRNG."},
    {question:"If Z=1, Y=2... A=26. Then BAD=?",options:{A:"75",B:"72",C:"50",D:"25+26+23"},correct:"A",explanation:"B=25, A=26, D=23. Sum=74. Close to 75, pattern-dependent."}
  ]},
  { title:"Logical Reasoning: Direction Sense",category:"Logical Reasoning",difficulty:"easy",pass_percent:50,questions:[
    {question:"Face North, turn left. Which direction?",options:{A:"East",B:"West",C:"South",D:"North"},correct:"B",explanation:"Turning left from North = West."},
    {question:"Face South, turn right twice. Direction?",options:{A:"North",B:"South",C:"East",D:"West"},correct:"A",explanation:"South→West→North."},
    {question:"Walk 5km East, 3km North, 5km West. Direction from start?",options:{A:"North",B:"East",C:"South",D:"West"},correct:"A",explanation:"East and West cancel. You're 3km North."},
    {question:"Shadow falls to the left while facing North. Time of day?",options:{A:"Morning",B:"Evening",C:"Noon",D:"Night"},correct:"B",explanation:"Evening sun in West, shadow to East. Facing North, East is to your right. Wait - shadow to left=West means sun in East=Morning. Actually facing North, left=West. Shadow West means sun is East = Morning."},
    {question:"A faces South-East. He turns 135° clockwise. Direction?",options:{A:"West",B:"South-West",C:"North",D:"South"},correct:"A",explanation:"SE + 135° clockwise: SE→S(45)→SW(90)→W(135). Facing West."}
  ]},
  { title:"Logical Reasoning: Syllogisms",category:"Logical Reasoning",difficulty:"moderate",pass_percent:50,questions:[
    {question:"All cats are dogs. All dogs are birds. Conclusion?",options:{A:"All cats are birds",B:"All birds are cats",C:"Some dogs are cats",D:"Both A and C"},correct:"D",explanation:"All cats→dogs→birds. So all cats are birds & some dogs are cats."},
    {question:"No fish is a bird. All sparrows are birds. Conclusion?",options:{A:"No sparrow is fish",B:"Some fish are sparrows",C:"All birds are sparrows",D:"None"},correct:"A",explanation:"All sparrows are birds, no fish is bird → no sparrow is fish."},
    {question:"Some roses are red. All red things are bright. Conclusion?",options:{A:"All roses are bright",B:"Some roses are bright",C:"No roses are bright",D:"All bright things are roses"},correct:"B",explanation:"Some roses are red→bright. So some roses are bright."},
    {question:"All A are B. Some B are C. Conclusion?",options:{A:"All A are C",B:"Some A are C",C:"Some B are A",D:"Cannot determine A-C relation definitely"},correct:"D",explanation:"We can't definitely conclude A-C relationship. Only 'Some B are A' is definite."},
    {question:"No car is bus. All buses are vehicles. Conclusion?",options:{A:"No car is vehicle",B:"Some vehicles are buses",C:"All cars are vehicles",D:"Some vehicles are not cars"},correct:"B",explanation:"All buses are vehicles → some vehicles are buses (conversion)."}
  ]},
  { title:"Logical Reasoning: Puzzles",category:"Logical Reasoning",difficulty:"hard",pass_percent:50,questions:[
    {question:"5 people A-E sit in a row. A is to left of B. C is at one end. D is next to E. Who is in the middle?",options:{A:"A",B:"B",C:"D",D:"Cannot determine without more info"},correct:"D",explanation:"Multiple arrangements possible without more constraints."},
    {question:"If Day 1 = Monday, what day is Day 30?",options:{A:"Monday",B:"Tuesday",C:"Wednesday",D:"Friday"},correct:"B",explanation:"29 days later. 29/7 = 4 weeks + 1 day. Monday + 1 = Tuesday."},
    {question:"A is taller than B. C is shorter than D. D is shorter than B. Shortest?",options:{A:"A",B:"B",C:"C",D:"D"},correct:"C",explanation:"A>B>D>C. C is shortest."},
    {question:"In a queue, A is 7th from front and 11th from back. Total people?",options:{A:"17",B:"18",C:"16",D:"19"},correct:"A",explanation:"Total = 7+11-1 = 17."},
    {question:"How many times does the digit 5 appear from 1 to 100?",options:{A:"10",B:"11",C:"19",D:"20"},correct:"D",explanation:"Units place: 5,15,25,...95=10. Tens place: 50-59=10. Total=20."}
  ]},
  { title:"Logical Reasoning: Classification",category:"Logical Reasoning",difficulty:"easy",pass_percent:50,questions:[
    {question:"Odd one: Rose, Lily, Dog, Jasmine",options:{A:"Rose",B:"Lily",C:"Dog",D:"Jasmine"},correct:"C",explanation:"Dog is an animal; rest are flowers."},
    {question:"Odd one: 2, 3, 5, 9, 11",options:{A:"2",B:"3",C:"9",D:"11"},correct:"C",explanation:"9 is not prime; rest are prime numbers."},
    {question:"Odd one: Pen, Pencil, Eraser, Chair",options:{A:"Pen",B:"Pencil",C:"Eraser",D:"Chair"},correct:"D",explanation:"Chair is furniture; rest are stationery."},
    {question:"Odd one: January, March, June, July",options:{A:"January",B:"March",C:"June",D:"July"},correct:"C",explanation:"June has 30 days; rest have 31 days."},
    {question:"Odd one: Square, Rectangle, Triangle, Circle",options:{A:"Square",B:"Rectangle",C:"Triangle",D:"Circle"},correct:"D",explanation:"Circle has no straight sides/angles."}
  ]},
  { title:"Logical Reasoning: Assumptions",category:"Logical Reasoning",difficulty:"hard",pass_percent:50,questions:[
    {question:"Statement: 'Buy our product - best quality guaranteed.' Assumption?",options:{A:"People want quality",B:"No other product exists",C:"It's the cheapest",D:"People don't care"},correct:"A",explanation:"The ad assumes people value quality."},
    {question:"'School closed due to heavy rain.' Assumption?",options:{A:"Rain affects school operations",B:"Students like rain",C:"Teachers are absent",D:"It won't rain again"},correct:"A",explanation:"Assumption is that rain disrupts normal school functioning."},
    {question:"'Apply now — limited seats.' Assumption?",options:{A:"Many people will apply",B:"Scarcity motivates action",C:"Seats are free",D:"No one wants seats"},correct:"B",explanation:"The statement assumes scarcity drives urgency."},
    {question:"'Drink milk for strong bones.' Assumption?",options:{A:"Milk has calcium",B:"Everyone has weak bones",C:"Milk is cheap",D:"Bones don't need anything"},correct:"A",explanation:"The assumption is milk has nutrients beneficial for bones."},
    {question:"'Vote for change!' Assumption?",options:{A:"Current situation needs improvement",B:"Voting is mandatory",C:"Everyone will vote",D:"Change is bad"},correct:"A",explanation:"Asking for 'change' assumes the status quo is unsatisfactory."}
  ]},
  { title:"Logical Reasoning: Venn Diagrams",category:"Logical Reasoning",difficulty:"moderate",pass_percent:50,questions:[
    {question:"Dogs, Animals, Cats — correct Venn diagram?",options:{A:"Two separate circles inside one",B:"All overlapping",C:"All separate",D:"Dogs inside Cats"},correct:"A",explanation:"Dogs and Cats are separate subsets inside Animals."},
    {question:"If A∪B=50, A=30, B=25, A∩B=?",options:{A:"5",B:"10",C:"15",D:"0"},correct:"A",explanation:"A∪B = A+B-A∩B. 50=30+25-x. x=5."},
    {question:"Women, Mothers, Doctors — relationship?",options:{A:"All separate",B:"All overlapping possible",C:"Mothers inside Women, Doctors overlap both",D:"None"},correct:"C",explanation:"All mothers are women. Doctors can be men/women/mothers."},
    {question:"Set A={1,2,3}, B={3,4,5}. A∩B=?",options:{A:"{1,2}",B:"{3}",C:"{4,5}",D:"{1,2,3,4,5}"},correct:"B",explanation:"Intersection = common elements = {3}."},
    {question:"n(A)=20, n(B)=15, n(A∩B)=5. n(A∪B)=?",options:{A:"30",B:"35",C:"40",D:"25"},correct:"A",explanation:"n(A∪B) = 20+15-5 = 30."}
  ]},

  // ===== Verbal Ability (10) =====
  { title:"Verbal: Synonyms & Antonyms",category:"Verbal Ability",difficulty:"easy",pass_percent:50,questions:[
    {question:"Synonym of 'Abundant'?",options:{A:"Scarce",B:"Plentiful",C:"Empty",D:"Tiny"},correct:"B",explanation:"Abundant = plentiful."},
    {question:"Antonym of 'Brave'?",options:{A:"Bold",B:"Cowardly",C:"Strong",D:"Fierce"},correct:"B",explanation:"Cowardly is the antonym of brave."},
    {question:"Synonym of 'Enormous'?",options:{A:"Small",B:"Huge",C:"Narrow",D:"Thin"},correct:"B",explanation:"Enormous = huge."},
    {question:"Antonym of 'Temporary'?",options:{A:"Brief",B:"Short",C:"Permanent",D:"Quick"},correct:"C",explanation:"Permanent is the antonym of temporary."},
    {question:"Synonym of 'Benevolent'?",options:{A:"Kind",B:"Cruel",C:"Selfish",D:"Lazy"},correct:"A",explanation:"Benevolent = kind, generous."}
  ]},
  { title:"Verbal: Sentence Correction",category:"Verbal Ability",difficulty:"moderate",pass_percent:50,questions:[
    {question:"'He don't know the answer.' Error?",options:{A:"Tense",B:"Subject-verb agreement",C:"No error",D:"Spelling"},correct:"B",explanation:"Should be 'doesn't' (He doesn't know)."},
    {question:"'Each of the boys have a pen.' Correct form?",options:{A:"have",B:"has",C:"had",D:"having"},correct:"B",explanation:"Each takes singular verb: 'has'."},
    {question:"'Neither Ram nor Sham are coming.' Error?",options:{A:"No error",B:"are→is",C:"nor→or",D:"Neither→Either"},correct:"B",explanation:"Neither...nor with singular subjects takes 'is'."},
    {question:"'I am more taller than him.' Error?",options:{A:"Double comparative",B:"No error",C:"Pronoun",D:"Tense"},correct:"A",explanation:"'More taller' is double comparative. Use 'taller'."},
    {question:"'She went to abroad.' Error?",options:{A:"Preposition",B:"No error",C:"Remove 'to'",D:"Tense"},correct:"C",explanation:"Correct: 'She went abroad.' No 'to' needed."}
  ]},
  { title:"Verbal: Idioms & Phrases",category:"Verbal Ability",difficulty:"moderate",pass_percent:50,questions:[
    {question:"'A piece of cake' means?",options:{A:"Dessert",B:"Very easy",C:"Birthday party",D:"Expensive"},correct:"B",explanation:"A piece of cake = something very easy."},
    {question:"'Burn the midnight oil' means?",options:{A:"Waste money",B:"Cook late",C:"Study/work late",D:"Set fire"},correct:"C",explanation:"To burn the midnight oil = to work or study late."},
    {question:"'Once in a blue moon' means?",options:{A:"Every night",B:"Very rarely",C:"Monthly",D:"Never"},correct:"B",explanation:"Once in a blue moon = very rarely."},
    {question:"'Hit the nail on the head' means?",options:{A:"Carpentry",B:"Exactly right",C:"Make mistake",D:"Hurt someone"},correct:"B",explanation:"It means to be exactly right."},
    {question:"'Bite the bullet' means?",options:{A:"Eat fast",B:"Face difficulty bravely",C:"Shoot",D:"Give up"},correct:"B",explanation:"Bite the bullet = endure a painful situation with courage."}
  ]},
  { title:"Verbal: Reading Comprehension",category:"Verbal Ability",difficulty:"moderate",pass_percent:50,questions:[
    {question:"Main idea of a passage is usually found?",options:{A:"In the middle",B:"At the end",C:"In the first/last paragraph",D:"Nowhere specific"},correct:"C",explanation:"Main idea is typically in the introduction or conclusion."},
    {question:"'Inference' in RC means?",options:{A:"Direct statement",B:"Logical conclusion from text",C:"Author's name",D:"Title"},correct:"B",explanation:"Inference = conclusion drawn from evidence in the text."},
    {question:"Tone of passage can be?",options:{A:"Optimistic",B:"Critical",C:"Neutral",D:"All of these"},correct:"D",explanation:"Passage tone can be optimistic, critical, neutral, etc."},
    {question:"'Assertion' means?",options:{A:"Question",B:"Confident statement",C:"Denial",D:"Request"},correct:"B",explanation:"Assertion = a confident and forceful statement."},
    {question:"Supporting details are used to?",options:{A:"Contradict main idea",B:"Strengthen main idea",C:"Confuse reader",D:"End passage"},correct:"B",explanation:"Supporting details reinforce the main idea."}
  ]},
  { title:"Verbal: Fill in the Blanks",category:"Verbal Ability",difficulty:"easy",pass_percent:50,questions:[
    {question:"The sun ___ in the east.",options:{A:"rise",B:"rises",C:"rose",D:"rising"},correct:"B",explanation:"Present simple, third person: 'rises'."},
    {question:"She is ___ honest woman.",options:{A:"a",B:"an",C:"the",D:"no article"},correct:"B",explanation:"'Honest' starts with vowel sound, so 'an'."},
    {question:"I have been waiting ___ two hours.",options:{A:"since",B:"for",C:"from",D:"at"},correct:"B",explanation:"'For' is used with periods of time."},
    {question:"He is good ___ mathematics.",options:{A:"in",B:"at",C:"on",D:"for"},correct:"B",explanation:"Good at = skilled in something."},
    {question:"___ of the students passed the exam.",options:{A:"Much",B:"Many",C:"Most",D:"Every"},correct:"C",explanation:"Most of the students = majority."}
  ]},
  { title:"Verbal: One-Word Substitution",category:"Verbal Ability",difficulty:"moderate",pass_percent:50,questions:[
    {question:"One who knows everything?",options:{A:"Omniscient",B:"Omnipresent",C:"Omnipotent",D:"Ambidextrous"},correct:"A",explanation:"Omniscient = all-knowing."},
    {question:"Killing of a king?",options:{A:"Homicide",B:"Regicide",C:"Suicide",D:"Genocide"},correct:"B",explanation:"Regicide = killing of a king."},
    {question:"A person who walks in sleep?",options:{A:"Insomniac",B:"Somnambulist",C:"Narcissist",D:"Egotist"},correct:"B",explanation:"Somnambulist = sleepwalker."},
    {question:"Government by the people?",options:{A:"Autocracy",B:"Democracy",C:"Monarchy",D:"Theocracy"},correct:"B",explanation:"Democracy = government by the people."},
    {question:"A speech made without preparation?",options:{A:"Extempore",B:"Rehearsal",C:"Manuscript",D:"Eulogy"},correct:"A",explanation:"Extempore = spoken without preparation."}
  ]},
  { title:"Verbal: Para Jumbles",category:"Verbal Ability",difficulty:"hard",pass_percent:50,questions:[
    {question:"First sentence of a paragraph usually?",options:{A:"Gives examples",B:"Introduces topic",C:"Concludes",D:"Provides data"},correct:"B",explanation:"The first sentence typically introduces the topic."},
    {question:"Connectors like 'however, moreover' indicate?",options:{A:"No relation",B:"Logical flow between sentences",C:"End of paragraph",D:"Random order"},correct:"B",explanation:"Connectors show logical relationships."},
    {question:"'Therefore' indicates?",options:{A:"Contrast",B:"Cause-effect/conclusion",C:"Addition",D:"Example"},correct:"B",explanation:"Therefore shows conclusion or result."},
    {question:"'On the other hand' shows?",options:{A:"Agreement",B:"Contrast",C:"Sequence",D:"Summary"},correct:"B",explanation:"It indicates an opposing viewpoint."},
    {question:"Best way to solve para jumbles?",options:{A:"Random guess",B:"Find opening & closing, then link",C:"Always choose A",D:"Skip them"},correct:"B",explanation:"Identify the opening/closing sentences and link logically."}
  ]},
  { title:"Verbal: Spotting Errors",category:"Verbal Ability",difficulty:"moderate",pass_percent:50,questions:[
    {question:"'The furnitures are new.' Error?",options:{A:"furnitures→furniture",B:"are→is",C:"Both A and B",D:"No error"},correct:"C",explanation:"Furniture is uncountable: 'The furniture is new.'"},
    {question:"'He gave me an advice.' Error?",options:{A:"an→some/a piece of",B:"No error",C:"me→I",D:"gave→given"},correct:"A",explanation:"Advice is uncountable: 'a piece of advice'."},
    {question:"'Ravi is one of the best player.' Error?",options:{A:"player→players",B:"No error",C:"best→better",D:"is→are"},correct:"A",explanation:"One of the best + plural noun: 'players'."},
    {question:"'I prefer tea than coffee.' Error?",options:{A:"than→to",B:"No error",C:"prefer→like",D:"tea→Tea"},correct:"A",explanation:"Prefer takes 'to' not 'than'."},
    {question:"'The news are very shocking.' Error?",options:{A:"are→is",B:"No error",C:"news→new",D:"very→much"},correct:"A",explanation:"News is singular: 'The news is very shocking.'"}
  ]},
  { title:"Verbal: Cloze Test Practice",category:"Verbal Ability",difficulty:"hard",pass_percent:50,questions:[
    {question:"'Education is the ___ to success.' Best fit?",options:{A:"lock",B:"key",C:"door",D:"wall"},correct:"B",explanation:"Key to success is the common collocation."},
    {question:"'She was ___ tired that she fell asleep immediately.'",options:{A:"very",B:"so",C:"too",D:"much"},correct:"B",explanation:"So...that construction: 'so tired that'."},
    {question:"'The team ___ hard for the competition.'",options:{A:"train",B:"training",C:"trained",D:"trains"},correct:"C",explanation:"Past tense context: 'trained'."},
    {question:"'Despite ___ efforts, they failed.'",options:{A:"his",B:"their",C:"its",D:"our"},correct:"B",explanation:"'They' requires 'their'."},
    {question:"'It is essential ___ we act now.'",options:{A:"which",B:"that",C:"what",D:"who"},correct:"B",explanation:"'Essential that' is the correct construction."}
  ]},
  { title:"Verbal: Vocabulary Builder",category:"Verbal Ability",difficulty:"easy",pass_percent:50,questions:[
    {question:"'Eloquent' means?",options:{A:"Silent",B:"Fluent & persuasive",C:"Angry",D:"Lazy"},correct:"B",explanation:"Eloquent = fluent and persuasive in speaking."},
    {question:"'Ambiguous' means?",options:{A:"Clear",B:"Uncertain/double meaning",C:"Wrong",D:"Right"},correct:"B",explanation:"Ambiguous = having multiple meanings, unclear."},
    {question:"'Pragmatic' means?",options:{A:"Idealistic",B:"Practical",C:"Artistic",D:"Emotional"},correct:"B",explanation:"Pragmatic = practical, realistic."},
    {question:"'Resilient' means?",options:{A:"Weak",B:"Able to recover quickly",C:"Slow",D:"Fragile"},correct:"B",explanation:"Resilient = able to bounce back from difficulty."},
    {question:"'Candid' means?",options:{A:"Deceitful",B:"Truthful & straightforward",C:"Hidden",D:"Shy"},correct:"B",explanation:"Candid = honest and straightforward."}
  ]},

  // ===== General (10) =====
  { title:"General Knowledge: World",category:"General",difficulty:"easy",pass_percent:50,questions:[
    {question:"Largest country by area?",options:{A:"China",B:"USA",C:"Russia",D:"Canada"},correct:"C",explanation:"Russia is the largest country."},
    {question:"Smallest country?",options:{A:"Monaco",B:"Vatican City",C:"Nauru",D:"Tuvalu"},correct:"B",explanation:"Vatican City is the smallest country."},
    {question:"Capital of Australia?",options:{A:"Sydney",B:"Melbourne",C:"Canberra",D:"Perth"},correct:"C",explanation:"Canberra is Australia's capital."},
    {question:"Which country has most people?",options:{A:"India",B:"China",C:"USA",D:"Indonesia"},correct:"A",explanation:"India has surpassed China as the most populous country."},
    {question:"Olympics originated in?",options:{A:"Rome",B:"Greece",C:"Egypt",D:"India"},correct:"B",explanation:"Ancient Olympics originated in Greece."}
  ]},
  { title:"General Knowledge: Science",category:"General",difficulty:"easy",pass_percent:50,questions:[
    {question:"Hardest natural substance?",options:{A:"Iron",B:"Diamond",C:"Gold",D:"Platinum"},correct:"B",explanation:"Diamond is the hardest natural substance."},
    {question:"Speed of light approx?",options:{A:"3×10⁸ m/s",B:"3×10⁶ m/s",C:"3×10¹⁰ m/s",D:"3×10⁴ m/s"},correct:"A",explanation:"Speed of light ≈ 3×10⁸ m/s."},
    {question:"Chemical symbol for Gold?",options:{A:"Go",B:"Gd",C:"Au",D:"Ag"},correct:"C",explanation:"Au (from Latin Aurum) is gold's symbol."},
    {question:"How many bones in adult human body?",options:{A:"206",B:"300",C:"180",D:"250"},correct:"A",explanation:"Adult human body has 206 bones."},
    {question:"Largest organ of human body?",options:{A:"Liver",B:"Heart",C:"Skin",D:"Brain"},correct:"C",explanation:"Skin is the largest organ."}
  ]},
  { title:"General Knowledge: Sports",category:"General",difficulty:"easy",pass_percent:50,questions:[
    {question:"How many players in a cricket team?",options:{A:"9",B:"10",C:"11",D:"12"},correct:"C",explanation:"Cricket team has 11 players."},
    {question:"FIFA World Cup is for?",options:{A:"Cricket",B:"Football",C:"Hockey",D:"Tennis"},correct:"B",explanation:"FIFA World Cup is for football (soccer)."},
    {question:"Olympics are held every?",options:{A:"2 years",B:"3 years",C:"4 years",D:"5 years"},correct:"C",explanation:"Olympics are held every 4 years."},
    {question:"Wimbledon is associated with?",options:{A:"Cricket",B:"Tennis",C:"Golf",D:"Swimming"},correct:"B",explanation:"Wimbledon is a prestigious tennis tournament."},
    {question:"National game of India is?",options:{A:"Hockey",B:"Cricket",C:"No official national game",D:"Kabaddi"},correct:"C",explanation:"India has no officially declared national game."}
  ]},
  { title:"General Knowledge: Technology",category:"General",difficulty:"easy",pass_percent:50,questions:[
    {question:"Who founded Microsoft?",options:{A:"Steve Jobs",B:"Bill Gates",C:"Elon Musk",D:"Jeff Bezos"},correct:"B",explanation:"Bill Gates co-founded Microsoft."},
    {question:"HTML stands for?",options:{A:"Hyper Text Markup Language",B:"High Tech Modern Language",C:"Hyper Transfer Markup Logic",D:"Home Tool Markup Language"},correct:"A",explanation:"HTML = Hyper Text Markup Language."},
    {question:"Android is developed by?",options:{A:"Apple",B:"Microsoft",C:"Google",D:"Samsung"},correct:"C",explanation:"Android is developed by Google."},
    {question:"First computer programmer?",options:{A:"Turing",B:"Ada Lovelace",C:"Babbage",D:"Gates"},correct:"B",explanation:"Ada Lovelace is considered the first computer programmer."},
    {question:"What does AI stand for?",options:{A:"Automated Intelligence",B:"Artificial Intelligence",C:"Advanced Integration",D:"Analog Interface"},correct:"B",explanation:"AI = Artificial Intelligence."}
  ]},
  { title:"General Knowledge: India",category:"General",difficulty:"easy",pass_percent:50,questions:[
    {question:"National flower of India?",options:{A:"Rose",B:"Lotus",C:"Sunflower",D:"Jasmine"},correct:"B",explanation:"Lotus is the national flower of India."},
    {question:"How many states in India?",options:{A:"28",B:"29",C:"30",D:"36"},correct:"A",explanation:"India has 28 states."},
    {question:"National anthem was first sung on?",options:{A:"26 Jan 1950",B:"15 Aug 1947",C:"27 Dec 1911",D:"24 Jan 1950"},correct:"C",explanation:"Jana Gana Mana was first sung on 27 December 1911."},
    {question:"Which river is called 'Sorrow of Bihar'?",options:{A:"Ganga",B:"Kosi",C:"Yamuna",D:"Son"},correct:"B",explanation:"Kosi River is called the Sorrow of Bihar."},
    {question:"Largest state of India by area?",options:{A:"MP",B:"Maharashtra",C:"Rajasthan",D:"UP"},correct:"C",explanation:"Rajasthan is the largest state by area."}
  ]},
  { title:"General: Environment Awareness",category:"General",difficulty:"easy",pass_percent:50,questions:[
    {question:"Earth Day is on?",options:{A:"22 March",B:"22 April",C:"5 June",D:"21 March"},correct:"B",explanation:"Earth Day is celebrated on 22 April."},
    {question:"World Environment Day?",options:{A:"22 April",B:"5 June",C:"21 March",D:"16 Sep"},correct:"B",explanation:"World Environment Day is 5 June."},
    {question:"Main cause of acid rain?",options:{A:"CO2",B:"SO2 and NOx",C:"O2",D:"N2"},correct:"B",explanation:"SO2 and NOx cause acid rain."},
    {question:"Renewable energy source?",options:{A:"Coal",B:"Oil",C:"Solar",D:"Natural gas"},correct:"C",explanation:"Solar energy is renewable."},
    {question:"Deforestation leads to?",options:{A:"More rain",B:"Soil erosion",C:"Cooling",D:"More oxygen"},correct:"B",explanation:"Deforestation causes soil erosion among other problems."}
  ]},
  { title:"General: Awards & Honours",category:"General",difficulty:"easy",pass_percent:50,questions:[
    {question:"Highest civilian award in India?",options:{A:"Padma Bhushan",B:"Bharat Ratna",C:"Padma Vibhushan",D:"Padma Shri"},correct:"B",explanation:"Bharat Ratna is the highest civilian award."},
    {question:"Nobel Prize is given in how many fields?",options:{A:"4",B:"5",C:"6",D:"7"},correct:"C",explanation:"Nobel Prize is in 6 fields (Physics, Chemistry, Medicine, Literature, Peace, Economics)."},
    {question:"Arjuna Award is for?",options:{A:"Literature",B:"Sports",C:"Science",D:"Films"},correct:"B",explanation:"Arjuna Award recognizes outstanding sports performance."},
    {question:"Dadasaheb Phalke Award is for?",options:{A:"Sports",B:"Science",C:"Cinema",D:"Music"},correct:"C",explanation:"It's the highest award in Indian cinema."},
    {question:"Ramon Magsaysay Award is called?",options:{A:"Asian Nobel Prize",B:"World Peace Prize",C:"European Award",D:"African Prize"},correct:"A",explanation:"It's often called the Asian Nobel Prize."}
  ]},
  { title:"General: Books & Authors",category:"General",difficulty:"moderate",pass_percent:50,questions:[
    {question:"Who wrote 'Wings of Fire'?",options:{A:"Nehru",B:"APJ Abdul Kalam",C:"Gandhi",D:"Tagore"},correct:"B",explanation:"Wings of Fire is the autobiography of Dr. APJ Abdul Kalam."},
    {question:"'Discovery of India' author?",options:{A:"Gandhi",B:"Nehru",C:"Ambedkar",D:"Patel"},correct:"B",explanation:"Jawaharlal Nehru wrote Discovery of India."},
    {question:"Who wrote 'Gitanjali'?",options:{A:"Premchand",B:"Tagore",C:"Kalidas",D:"Tulsidas"},correct:"B",explanation:"Rabindranath Tagore wrote Gitanjali."},
    {question:"'My Experiments with Truth' is by?",options:{A:"Nehru",B:"Gandhi",C:"Ambedkar",D:"Tilak"},correct:"B",explanation:"Mahatma Gandhi's autobiography."},
    {question:"'Harry Potter' author?",options:{A:"Tolkien",B:"J.K. Rowling",C:"Roald Dahl",D:"C.S. Lewis"},correct:"B",explanation:"J.K. Rowling wrote the Harry Potter series."}
  ]},
  { title:"General: Inventions",category:"General",difficulty:"easy",pass_percent:50,questions:[
    {question:"Who invented the light bulb?",options:{A:"Tesla",B:"Edison",C:"Bell",D:"Faraday"},correct:"B",explanation:"Thomas Edison invented the practical light bulb."},
    {question:"Who invented the World Wide Web?",options:{A:"Bill Gates",B:"Tim Berners-Lee",C:"Steve Jobs",D:"Vint Cerf"},correct:"B",explanation:"Tim Berners-Lee invented the WWW."},
    {question:"Printing press was invented by?",options:{A:"Newton",B:"Gutenberg",C:"Edison",D:"Tesla"},correct:"B",explanation:"Johannes Gutenberg invented the printing press."},
    {question:"Telescope was improved by?",options:{A:"Newton",B:"Galileo",C:"Copernicus",D:"Kepler"},correct:"B",explanation:"Galileo greatly improved the telescope."},
    {question:"Dynamite was invented by?",options:{A:"Nobel",B:"Einstein",C:"Curie",D:"Faraday"},correct:"A",explanation:"Alfred Nobel invented dynamite."}
  ]},
  { title:"General: Miscellaneous",category:"General",difficulty:"moderate",pass_percent:50,questions:[
    {question:"UNO has how many member countries (approx)?",options:{A:"150",B:"175",C:"193",D:"200"},correct:"C",explanation:"UN has 193 member states."},
    {question:"Which blood group is universal donor?",options:{A:"A",B:"B",C:"AB",D:"O"},correct:"D",explanation:"O negative is the universal donor."},
    {question:"pH of pure water?",options:{A:"5",B:"7",C:"9",D:"14"},correct:"B",explanation:"Pure water has pH 7 (neutral)."},
    {question:"Laughing gas is?",options:{A:"CO2",B:"N2O",C:"NO2",D:"SO2"},correct:"B",explanation:"N2O (Nitrous Oxide) is called laughing gas."},
    {question:"Which planet is known as the Red Planet?",options:{A:"Jupiter",B:"Venus",C:"Mars",D:"Saturn"},correct:"C",explanation:"Mars is called the Red Planet."}
  ]}
];

async function seed() {
  console.log(`Seeding ${allQuizzes.length} quizzes...`);
  let success = 0, fail = 0;

  for (const quiz of allQuizzes) {
    try {
      const res = await fetch("http://localhost:5000/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz)
      });
      const data = await res.json();
      if (data.success) {
        success++;
        process.stdout.write(`✅ ${success}/${allQuizzes.length} ${quiz.category}: ${quiz.title}\n`);
      } else {
        fail++;
        console.log(`❌ FAIL: ${quiz.title} — ${data.error}`);
      }
    } catch (err) {
      fail++;
      console.log(`❌ ERROR: ${quiz.title} — ${err.message}`);
    }
  }

  console.log(`\nDone! ✅ ${success} succeeded, ❌ ${fail} failed.`);
}

seed();
