module.exports = (client, voiceConnections, voiceActivityCollection, voiceActivityIntervals, msToTime) => {
  // Listen for voice state updates
  client.on("voiceStateUpdate", async (oldState, newState) => {
    // Extract relevant information from the state
    const userId = newState.member.id;
    const guildId = newState.guild.id;
    const userGuildKey = `${userId}-${guildId}`;

    // Check if the user joined a voice channel
    if (!oldState.channelId && newState.channelId) {
      // User joined a voice channel
      const joinedAt = new Date();
      voiceConnections.set(userGuildKey, joinedAt);

      // Update the join time in the database
      try {
        await voiceActivityCollection.updateOne(
          { userId, guildId },
          { $set: { joinedAt } },
          { upsert: true }
        );
      } catch (error) {
        console.error("Error updating join time in voiceActivityCollection:", error);
      }

      // Set an interval to update the time spent in voice chat
      voiceActivityIntervals[userGuildKey] = setInterval(async () => {
        const currentTime = new Date();
        const timeSpent = currentTime - joinedAt;

        // Update the time spent in the database
        try {
          await voiceActivityCollection.updateOne(
            { userId, guildId },
            { $set: { timeSpent } },
            { upsert: true }
          );
        } catch (error) {
          console.error("Error updating time spent in voiceActivityCollection:", error);
        }
      }, 2000);
    } else if (oldState.channelId && !newState.channelId) {
      // User left a voice channel
      clearInterval(voiceActivityIntervals[userGuildKey]);
      delete voiceActivityIntervals[userGuildKey];
      voiceConnections.delete(userGuildKey);

      // Calculate the total time spent in the voice channel
      const timeSpent = new Date() - voiceConnections.get(userGuildKey);

      // Update the total time spent in the database
      try {
        await voiceActivityCollection.updateOne(
          { userId, guildId },
          { $inc: { totalTimeSpent: timeSpent } }
        );
      } catch (error) {
        console.error("Error updating total time spent in voiceActivityCollection:", error);
      }
    }
  });
};
