const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * infer primitive data type 
 */
function inferType(value) {
  if (value === null || value === undefined || value === "") return "string";
  if (!isNaN(value) && value !== "") return "number";
  if (value === "TRUE" || value === "FALSE") return "boolean";
  return "string";
}

/**
 * Load a CSV file into memory
 */
function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .on("error", (err) => reject(err))
      .pipe(csv({
        separator: ",",
        mapHeaders: ({ header }) =>
          header.replace(/\ufeff/g, "").trim(),
        mapValues: ({ value }) =>
          typeof value === "string" ? value.trim() : value
      }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
}

/**
 * Main loader: patients + samples
 */
async function loadDataset() {
  try {
    const patientPath = path.join(__dirname, "../data/patient.csv");
    const samplePath = path.join(__dirname, "../data/sample.csv");

    const patients = await loadCSV(patientPath);
    const samples = await loadCSV(samplePath);

    // Index patients by patient_id
    const patientMap = {};
    patients.forEach((p) => {
        patientMap[String(p.patient_id).trim()] = p;
    });

    // Join sample + patient
    const joined = samples.map((sample) => {
        const patient = patientMap[String(sample.patient_id).trim()] || {};
      return {
        ...sample,
        ...patient
      };
    });

    // Infer column metadata
    const columns = {};
    joined.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!columns[key]) {
          columns[key] = inferType(row[key]);
        }
      });
    });

    return {
      rows: joined,
      columns,
      stats: {
        patientCount: patients.length,
        sampleCount: samples.length,
        joinedCount: joined.length
      }
    };
  } catch (error) {
    console.error("CSV loading failed:", error);
    throw error;
  }
}

module.exports = {
  loadDataset
};
