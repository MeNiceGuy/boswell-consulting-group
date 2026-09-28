// Caregiver Turnover Cost Calculator
// Pure calculation and validation logic. No storage, no tracking.

function calculateTurnover(inputs) {
  var staff = inputs.staff;
  var turnoverPct = inputs.turnoverPct;
  var costPerHire = inputs.costPerHire;

  var turnoverRate = turnoverPct / 100;
  var hiresPerYear = staff * turnoverRate;
  var annualTurnoverCost = hiresPerYear * costPerHire;
  var costPerStaffPerYear = staff > 0 ? annualTurnoverCost / staff : 0;

  var reducedPct = Math.max(0, turnoverPct - 10);
  var reducedCost = staff * (reducedPct / 100) * costPerHire;
  var savingsTenPoint = annualTurnoverCost - reducedCost;

  return {
    hiresPerYear: hiresPerYear,
    annualTurnoverCost: annualTurnoverCost,
    costPerStaffPerYear: costPerStaffPerYear,
    reducedPct: reducedPct,
    reducedCost: reducedCost,
    savingsTenPoint: savingsTenPoint
  };
}

// Returns an array of error strings. Empty array means valid.
function validateInputs(values) {
  var errors = [];

  function check(name, label, raw, opts) {
    if (raw === null || raw === undefined || String(raw).trim() === "") {
      errors.push("Enter a number for " + label + ".");
      return;
    }
    var n = Number(raw);
    if (!isFinite(n) || isNaN(n)) {
      errors.push(label + " must be a number.");
      return;
    }
    if (opts.min !== undefined && n < opts.min) {
      errors.push(label + " must be at least " + opts.min + ".");
    }
    if (opts.max !== undefined && n > opts.max) {
      errors.push(label + " cannot be more than " + opts.max + ".");
    }
  }

  check("staff", "Number of caregivers on staff (field 1)", values.staff, { min: 1 });
  check("turnoverPct", "Annual turnover percent (field 2)", values.turnoverPct, { min: 0, max: 100 });
  check("costPerHire", "Average cost per hire (field 3)", values.costPerHire, { min: 1 });

  return errors;
}

function fmtMoney(n) {
  return "$" + n.toFixed(2);
}

function fmtWhole(n) {
  return n.toFixed(1);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateTurnover: calculateTurnover, validateInputs: validateInputs };
}
