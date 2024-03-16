// Import necessary classes from discord.js for message embedding and button actions
const {
  EmbedBuilder, // For rich embeds in messages
  ActionRowBuilder, // For organizing components in a row
  ButtonBuilder, // For creating interactive buttons
  ButtonStyle, // Enum for button styles
} = require("discord.js");

// Exporting the module to make it available for use in other files
module.exports = {
  name: "clash", // Command name
  description: "Clash tournament sign-up.", // Short command description
  // Detailed description of the command's functionality
  detailedDescription:
    "Use `k!clash [dd/mm] [description]` to create a sign-up for a League of Legends Clash tournament on the specified date, with an optional description. Simply use `k!clash` to view and sign up for the latest sign-up.",

  // The execute function contains the logic to be executed when the command is called
  async execute(message, args, client) {
    // Accessing the clash collection from the database associated with the client
    const clashCollection = client.dbCollections.clashCollection;

    // If no arguments are provided, the command fetches and displays the latest tournament sign-up
    if (args.length === 0) {
      const latestSignUp = await clashCollection
        .find() // Fetch all sign-ups
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .limit(1) // Limit to the most recent sign-up
        .toArray(); // Convert the cursor to an array

      // If there are no sign-ups, inform the user to create one
      if (latestSignUp.length === 0) {
        message.channel.send(
          "No Clash sign-ups found. Create one with `k!clash [dd/mm] [description]`."
        );
        return; // Exit the function
      }

      // Extract the latest sign-up from the array
      const signUp = latestSignUp[0];
      // Format the list of participants or show a message if there are none
      const participantsText =
        signUp.participants.length > 0
          ? signUp.participants.map((userId) => `<@${userId}>`).join("\n")
          : "None yet. Be the first to sign up!";

      // Create an embed for the latest sign-up
      const clashEmbed = new EmbedBuilder()
        .setColor("#0099ff") // Set the color of the embed
        .setTitle("Latest Clash Tournament Sign-Up") // Set the title
        .setDescription(signUp.description || "No description provided.") // Set the description
        .addFields(
          // Add fields to the embed
          { name: "Date", value: signUp.date, inline: true },
          { name: "Participants", value: participantsText, inline: false }
        )
        .setFooter({ text: "Click the button below to sign up!" }); // Set the footer text

      // Create a row of components (in this case, a single button)
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("clashSignUp") // Set a custom ID for the button to identify it in event handlers
          .setLabel("Sign Up") // Set the text on the button
          .setStyle(ButtonStyle.Primary) // Set the style of the button
      );

      // Send the embed and the row of components to the channel
      message.channel.send({ embeds: [clashEmbed], components: [row] });
    } else {
      // If arguments are provided, assume the first is the date and the rest is the description
      const date = args[0];
      const description = args.slice(1).join(" "); // Join the rest of the arguments to form the description

      // Validation of the date can be added here

      // Create an embed for the new sign-up
      const clashEmbed = new EmbedBuilder()
        .setColor("#0099ff") // Set the color of the embed
        .setTitle("Clash Tournament Sign-Up") // Set the title
        .setDescription(description || "No description provided.") // Set the description
        .addFields(
          // Add fields to the embed
          { name: "Date", value: date },
          { name: "Participants", value: "None yet. Be the first to sign up!" }
        )
        .setFooter({ text: "React to sign up for the tournament!" }); // Set the footer text

      // Create a row of components (in this case, a single button)
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("clashSignUp") // Set a custom ID for the button to identify it in event handlers
          .setLabel("Sign Up") // Set the text on the button
          .setStyle(ButtonStyle.Primary) // Set the style of the button
      );

      // Send the embed and the row of components to the channel and wait for it to be sent
      const sentMessage = await message.channel.send({
        embeds: [clashEmbed],
        components: [row],
      });

      // Insert the new sign-up into the database with the relevant details
      await clashCollection.insertOne({
        messageId: sentMessage.id, // ID of the message the sign-up is in
        channelId: sentMessage.channel.id, // ID of the channel the sign-up was sent to
        date: date, // Date of the tournament
        description: description || "", // Description of the tournament
        participants: [], // Initialize an empty array of participants
        createdAt: new Date(), // Timestamp of the sign-up creation
      });
    }
  },
};
