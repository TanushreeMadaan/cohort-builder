function verifyQuery(filters, stats) {
    const issues = [];
  
    // Impossible numeric ranges
    Object.entries(filters).forEach(([field, condition]) => {
      if (typeof condition.value === "number") {
        if (condition.value < 0 || condition.value > 120) {
          issues.push(`Suspicious value for ${field}: ${condition.value}`);
        }
      }
    });
  
    // Empty results warning
    if (stats.count === 0) {
      issues.push("Query returned zero results");
    }
  
    return {
      verified: issues.length === 0,
      issues
    };
  }
  
  module.exports = {
    verifyQuery
  };
  