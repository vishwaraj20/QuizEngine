const supabase = require('./database');

const answers = `
1. d
2. a
3. c
4. d
5. b
6. a
7. a
8. d
9. c
10. c
11. c
12. c
13. b
14. c
15. a
16. d
17. a
18. d
19. a
20. c
21. a
22. a
23. d
24. b
25. c
26. b
27. a
28. a
29. c
30. c
31. c
32. b
33. d
34. c
35. a
36. b
37. c
38. c
39. a
40. c
41. c
42. c
43. d
44. c
45. b
46. c
47. b
48. d
49. a
50. c
51. a
52. a
53. a
54. b
55. d
56. a
57. b
58. b
59. b
60. d
61. b
62. c
63. d
64. a
65. d
66. c
67. a
68. c
69. a
70. b
71. a
72. b
73. d
74. b
75. a
76. a
77. a
78. c
79. b
80. b
81. a
82. c
83. c
84. a
85. c
86. a
87. b
88. a
89. a
90. a
91. a
92. b
93. d
94. c
95. c
96. a
97. a
98. b
99. c
100. c
`;

async function updateAnswers() {
    // parse answers
    const ansMap = {};
    answers.split('\n').forEach(line => {
        const m = line.match(/^(\d+)\.\s*([a-d])/i);
        if (m) {
            ansMap[parseInt(m[1])] = m[2].toUpperCase();
        }
    });

    console.log("Parsed " + Object.keys(ansMap).length + " answers.");

    const { data: quiz, error: quizErr } = await supabase
        .from('quizzes')
        .select('id')
        .eq('title', 'TCS Aptitude Question Bank - Part 1')
        .single();
        
    if (quizErr) {
        console.error("Error finding quiz:", quizErr);
        return;
    }

    const { data: questions, error: qErr } = await supabase
        .from('questions')
        .select('id')
        .eq('quiz_id', quiz.id)
        .order('id', { ascending: true });
        
    if (qErr) {
        console.error("Error finding questions:", qErr);
        return;
    }

    console.log(`Found ${questions.length} questions for Part 1.`);
    
    let updated = 0;
    for (let i = 0; i < questions.length; i++) {
        const qNum = i + 1;
        if (ansMap[qNum]) {
            await supabase
                .from('questions')
                .update({ correct_option: ansMap[qNum] })
                .eq('id', questions[i].id);
            updated++;
        }
    }
    console.log(`Successfully updated ${updated} questions with the provided answer key.`);
}

updateAnswers();
