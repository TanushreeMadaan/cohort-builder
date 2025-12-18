function verifyQuery(filters, stats) {
    const issues = [];

    Object.entries(filters).forEach(([field, condition]) => {
        if (typeof condition.value === "number") {
            if (condition.value < 0 || condition.value > 120) {
                issues.push(`Suspicious value for ${field}: ${condition.value}`);
            }
        }
    });

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
