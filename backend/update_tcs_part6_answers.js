const supabase = require('./database');

const answers = `
501. d
502. b
503. a
504. c
505. a
506. c
507. c
508. b
509. a
510. d
511. b
512. b
513. b
514. c
515. b
516. a
517. d
518. a
519. d
520. b
521. a
522. a
523. b
524. d
525. c
526. c
527. d
528. d
529. c
530. b
531. c
532. d
533. c
534. a
535. a
536. d
537. d
538. b
539. d
540. c
541. a
542. a
543. c
544. d
545. b
546. a
547. c
548. a
549. a
550. b
551. c
552. c
553. a
554. a
555. c
556. a
557. c
558. b
559. d
560. b
561. a
562. c
563. a
564. c
565. c
566. c
567. c
568. c
569. b
570. b
571. a
572. b
573. b
574. b
575. d
576. b
577. b
578. d
579. b
580. b
581. a
582. d
583. d
584. d
585. a
586. d
587. a
588. a
589. b
590. c
591. c
592. b
593. d
594. a
595. d
596. c
597. d
598. d
599. a
600. d
601. b
602. a
603. d
604. b
605. a
606. c
607. d
608. c
609. a
610. b
611. b
612. b
613. d
614. b
615. c
616. c
617. b
618. a
619. a
620. b
621. a
622. b
623. d
624. c
625. c
626. c
627. a
628. b
629. a
630. a
631. a
632. c
633. c
634. c
635. a
636. d
637. b
638. d
639. c
640. a
641. c
642. d
643. c
644. c
645. c
646. c
647. c
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
        .eq('title', 'TCS Aptitude Question Bank - Part 6')
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

    console.log(`Found ${questions.length} questions for Part 6.`);
    
    let updated = 0;
    for (let i = 0; i < questions.length; i++) {
        const qNum = i + 501; // Map index 0-146 to questions 501-647
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
