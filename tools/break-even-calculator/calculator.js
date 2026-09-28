// Break-Even Calculator
// Pure calculation and validation logic. No storage, no tracking.

function calculateBreakEven(inputs) {
  var fixedCosts = inputs.fixedCosts;
  var revenuePerClient = inputs.revenuePerClient;
  var variablePerClient = inputs.variablePerClient;

  var marginPerClient = revenuePerClient - variablePerClient;

  var result = {
    marginPerClient: marginPerClient,
    possible: marginPerClient > 0
  };

  if (!result.possible) {
    return result;
  }

  var clients = Math.ceil(fixedCosts / marginPerClient);
  var monthlyRevenue = clients * revenuePerClient;
  var annualRevenue = monthlyRevenue * 12;

  result.clients = clients;
  result.monthlyRevenue = monthlyRevenue;
  result.annualRevenue = annualRevenue;

  return result;
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
    if (n < 0) {
      errors.push(label + " cannot be negative.");
      return;
    }
    if (n <= 0 && !allowZero) {
      errors.push(label + " must be greater than zero.");
    }
  }

  check("fixedCosts", "Monthly fixed costs (field 1)", values.fixedCosts, false);
  check("revenuePerClient", "Average revenue per client per month (field 2)", values.revenuePerClient, false);
  check("variablePerClient", "Average variable cost per client per month (field 3)", values.variablePerClient, true);

  return errors;
}

function fmtMoney(n) {
  return "$" + n.toFixed(2);
}

function fmtInt(n) {
  return Math.round(n).toString();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateBreakEven: calculateBreakEven, validateInputs: validateInputs };
}
