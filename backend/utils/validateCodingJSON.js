function validateCodingJSON(data) {
  let errors = [];
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['JSON root must be an object'] };
  }
  
  if (!data.problems || !Array.isArray(data.problems)) {
    return { isValid: false, errors: ['Missing or invalid "problems" array'] };
  }
  
  if (data.problems.length === 0) {
    return { isValid: false, errors: ['"problems" array cannot be empty'] };
  }
  
  data.problems.forEach((prob, index) => {
    const qNum = index + 1;
    if (!prob.title) errors.push(`Problem ${qNum}: Missing "title"`);
    if (!prob.difficulty) errors.push(`Problem ${qNum}: Missing "difficulty"`);
    if (!prob.description) errors.push(`Problem ${qNum}: Missing "description"`);
    if (!prob.starter_code) errors.push(`Problem ${qNum}: Missing "starter_code"`);
    if (!prob.test_cases || !Array.isArray(prob.test_cases)) {
      errors.push(`Problem ${qNum}: Missing or invalid "test_cases" array`);
    } else {
      prob.test_cases.forEach((tc, tcIndex) => {
        if (!tc.input && tc.input !== "") errors.push(`Problem ${qNum}, Test Case ${tcIndex + 1}: Missing "input"`);
        if (!tc.expected_output && tc.expected_output !== "") errors.push(`Problem ${qNum}, Test Case ${tcIndex + 1}: Missing "expected_output"`);
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = { validateCodingJSON };
