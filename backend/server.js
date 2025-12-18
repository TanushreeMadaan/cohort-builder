const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { loadDataset } = require("./utils/csvLoader");
const { parseUserQuery } = require("./utils/queryParser");
const { applyFilters } = require("./utils/filterEngine");
const { computeStats } = require("./utils/statsEngine");
const { verifyQuery } = require("./utils/verificationEngine");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

let DATASET = null;

(async () => {
    try {
        DATASET = await loadDataset();
        console.log("Dataset loaded:");
        console.log(DATASET.stats);
    } catch (err) {
        console.error("Failed to load dataset. Exiting.");
        process.exit(1);
    }
})();

function enrichColumnsWithExamples(rows, columns) {
    const enriched = {};

    for (const col of Object.keys(columns)) {
        const values = new Set();

        for (const r of rows) {
            if (r[col]) values.add(String(r[col]));
            if (values.size >= 5) break;
        }

        enriched[col] = {
            type: columns[col],
            examples: Array.from(values)
        };
    }

    return enriched;
}

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        datasetLoaded: !!DATASET,
        stats: DATASET?.stats
    });
});

app.post("/api/debug/parse", async (req, res) => {
    try {
        const { query } = req.body;
        const parsed = await parseUserQuery(query, DATASET.columns);
        res.json(parsed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/query", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Invalid query" });
        }

        const enrichedColumns = enrichColumnsWithExamples(
            DATASET.rows,
            DATASET.columns
        );

        const parsed = await parseUserQuery(query, enrichedColumns);

        if (parsed.clarification_requests?.length) {
            return res.json({
                query,
                filters: parsed.filters || {},
                clarification_requests: parsed.clarification_requests,
                assumptions: parsed.assumptions || [],
                confidence: parsed.confidence,
                results: DATASET.rows,
                count: 0,
                stats: null
            });
        }

        const results = DATASET.rows
        const stats = computeStats(results);
        const verification = verifyQuery(parsed.filters, stats);

        res.json({
            query,
            filters: parsed.filters,
            results,
            count: results.length,
            ambiguities: parsed.ambiguities,
            assumptions: parsed.assumptions,
            confidence: parsed.confidence,
            clarification_needed: parsed.clarification_needed
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
