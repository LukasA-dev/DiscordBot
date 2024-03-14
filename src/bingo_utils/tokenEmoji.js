// Function to create an emoji string based on the token level for a champion.
const getEmojiString = (tokenCount, noTokenCount) => {
  const tokenEmoji = "<:token:1217625094180831232>"; // Custom emoji for a mastery token
  const noTokenEmoji = "<:noToken:1217628482964684811>"; // Custom emoji for a missing token

  // Return a string of emojis based on the token counts
  return `${Array(tokenCount).fill(tokenEmoji).join(" ")} ${Array(noTokenCount)
    .fill(noTokenEmoji)
    .join(" ")}`.trim();
};

module.exports = { getEmojiString };
