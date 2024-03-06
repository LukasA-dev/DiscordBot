// Import the shuffle function; and EmbedBuilder from discord.js
const { shuffle } = require("../utilities/shuffle");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "teams",
  description:
    "Splits voice channel members into specified number of random teams.",
  detailedDescription:
    "Splits voice channel members of caller's current voice channel into specified number of random teams.",
  execute(message, args) {
    const voiceChannel = message.member.voice.channel; // Get the voice channel of the message author
    const teamCount = parseInt(args[0], 10); // Parse the first argument to get the number of teams

    // If the user is not in a voice channel, send an error message
    if (!voiceChannel) {
      return message.reply(
        "You need to be in a voice channel to use this command."
      );
    }

    // Convert the voice channel members collection into an array
    const members = Array.from(voiceChannel.members.values());
    // If there are not enough members for the specified number of teams, send an error message
    if (members.length < teamCount) {
      return message.reply(
        `Not enough members in the voice channel for ${teamCount} teams.`
      );
    }

    // Shuffle the array of members
    const shuffledMembers = shuffle([...members]);
    // Create an array to hold the teams with the length equal to the number of teams
    const teams = Array.from({ length: teamCount }, () => []);

    // Distribute the shuffled members evenly across the teams
    shuffledMembers.forEach((member, index) => {
      teams[index % teamCount].push(member);
    });

    // Embed message to display the teams
    const teamEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Team Split into ${teamCount}`)
      .setTimestamp();

    // Add each team as a field in the embed message
    teams.forEach((team, index) => {
      teamEmbed.addFields({
        name: `Team ${index + 1}`, // The field title, which is the team number
        // The field value lists the members of the team
        value:
          team.map((member) => member.displayName).join("\n") || "No members",
        inline: true, // Set the field to inline; so they appear side by side
      });
    });

    // Send the embed message to the channel where the command was called
    message.channel.send({ embeds: [teamEmbed] });
  },
};
