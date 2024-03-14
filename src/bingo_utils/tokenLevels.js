// This array represents the various token levels and their corresponding emoji counts.
// Each object within the array holds:
// - `id`: a unique identifier correlating to a specific mastery level and token count.
// - `description`: a human-readable string describing the level and number of tokens.
// - `tokenCount`: the number of tokens earned at this level.
// - `noTokenCount`: the number of additional tokens needed to progress to the next level.

const tokenLevels = [
  {
    id: "602",
    description: "Level 6 - 2 tokens",
    tokenCount: 2,
    noTokenCount: 1,
  },
  {
    id: "601",
    description: "Level 6 - 1 token",
    tokenCount: 1,
    noTokenCount: 2,
  },
  {
    id: "600",
    description: "Level 6 - 0 tokens",
    tokenCount: 0,
    noTokenCount: 3,
  },
  {
    id: "501",
    description: "Level 5 - 1 token",
    tokenCount: 1,
    noTokenCount: 1,
  },
  {
    id: "500",
    description: "Level 5 - 0 tokens",
    tokenCount: 0,
    noTokenCount: 2,
  },
];

module.exports = { tokenLevels };
