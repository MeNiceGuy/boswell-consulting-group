// Compliance Readiness Checker
// Pure question data and scoring logic. No storage, no tracking.
// A working self-check based on professional judgment, NOT legal or compliance advice.

var QUESTIONS = [
  {
    id: "policies",
    title: "1. Written policies and procedures",
    yesLooksLike: "Yes looks like this: you have a written set of policies and procedures that your staff can actually find and read.",
    whyItMatters: "Without written policies, every caregiver works from memory, and you cannot prove what you require."
  },
  {
    id: "documentation",
    title: "2. Documentation timeliness practices",
    yesLooksLike: "Yes looks like this: visit notes and care documentation get completed and turned in on a set schedule, not whenever someone gets around to it.",
    whyItMatters: "Late documentation leaves gaps you cannot reconstruct when a client, family member, or surveyor asks what happened."
  },
  {
    id: "training",
    title: "3. Caregiver training records",
    yesLooksLike: "Yes looks like this: every caregiver has a training record showing what they completed, when, and who signed off.",
    whyItMatters: "If you cannot show who was trained on what, you cannot defend your staffing decisions."
  },
  {
    id: "background",
    title: "4. Background check records",
    yesLooksLike: "Yes looks like this: you keep a record of the background check for every caregiver, completed before they start client work.",
    whyItMatters: "Missing background check records leave you exposed on the most basic safety question there is."
  },
  {
    id: "emergency",
    title: "5. Emergency preparedness plans",
    yesLooksLike: "Yes looks like this: you have a written plan for emergencies like power outages, severe weather, and medical crises, and caregivers know it.",
    whyItMatters: "An emergency is the worst time to discover that nobody knows what to do."
  },
  {
    id: "agreements",
    title: "6. Client service agreements",
    yesLooksLike: "Yes looks like this: every client signs a written agreement spelling out services, rates, and responsibilities before care starts.",
    whyItMatters: "Without a signed agreement, misunderstandings about services and payment become your problem alone."
  },
  {
    id: "incidents",
    title: "7. Incident reporting process",
    yesLooksLike: "Yes looks like this: caregivers know exactly what to report, who to call, and how quickly, and every report is written down.",
    whyItMatters: "Unreported or unrecorded incidents repeat, and you cannot fix what nobody wrote down."
  },
  {
    id: "supervision",
    title: "8. Supervision and visit notes",
    yesLooksLike: "Yes looks like this: a supervisor reviews client care regularly, and visit notes are on file for every scheduled shift.",
    whyItMatters: "Without supervision records, you have no proof that the care you billed for actually happened."
  },
  {
    id: "privacy",
    title: "9. Privacy practices for client information",
    yesLooksLike: "Yes looks like this: you have clear rules for who sees client information and how it is stored, and staff follow them.",
    whyItMatters: "Client information in the wrong hands is a trust problem you may not recover from."
  },
  {
    id: "credentials",
    title: "10. Caregiver credential tracking",
    yesLooksLike: "Yes looks like this: you track licenses, certifications, and expiration dates for every caregiver and renew before they lapse.",
    whyItMatters: "An expired credential you missed can pull a caregiver off an assignment and put clients at risk."
  },
  {
    id: "rights",
    title: "11. Client rights documentation",
    yesLooksLike: "Yes looks like this: clients receive and acknowledge their rights in writing, including how to file a complaint.",
    whyItMatters: "Clients who do not know their rights have no fair way to raise problems, and you have no record they were told."
  },
  {
    id: "reviews",
    title: "12. Routine quality reviews",
    yesLooksLike: "Yes looks like this: someone reviews records, visit notes, and complaints on a regular schedule and writes down what was found.",
    whyItMatters: "Without regular reviews, small problems stay small only until they are not."
  }
];

// answers: object mapping question id -> "yes" or "no"
// Returns { yesCount, total, score, gaps, unanswered }
// score is rounded percent = yesCount / total * 100, computed transparently.
function scoreAnswers(answers) {
  var yesCount = 0;
  var gaps = [];
  var unanswered = [];

  QUESTIONS.forEach(function (q) {
    var a = answers[q.id];
    if (a === "yes") {
      yesCount += 1;
    } else if (a === "no") {
      gaps.push(q);
    } else {
      unanswered.push(q);
    }
  });

  return {
    yesCount: yesCount,
    total: QUESTIONS.length,
    score: Math.round(yesCount / QUESTIONS.length * 100),
    gaps: gaps,
    unanswered: unanswered
  };
}

// Band label is professional judgment, shown with the score.
function bandLabel(score) {
  if (score >= 90) {
    return "Strong foundation";
  }
  if (score >= 70) {
    return "Mostly there";
  }
  if (score >= 40) {
    return "Work to do";
  }
  return "Start with the basics";
}

// Validate that every question has a yes or no answer.
function validateAnswers(answers) {
  var r = scoreAnswers(answers);
  var errors = [];
  if (r.unanswered.length > 0) {
    errors.push("Answer every question before scoring. Still blank: " +
      r.unanswered.map(function (q) { return q.title; }).join("; ") + ".");
  }
  return errors;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    QUESTIONS: QUESTIONS,
    scoreAnswers: scoreAnswers,
    bandLabel: bandLabel,
    validateAnswers: validateAnswers
  };
}
