function toNumber(value) {
    if (value === undefined || value === null) return null;
    const num = Number(String(value).trim());
    return isNaN(num) ? null : num;
  }
  
  function computeStats(rows) {
    if (!Array.isArray(rows)) {
        throw new Error("computeStats expects an array of rows");
      }
    const stats = {
      count: rows.length,
      age: {
        diagnosis: { min: null, max: null, avg: null },
        specimen: { min: null, max: null, avg: null }
      },
      genderBreakdown: {}
    };
  
    let ageDxSum = 0, ageDxCount = 0;
    let ageSpSum = 0, ageSpCount = 0;
  
    rows.forEach((row) => {
      // Gender
      if (row.gender) {
        const g = row.gender;
        stats.genderBreakdown[g] = (stats.genderBreakdown[g] || 0) + 1;
      }
  
      // Age at diagnosis
      const ageDx = toNumber(row.age_at_diagnosis);
      if (ageDx !== null) {
        stats.age.diagnosis.min =
          stats.age.diagnosis.min === null ? ageDx : Math.min(stats.age.diagnosis.min, ageDx);
        stats.age.diagnosis.max =
          stats.age.diagnosis.max === null ? ageDx : Math.max(stats.age.diagnosis.max, ageDx);
        ageDxSum += ageDx;
        ageDxCount++;
      }
  
      // Age at specimen acquisition
      const ageSp = toNumber(row.age_at_specimen_acquisition);
      if (ageSp !== null) {
        stats.age.specimen.min =
          stats.age.specimen.min === null ? ageSp : Math.min(stats.age.specimen.min, ageSp);
        stats.age.specimen.max =
          stats.age.specimen.max === null ? ageSp : Math.max(stats.age.specimen.max, ageSp);
        ageSpSum += ageSp;
        ageSpCount++;
      }
    });
  
    if (ageDxCount > 0) {
      stats.age.diagnosis.avg = +(ageDxSum / ageDxCount).toFixed(1);
    }
    if (ageSpCount > 0) {
      stats.age.specimen.avg = +(ageSpSum / ageSpCount).toFixed(1);
    }
  
    return stats;
  }
  
  module.exports = {
    computeStats
  };
  