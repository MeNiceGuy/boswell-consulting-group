// Client Acquisition Cost Calculator
// Pure calculation and validation logic. No storage, no tracking.

// Benchmark: published industry research (Activated Insights data reported by
// Home Health Care News, July 2025) reports an average client acquisition
// cost of $845 per client in 2024. Labeled explicitly in the UI as published
// industry research, not a Boswell Consulting Group measurement.
var INDUSTRY_BENCHMARK_2024 = 845;

function calculateCAC(inputs) {
  var channels = [
    { name: "Referral outreach", spend: inputs.referralSpend, clients: inputs.referralClients },
    { name: "Online and reviews", spend: inputs.onlineSpend, clients: inputs.onlineClients },
    { name: "Paid advertising", spend: inputs.paidSpend, clients: inputs.paidClients }
  ];

  var totalSpend = 0;
  var totalClients = 0;
  var perChannel = channels.map(function (ch) {
    var spend = ch.spend;
    var clients = ch.clients;
    totalSpend += spend;
    totalClients += clients;
    var cac = null;
    if (clients > 0) {
      cac = spend / clients;
    }
    return {
      name: ch.name,
      spend: spend,
      clients: clients,
      cac: cac,
      hasStarts: clients > 0
    };
  });

  var blended = null;
  if (totalClients > 0) {
    blended = totalSpend / totalClients;
  }

  return {
    perChannel: perChannel,
    totalSpend: totalSpend,
    totalClients: totalClients,
    blended: blended
  };
}

// Returns an array of error strings. Empty array means valid.
function validateInputs(values) {
  var errors = [];

  function check(label, raw, fieldNum) {
    if (raw === null || raw === undefined || String(raw).trim() === "") {
      return null; // optional
    }
    var n = Number(raw);
    if (!isFinite(n) || isNaN(n)) {
      errors.push(label + " (field " + fieldNum + ") must be a number, or leave it blank.");
      return null;
    }
    if (n < 0) {
      errors.push(label + " (field " + fieldNum + ") cannot be negative.");
      return null;
    }
    return n;
  }

  function checkClients(label, raw, fieldNum) {
    if (raw === null || raw === undefined || String(raw).trim() === "") {
      return null; // optional
    }
    var n = Number(raw);
    if (!isFinite(n) || isNaN(n)) {
      errors.push(label + " (field " + fieldNum + ") must be a whole number, or leave it blank.");
      return null;
    }
    if (n < 0 || Math.floor(n) !== n) {
      errors.push(label + " (field " + fieldNum + ") must be a whole number of 0 or more.");
      return null;
    }
    return n;
  }

  var parsed = {
    referralSpend: check("Channel 1 monthly spend", values.referralSpend, 1),
    referralClients: checkClients("Channel 1 new clients", values.referralClients, 2),
    onlineSpend: check("Channel 2 monthly spend", values.onlineSpend, 3),
    onlineClients: checkClients("Channel 2 new clients", values.onlineClients, 4),
    paidSpend: check("Channel 3 monthly spend", values.paidSpend, 5),
    paidClients: checkClients("Channel 3 new clients", values.paidClients, 6)
  };

  function pairComplete(spend, clients) {
    return spend !== null && clients !== null;
  }

  var anyPair =
    pairComplete(parsed.referralSpend, parsed.referralClients) ||
    pairComplete(parsed.onlineSpend, parsed.onlineClients) ||
    pairComplete(parsed.paidSpend, parsed.paidClients);

  if (!anyPair) {
    errors.push("Fill in both the spend and the client count for at least one channel.");
  }

  return errors;
}

function fmtMoney(n) {
  return "$" + n.toFixed(2);
}

function benchmarkLine(blended) {
  var base = "Published industry research (Activated Insights, via Home Health Care News, July 2025) puts the average client acquisition cost at $" +
    INDUSTRY_BENCHMARK_2024 + " per client in 2024. That figure comes from industry research, not from our measurement.";
  if (blended === null) {
    return base;
  }
  var diff = blended - INDUSTRY_BENCHMARK_2024;
  if (diff < 0) {
    return base + " Your blended cost of " + fmtMoney(blended) + " sits " +
      fmtMoney(Math.abs(diff)) + " below that benchmark.";
  } else if (diff > 0) {
    return base + " Your blended cost of " + fmtMoney(blended) + " sits " +
      fmtMoney(diff) + " above that benchmark.";
  }
  return base + " Your blended cost of " + fmtMoney(blended) + " matches that benchmark.";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateCAC: calculateCAC,
    validateInputs: validateInputs,
    benchmarkLine: benchmarkLine,
    INDUSTRY_BENCHMARK_2024: INDUSTRY_BENCHMARK_2024
  };
}
