const supabase = require('./database');

const answers = `
401. c
402. d
403. a
404. d
405. c
406. a
407. b
408. a
409. d
410. b
411. a
412. c
413. b
414. a
415. c
416. a
417. a
418. a
419. a
420. c
421. a
422. d
423. b
424. b
425. a
426. c
427. d
428. b
429. c
430. a
431. c
432. a
433. a
434. c
435. b
436. b
437. c
438. b
439. c
440. a
441. a
442. c
443. d
444. b
445. c
446. c
447. a
448. b
449. b
450. c
451. b
452. a
453. d
454. c
455. a
456. a
457. c
458. c
459. a
460. a
461. a
462. b
463. b
464. d
465. d
466. a
467. b
468. a
469. c
470. d
471. b
472. a
473. b
474. b
475. a
476. a
477. a
478. b
479. c
480. b
481. a
482. d
483. b
484. a
485. a
486. a
487. a
488. a
489. c
490. b
491. c
492. b
493. c
494. a
495. a
496. b
497. d
498. d
499. b
500. a
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
        .eq('title', 'TCS Aptitude Question Bank - Part 5')
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

    console.log(`Found ${questions.length} questions for Part 5.`);
    
    let updated = 0;
    for (let i = 0; i < questions.length; i++) {
        const qNum = i + 401; // Map index 0-99 to questions 401-500
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
