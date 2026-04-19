function validateQuizJSON(data) {
  const errors = [];

  // Check top-level key
  if (!data || !Array.isArray(data.questions)) {
    return { isValid: false, errors: ['File must have a top-level "questions" array'] };
  }

  data.questions.forEach((q, index) => {
    const id = q.id !== undefined ? q.id : `Row ${index + 1}`;

    // question text cannot be empty
    if (!q.question || typeof q.question !== 'string' || q.question.trim() === '') {
      errors.push(`Question ${id}: question text cannot be empty`);
    }

    // validate options
    if (!q.options || typeof q.options !== 'object' || Array.isArray(q.options)) {
      errors.push(`Question ${id}: all 4 options (A, B, C, D) are required`);
    } else {
      const keys = ['A', 'B', 'C', 'D'];
      let missingOrEmpty = false;
      for (const key of keys) {
        if (!q.options[key] || typeof q.options[key] !== 'string' || q.options[key].trim() === '') {
          missingOrEmpty = true;
          break;
        }
      }
      if (missingOrEmpty) {
        errors.push(`Question ${id}: all 4 options (A, B, C, D) are required`);
      }
    }

    // Normalize keys: sometimes LLMs use 'answer', 'correct_answer', etc. instead of 'correct'
    q.correct = q.correct || q.answer || q.correct_answer || q.correctAnswer || q.correctOption || q.correct_option;

    // correct must be exactly A, B, C, or D
    if (!q.correct) {
      errors.push(`Question ${id}: "correct" field is required (could not find 'correct', 'answer', or 'correct_answer')`);
    } else {
      q.correct = String(q.correct).trim().toUpperCase();
      if (!['A', 'B', 'C', 'D'].includes(q.correct)) {
        errors.push(`Question ${id}: "correct" must be A, B, C or D (got '${q.correct}')`);
      }
    }

    // explanation cannot be empty
    if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim() === '') {
      errors.push(`Question ${id}: explanation cannot be empty`);
    }

    // id must be a number
    if (typeof q.id !== 'number') {
      errors.push(`Question ${id}: id must be a number`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

module.exports = { validateQuizJSON };
