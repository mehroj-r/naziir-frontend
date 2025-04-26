export const QUIZ_TYPES = [
  "GENERAL_TRAINING",
  "LAB",
  "LECTURE",
  "MIDTERM",
  "FINAL",
  "EXAM",
];

export const QUIZ_TYPE_OPTIONS = QUIZ_TYPES.map((item) => ({
  label: item,
  value: item,
}));

// When to reveal if revealAt not provided: IMMEDIATE (as soon as student finishes the quiz), GRADING_COMPLETE (When professor finishes grading), CUSTOM (when revealAt set)
export const REVEAL_MODES = ["IMMEDIATE", "GRADING_COMPLETE", "CUSTOM"];

export const REVEAL_MODE_OPTIONS = REVEAL_MODES.map(item => ({
  label: item,
  value: item
}))

export const QUIZ_STATUSES = [
  "DRAFT",
  "OPEN",
  "SCHEDULED",
  "CLOSED"
]

export const QUIZ_STATUS_OPTIONS = [
  {
    label: "Draft",
    value: "DRAFT",
  },
  {
    label: "Ongoing",
    value: "OPEN",
  },
  {
    label: "Upcoming",
    value: "SCHEDULED",
  },
  {
    label: "Past",
    value: "CLOSED"
  },
]