// Import dependencies
const axios = require('axios');

// Mapping of weather conditions to emojis
const weatherEmojis = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Snow': '❄️',
  'Thunderstorm': '⛈️',
  'Drizzle': '🌦️',
  'Mist': '🌫️',
};

module.exports = {
  name: 'weather',
  description: 'Displays the current weather for a specified location',
  detailedDescription: 'Use `k!weather [location]` to display the current weather for the specified location.',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('Please specify a location!');
    }

    const location = args.join(' ');
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const { data } = response;
      const weatherCondition = data.weather[0].main;
      const emoji = weatherEmojis[weatherCondition] || '';

      const weatherInfo = `The current weather in ${data.name} is ${data.weather[0].description} ${emoji} with a temperature of :thermometer:${data.main.temp}°C.`;
      message.reply(weatherInfo);
    } catch (error) {
      console.error('Weather command error:', error);
      message.reply('Failed to retrieve weather data. Please ensure the location is correct.');
    }
  },
};
