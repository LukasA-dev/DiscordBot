# Kebab BOT

## Project Overview

This Discord bot is developed by me, as a part of my ongoing learning, transforming theoretical knowledge into practical solutions. The main focus of this project is to enhance my understanding of asynchronous programming, API integration, using a NoSQL database and real-time data processing.

## Tech Stack

- **Node.js**: Powers the bot with its event-driven architecture, ideal for scalable applications.
- **discord.js**: For an easy interaction with the Discord API, allowing the bot to listen and respond to server events and messages.
- **MongoDB**: Stores user data and command responses, providing flexibility and efficient data retrieval.
- **PM2**: Manages the bot process, ensuring uptime and handling logging.

## Design and Architecture

- **API**: Leveraging free API's from various resources eg, `weather.js` using OpenWeather weather statistics.
- **Modular Commands**: Making the codebase easy to navigate and update.
- **Event-Driven**: Utilizes Discord.js events like `messageCreate` and `voiceStateUpdate` for real-time data handling.
- **Database Integration**: MongoDB is integrated for persistent storage, with collections `voiceActivity` to track user data.
- **Voice State Management**: Manages voice connections and tracks voice channel activity.

## Personal Learning Outcomes

- **Discord API**: Real-time message handling and server interaction.
- **Async Programming**: Enhanced my skills in asynchronous JavaScript, utilizing async/await for clear and efficient code.
- **Database Management**: My first project using a NoSQL database such as MongoDB.
- **Application Deployment**: Learned to deploy and maintain a Node.js application using PM2.