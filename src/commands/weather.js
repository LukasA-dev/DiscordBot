// Import necessary modules
const axios = require("axios"); // HTTP client for making requests to the OpenWeather API
const { EmbedBuilder } = require("discord.js"); // Embed message for displaying weather information
const { roundToTenth } = require("../utilities/roundToTenth"); // Utility function for rounding temperatures

// Emoji representations for various weather conditions
const weatherEmojis = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Snow: "❄️",
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Mist: "🌫️",
};

module.exports = {
  name: "weather",
  description: "Displays the current weather for a specified location",
  // Detailed instructions for using the weather command
  detailedDescription:
    "Use `k!weather [location]` to display the current weather for the specified location.",
  async execute(message, args) {
    // Ensure a location is specified
    if (!args.length) {
      return message.reply("Please specify a location!");
    }

    // Construct the API request URL
    const location = args.join(" ");
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${apiKey}&units=metric`;

    try {
      // Fetch weather data from the OpenWeather API
      const response = await axios.get(url);
      const { data } = response;
      const weatherCondition = data.weather[0].main; // Primary weather condition
      const emoji = weatherEmojis[weatherCondition] || ""; // Corresponding emoji or empty string if not found

      // Round temperature and "feels like" temperature to the nearest tenth
      const roundedTemp = roundToTenth(data.main.temp);
      const roundedFeelsLike = roundToTenth(data.main.feels_like);

      const weatherEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Weather in ${data.name}`)
        .setDescription(`${data.weather[0].description} ${emoji}`)
        .addFields(
          {
            name: "Temperature",
            value: `${roundedTemp}°C :thermometer:`,
            inline: true,
          },
          {
            name: "Feels Like",
            value: `${roundedFeelsLike}°C :thermometer:`,
            inline: true,
          }
        )
        .setFooter({ text: "Weather data provided by OpenWeather" })
        .setTimestamp();

      message.channel.send({ embeds: [weatherEmbed] });
    } catch (error) {
      console.error("Weather command error:", error);
      message.reply(
        "Failed to retrieve weather data. Please ensure the location is correct."
      );
    }
  },
};
