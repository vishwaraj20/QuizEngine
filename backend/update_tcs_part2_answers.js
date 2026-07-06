const supabase = require('./database');

const answers = `
101. b
102. c
103. b
104. a
105. a
106. a
107. d
108. b
109. b
110. b
111. b
112. c
113. d
114. c
115. d
116. a
117. b
118. d
119. c
120. c
121. d
122. d
123. d
124. c
125. a
126. a
127. d
128. c
129. d
130. b
131. d
132. a
133. d
134. d
135. a
136. c
137. c
138. a
139. d
140. c
141. d
142. b
143. b
144. a
145. c
146. d
147. a
148. a
149. b
150. c
151. c
152. c
153. c
154. d
155. d
156. b
157. a
158. a
159. c
160. b
161. a
162. a
163. b
164. d
165. c
166. d
167. c
168. d
169. a
170. a
171. b
172. c
173. c
174. a
175. a
176. d
177. c
178. b
179. a
180. d
181. b
182. b
183. a
184. c
185. a
186. d
187. a
188. b
189. b
190. d
191. b
192. c
193. b
194. a
195. b
196. b
197. a
198. a
199. c
200. a
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
        .eq('title', 'TCS Aptitude Question Bank - Part 2')
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

    console.log(`Found ${questions.length} questions for Part 2.`);
    
    let updated = 0;
    for (let i = 0; i < questions.length; i++) {
        const qNum = i + 101; // Map index 0-99 to questions 101-200
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
