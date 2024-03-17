// Load environment variables from .env file
require("dotenv").config({ path: "../.env" });

// Import required modules
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

// Import necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Import utility functions
const { connectToMongo } = require("./utilities/mongoDB");
const { initializeVoiceConnection } = require("./utilities/voiceState");

// Client variables
client.commands = new Collection();
client.events = new Collection();

// Voice connection variables
client.voiceConnections = new Map();
client.voiceActivityIntervals = {};

// MongoDB collections initialization - will be assigned when client is ready
client.dbCollections = {};

// Determine the directory paths for commands and events
const commandsDir = path.join(__dirname, "commands");
const eventsDir = path.join(__dirname, "events");

// Load commands
const commandFiles = fs
  .readdirSync(commandsDir)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(path.join(commandsDir, file));
  client.commands.set(command.name, command);
}

// Load events
const eventFiles = fs
  .readdirSync(eventsDir)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(path.join(eventsDir, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Initialize bot
client.once("ready", async () => {
  console.log("Bot is online!");
  // Connect to MongoDB and its collections
  try {
    const db = await connectToMongo();
    // Assign the collections to the client.dbCollections object
    client.dbCollections.voiceActivityCollection =
      db.collection("voiceActivity");
    client.dbCollections.lolAccsCollection = db.collection("lolAccs");
    client.dbCollections.clashCollection = db.collection("clash");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
  // Initialize voice connections
  try {
    if (client.voiceConnections) {
      client.voiceConnections.forEach((connection, guildId) => {
        console.log(`Initializing voice connection for guild ID: ${guildId}`);
        initializeVoiceConnection(connection);
      });
    } else {
      throw new Error("client.voiceConnections is undefined");
    }
  } catch (error) {
    console.error("Error initializing voice connections:", error.message);
  }
});

// Main bot logic
client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if the message starts with the command prefix
  if (message.content.startsWith(process.env.PREFIX)) {
    // Check if the MongoDB collection is available
    if (!client.dbCollections.lolAccsCollection) {
      return message.reply("Error: MongoDB collection not available");
    }

    // Parse the message into command and arguments
    const args = message.content
      .slice(process.env.PREFIX.length)
      .trim()
      .split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    // Ignore unknown commands
    if (!command) {
      return message.reply(
        "Unknown command! Try `k!help` for a list of commands"
      );
    }

    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error("Error executing command:", error);
      message.reply("An error occurred while executing the command");
    }
  }
});

// Express web server
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

app.listen(port, () => {
  console.log(`Express web server started: http://localhost:${port}`);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
