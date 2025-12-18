function toNumber(value) {
    if (value === undefined || value === null) return null;
    const num = Number(String(value).trim());
    return isNaN(num) ? null : num;
}

function applyFilters(rows, filters) {
    let excludedMissing = 0;

    if (!filters || Object.keys(filters).length === 0) {
        return { results: rows, excludedMissing: 0 };
    }

    const results = rows.filter((row) => {
        return Object.entries(filters).every(([column, condition]) => {
            const { operator, value } = condition;
            const rowValue = row[column];

            if (rowValue === undefined || rowValue === null || rowValue === "") {
                excludedMissing++;
                return false;
            }

            const rowNumber = toNumber(String(rowValue).trim());
            const valueNumber = toNumber(value);

            switch (operator) {
                case "=":
                    return String(rowValue).toLowerCase() === String(value).toLowerCase();

                case ">":
                    return !isNaN(rowNumber) && rowNumber > valueNumber;

                case "<":
                    return !isNaN(rowNumber) && rowNumber < valueNumber;

                case ">=":
                    return !isNaN(rowNumber) && rowNumber >= valueNumber;

                case "<=":
                    return !isNaN(rowNumber) && rowNumber <= valueNumber;

                case "contains":
                    return String(rowValue)
                        .toLowerCase()
                        .includes(String(value).toLowerCase());

                case "in":
                    return Array.isArray(value) && value.map(String).includes(String(rowValue));

                default:
                    return false;
            }
        });
    });

    return { results, excludedMissing };
}

module.exports = {
    applyFilters
};
