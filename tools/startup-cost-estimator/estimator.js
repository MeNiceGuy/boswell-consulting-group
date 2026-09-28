// Startup Cost Estimator
// Pure calculation and validation logic. No storage, no tracking.
// All ranges are illustrative planning ranges based on professional judgment, NOT quotes.

var US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

// Fixed illustrative ranges (professional judgment, not quotes).
var RANGES = {
  licensing: { low: 500, high: 2500 },
  insurance: { low: 3000, high: 8000 },
  officeHome: { low: 300, high: 1000 },
  officeLeased: { low: 2000, high: 8000 },
  marketing: { low: 1500, high: 5000 },
  certification: { low: 2000, high: 10000 }
};

// Illustrative monthly burn model (professional judgment):
// $2,000 to $3,000 per month owner/admin base, plus
// $2,500 to $4,000 per month per planned staff member (wages, payroll taxes, insurance).
// Working capital = 3 months of that burn.
function monthlyBurn(staffCount) {
  return {
    low: 2000 + staffCount * 2500,
    high: 3000 + staffCount * 4000
  };
}

function calculateEstimate(inputs) {
  var staff = inputs.staffCount;
  var burn = monthlyBurn(staff);

  var lines = [];

  lines.push({
    key: "licensing",
    label: "Licensing and fees (varies by state)",
    low: RANGES.licensing.low,
    high: RANGES.licensing.high
  });

  if (inputs.model === "medicare") {
    lines.push({
      key: "certification",
      label: "Medicare certification related costs (survey prep, consulting, accreditation)",
      low: RANGES.certification.low,
      high: RANGES.certification.high
    });
  }

  lines.push({
    key: "insurance",
    label: "Insurance: general liability plus workers comp (first year)",
    low: RANGES.insurance.low,
    high: RANGES.insurance.high
  });

  if (inputs.location === "leased") {
    lines.push({
      key: "office",
      label: "Office setup (leased office)",
      low: RANGES.officeLeased.low,
      high: RANGES.officeLeased.high
    });
  } else {
    lines.push({
      key: "office",
      label: "Office setup (home based, kept minimal)",
      low: RANGES.officeHome.low,
      high: RANGES.officeHome.high
    });
  }

  lines.push({
    key: "marketing",
    label: "Initial marketing (website, listings, referral outreach)",
    low: RANGES.marketing.low,
    high: RANGES.marketing.high
  });

  lines.push({
    key: "workingCapital",
    label: "Working capital (3 months of illustrative monthly burn)",
    low: burn.low * 3,
    high: burn.high * 3
  });

  var totalLow = lines.reduce(function (s, l) { return s + l.low; }, 0);
  var totalHigh = lines.reduce(function (s, l) { return s + l.high; }, 0);

  return {
    lines: lines,
    totalLow: totalLow,
    totalHigh: totalHigh,
    monthlyBurnLow: burn.low,
    monthlyBurnHigh: burn.high
  };
}

// Returns an array of error strings. Empty array means valid.
function validateInputs(values) {
  var errors = [];

  if (!values.state || US_STATES.indexOf(values.state) === -1) {
    errors.push("Choose your state (field 1).");
  }

  if (values.model !== "nonmedical" && values.model !== "medicare") {
    errors.push("Choose a business model (field 2): non-medical home care or Medicare-certified home health.");
  }

  if (values.location !== "home" && values.location !== "leased") {
    errors.push("Choose a location (field 3): home-based or leased office.");
  }

  var staffRaw = values.staffCount;
  if (staffRaw === null || staffRaw === undefined || String(staffRaw).trim() === "") {
    errors.push("Enter a number for planned initial staff count (field 4).");
  } else {
    var n = Number(staffRaw);
    if (!isFinite(n) || isNaN(n) || Math.floor(n) !== n) {
      errors.push("Planned initial staff count (field 4) must be a whole number.");
    } else if (n < 0 || n > 100) {
      errors.push("Planned initial staff count (field 4) must be between 0 and 100.");
    }
  }

  return errors;
}

function fmtMoney(n) {
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fmtRange(low, high) {
  return fmtMoney(low) + " to " + fmtMoney(high);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateEstimate: calculateEstimate,
    validateInputs: validateInputs,
    US_STATES: US_STATES,
    monthlyBurn: monthlyBurn,
    fmtMoney: fmtMoney,
    fmtRange: fmtRange
  };
}
