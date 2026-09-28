// Private-Pay Rate Calculator
// Pure calculation and validation logic. No storage, no tracking.

function calculateRate(inputs) {
  var hoursPerWeek = inputs.hoursPerWeek;
  var hourlyCost = inputs.hourlyCost;
  var overhead = inputs.overhead;
  var marginPct = inputs.marginPct;

  var monthlyBillableHours = hoursPerWeek * 52 / 12;
  var monthlyLaborCost = hourlyCost * monthlyBillableHours;
  var totalMonthlyCost = monthlyLaborCost + overhead;
  var costPerHour = totalMonthlyCost / monthlyBillableHours;
  var minRate = costPerHour / (1 - marginPct / 100);
  var recommended = Math.ceil(minRate);
  var grossMarginPct = (recommended - costPerHour) / recommended * 100;
  var monthlyRevenue = recommended * monthlyBillableHours;
  var annualRevenue = monthlyRevenue * 12;

  return {
    monthlyBillableHours: monthlyBillableHours,
    monthlyLaborCost: monthlyLaborCost,
    totalMonthlyCost: totalMonthlyCost,
    costPerHour: costPerHour,
    minRate: minRate,
    recommended: recommended,
    grossMarginPct: grossMarginPct,
    monthlyRevenue: monthlyRevenue,
    annualRevenue: annualRevenue
  };
}

// Returns an array of error strings. Empty array means valid.
function validateInputs(values) {
  var errors = [];

  function check(name, label, raw, allowZero) {
    if (raw === null || raw === undefined || String(raw).trim() === "") {
      errors.push("Enter a number for " + label + ".");
      return;
    }
    var n = Number(raw);
    if (!isFinite(n) || isNaN(n)) {
      errors.push(label + " must be a number.");
      return;
    }
    if (n <= 0 && !allowZero) {
      errors.push(label + " must be greater than zero.");
    }
  }

  check("hourlyCost", "Average caregiver hourly cost (field 1)", values.hourlyCost, false);
  check("hoursPerWeek", "Target billable hours per week (field 2)", values.hoursPerWeek, false);
  check("overhead", "Monthly overhead (field 3)", values.overhead, false);
  check("marginPct", "Desired profit margin (field 4)", values.marginPct, true);

  if (String(values.marginPct).trim() !== "") {
    var m = Number(values.marginPct);
    if (isFinite(m) && !isNaN(m)) {
      if (m < 0) {
        errors.push("Desired profit margin (field 4) must be at least 0.");
      }
      if (m >= 90) {
        errors.push("Desired profit margin (field 4) must be below 90.");
      }
    }
  }

  var marketRaw = values.marketRate;
  if (marketRaw !== null && marketRaw !== undefined && String(marketRaw).trim() !== "") {
    var mk = Number(marketRaw);
    if (!isFinite(mk) || isNaN(mk) || mk <= 0) {
      errors.push("Local market rate (field 5) must be a positive number, or leave it blank.");
    }
  }

  return errors;
}

function marketComparison(recommended, marketRate) {
  var diff = recommended - marketRate;
  if (diff > 0) {
    return "Your recommended rate of $" + recommended + " is $" + diff.toFixed(2) +
      " per hour above the market rate of $" + marketRate.toFixed(2) + " you entered.";
  } else if (diff < 0) {
    return "Your recommended rate of $" + recommended + " is $" + Math.abs(diff).toFixed(2) +
      " per hour below the market rate of $" + marketRate.toFixed(2) + " you entered.";
  }
  return "Your recommended rate of $" + recommended + " matches the market rate you entered.";
}

function fmtMoney(n) {
  return "$" + n.toFixed(2);
}

function fmtHours(n) {
  return n.toFixed(1);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateRate: calculateRate, validateInputs: validateInputs, marketComparison: marketComparison };
}
