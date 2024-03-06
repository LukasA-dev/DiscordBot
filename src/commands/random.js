// Import the shuffle function for randomizing array elements
const { shuffle } = require("../utilities/shuffle");

module.exports = {
  name: "random",
  description: "Performs a random selection based on the provided context.",
  detailedDescription: `This command has two functionalities based on the input provided:
1. Without arguments (k!random): Selects a random user from the voice channel you are currently in. Note: You must be in a voice channel to use this functionality.
2. With a numeric range as an argument (e.g., k!random 1-10): Generates a random number within the specified range, including both the minimum and maximum values.
Usage examples:
- k!random: Randomly selects a user from your current voice channel.
- k!random 1-10: Generates a random number between 1 and 10, inclusive.
- k!random 5-15: Generates a random number between 5 and 15, inclusive.`,

  async execute(message, args) {
    // Check if arguments are provided for number range
    if (args.length > 0 && args[0].includes("-")) {
      const [min, max] = args[0].split("-").map(Number);
      if (!isNaN(min) && !isNaN(max) && min <= max) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return message.reply(
          `Random number between ${min} and ${max}: **${randomNumber}**`
        );
      } else {
        return message.reply(
          "Invalid number range. Usage: `k!random [min]-[max]`"
        );
      }
    }

    // If no number range is provided, proceed to select a random user from the voice channel
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply(
        "You need to be in a voice channel to use this command or provide a number range."
      );
    }

    const members = Array.from(voiceChannel.members.values()).filter(
      (member) => !member.user.bot
    );
    if (members.length === 0) {
      return message.reply("No users found in the voice channel.");
    }

    const shuffledMembers = shuffle(members);
    const randomMember = shuffledMembers[0];

    // Reply with the randomly chosen user's display name
    message.reply(`The randomly chosen user is: <@${randomMember.id}>`);
  },
};
