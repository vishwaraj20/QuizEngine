const supabase = require('./database');

const answers = `
201. c
202. c
203. b
204. b
205. b
206. c
207. c
208. d
209. a
210. d
211. d
212. b
213. b
214. a
215. a
216. c
217. d
218. a
219. b
220. a
221. b
222. a
223. c
224. a
225. a
226. d
227. b
228. b
229. d
230. d
231. d
232. b
233. c
234. c
235. c
236. d
237. d
238. a
239. d
240. c
241. b
242. b
243. c
244. d
245. d
246. b
247. a
248. b
249. b
250. a
251. b
252. a
253. d
254. b
255. a
256. c
257. c
258. b
259. a
260. a
261. c
262. d
263. a
264. d
265. c
266. c
267. b
268. d
269. b
270. b
271. a
272. a
273. c
274. a
275. b
276. a
277. b
278. c
279. d
280. a
281. d
282. b
283. a
284. a
285. a
286. c
287. b
288. c
289. b
290. a
291. a
292. a
293. a
294. d
295. b
296. d
297. c
298. b
299. c
300. a
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
        .eq('title', 'TCS Aptitude Question Bank - Part 3')
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

    console.log(`Found ${questions.length} questions for Part 3.`);
    
    let updated = 0;
    for (let i = 0; i < questions.length; i++) {
        const qNum = i + 201; // Map index 0-99 to questions 201-300
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
