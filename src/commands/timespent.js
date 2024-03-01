// Import necessary dependencies
const { msToTime } = require("../utilities/timeUtilities");

module.exports = {
  name: "timespent",
  description: "Check the time spent in voice channels",
  detailedDescription: "Use `k!timespent total` to check the total time spent in voice channels, or `k!timespent @user` to check the time spent by a specific user.",
  async execute(message, args, client) {
    let userId;
    let showTotal = false;

    // Check if the "total" argument is provided
    if (args[0] === "total") {
      showTotal = true;
      args.shift(); // Remove the "total" argument
    }

    // Determine the user ID
    if (message.mentions.users.first()) {
      userId = message.mentions.users.first().id;
    } else {
      userId = message.author.id;
    }

    // Get the guild ID
    const guildId = message.guild.id;
    console.log(`Fetching voice activity for user ${userId} in guild ${guildId}`);

    // Query the voice activity collection
    const activity = await client.voiceActivityCollection.findOne({ userId, guildId });

    if (activity) {
      const timeSpent = activity.timeSpent;
      const totalTimeSpent = activity.totalTimeSpent || 0; // Use 0 if totalTimeSpent doesn't exist yet
      const readableTime = msToTime(timeSpent);
      const readableTotalTime = msToTime(totalTimeSpent);

      // Respond with the time spent in voice channels
      if (showTotal) {
        message.reply(`<@${userId}> has wasted ${readableTotalTime} in total :skull:`);
      } else {
        message.reply(`<@${userId}> has wasted ${readableTime} in this session :skull:`);
      }
    } else {
      message.reply(`No voice activity recorded for <@${userId}> on this server.`);
    }
  },
};
