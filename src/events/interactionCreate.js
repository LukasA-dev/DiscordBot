const { EmbedBuilder } = require("discord.js"); // Import the EmbedBuilder class from discord.js to create rich embeds

module.exports = {
  name: "interactionCreate", // Event name that this file handles
  async execute(interaction) {
    // Asynchronous function to handle interactions
    if (!interaction.isButton()) return; // If the interaction is not a button click, do nothing

    // Destructuring to extract useful properties from the interaction object
    const { customId, message, user } = interaction;

    // Check if the interaction is specifically for the Clash sign-up button
    if (customId === "clashSignUp") {
      await interaction.deferUpdate(); // Defer the interaction to prevent immediate response, allowing for asynchronous operations

      // Access the database collection for Clash sign-ups through the client's stored collections
      const clashCollection = interaction.client.dbCollections.clashCollection;

      try {
        // Attempt to find the corresponding sign-up document in the database using the message ID
        const signUp = await clashCollection.findOne({ messageId: message.id });

        if (!signUp) {
          // If no sign-up is found for this message, log an error
          console.error("Clash sign-up not found.");
          // Additional user feedback could be provided here
          return;
        }

        // Check if the user who clicked the button is already in the sign-up's participants list
        if (signUp.participants.includes(user.id)) {
          // Additional feedback to the user could be provided here if they're already signed up
          return;
        }

        // Add the user's ID to the participants list of the sign-up document
        await clashCollection.updateOne(
          { messageId: message.id },
          { $push: { participants: user.id } } // MongoDB's $push operator adds an element to an array
        );

        // Fetch the sign-up document again to get the updated list of participants
        const updatedSignUp = await clashCollection.findOne({
          messageId: message.id,
        });
        const updatedParticipantIds = updatedSignUp.participants;

        // Map each participant ID to their nickname or username in the guild
        const participantNames = await Promise.all(
          updatedParticipantIds.map(async (userId) => {
            try {
              const member = await interaction.guild.members.fetch(userId); // Fetch member object from the guild
              return member.nickname ? member.nickname : member.user.username; // Use nickname if available, otherwise default to username
            } catch (error) {
              console.error(`Could not fetch member with ID ${userId}:`, error);
              return "Unknown Member"; // Fallback text for unresolvable IDs
            }
          })
        );

        // Update the original embed with the new list of participants
        const updatedEmbed = new EmbedBuilder(message.embeds[0]).spliceFields(
          2, // Index of the field to replace
          1, // Number of fields to remove at the specified index
          {
            name: "Participants",
            value:
              participantNames.join("\n") ||
              "None yet. Be the first to sign up!", // Join participant names with newlines, or show a default message
          }
        );

        await message.edit({ embeds: [updatedEmbed] }); // Edit the original message with the updated embed
      } catch (error) {
        console.error("Error handling Clash sign-up interaction:", error);
      }
    }
  },
};
