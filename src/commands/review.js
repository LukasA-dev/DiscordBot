// Import necessary modules and utility functions
const { EmbedBuilder } = require("discord.js");
const { addReview, getReviews } = require("../utilities/reviewUtilities");

// Define the command module for handling reviews
module.exports = {
  name: "review",
  description: "Submit or fetch reviews for a movie.",
  detailedDescription:
    "To review a movie or fetch existing reviews, use the following formats: \n\n" +
    'Add a review: `k!review add "Movie Title" [Rating /10] [Comment]`\n' +
    'Fetch reviews: `k!review get "Movie Title"`\n\n' +
    '**Note**: Always enclose the movie title in quotation marks (`" "`). Ratings should be between 0 and 10.\n\n' +
    "Examples:\n" +
    '`k!review add "Inception" 8.5 Great movie!`\n' +
    "Adds your review for 'Inception' with a rating of 8.5.\n\n" +
    '`k!review get "Inception"`\n' +
    "Fetches and displays all reviews for 'Inception', including the average rating.",

  async execute(message, args, client) {
    const action = args.shift().toLowerCase();
    const remainingArgs = args.join(" ");
    const match = remainingArgs.match(/"([^"]+)"\s*(.*)/);

    // Ensure the command has the correct format
    if (!match) {
      return message.reply(
        "Please make sure to enclose the movie title in **quotation marks.** \n" +
          'For example: `k!review add "Inception" 8.5 "Great movie!"`'
      );
    }

    // Convert movie title to lower case for case-insensitive comparison and storage
    const movieTitle = match[1].toLowerCase();
    const restOfCommand = match[2].trim().split(/\s+/);

    if (action === "add") {
      if (restOfCommand.length < 2) {
        return message.reply(
          "Please provide a rating and a review for the movie."
        );
      }

      // Parse the rating and ensure it is a number between 0 and 10
      const ratingStr = restOfCommand.shift().trim();
      if (ratingStr === "" || isNaN(parseFloat(ratingStr))) {
        return message.reply("Please provide a valid rating as a number.");
      }
      const rating = parseFloat(ratingStr);
      if (rating < 0 || rating > 10) {
        return message.reply("The rating must be a number between 0 and 10.");
      }

      // Ensure there is review text and it is not just empty spaces
      const reviewText = restOfCommand.join(" ").trim();
      if (!reviewText) {
        return message.reply(
          "Please add some comments about the movie along with your rating."
        );
      }

      // Add the review to the database
      try {
        await addReview(
          client,
          movieTitle,
          message.author.id,
          rating,
          reviewText
        );
        message.reply("Your review has been added successfully!");
      } catch (error) {
        console.error("Error adding review:", error);
        message.reply(
          "There was an error processing your review. Please try again later."
        );
      }

      // Fetch and display reviews for the movie
    } else if (action === "get") {
      // Fetch the reviews and calculate the average rating
      try {
        const { averageRating, reviewMessages } = await getReviews(
          client,
          movieTitle,
          message.guild
        );
        if (reviewMessages.length === 0) {
          return message.reply("There are no reviews for this movie yet.");
        }

        // Create an embed to display the reviews
        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(`Reviews for "${movieTitle}"`)
          .addFields(
            {
              name: "Average Rating",
              value: `${averageRating}/10`,
              inline: false,
            },
            {
              name: "Reviews",
              value: reviewMessages.join("\n\n") || "No reviews to display.",
            }
          )
          .setTimestamp();
        // Send the reviews as an embed
        message.reply({ embeds: [embed] });
      } catch (error) {
        console.error("Error fetching reviews:", error);
        message.reply(
          "There was an error retrieving the reviews. Please try again later."
        );
      }
      // Handle invalid action
    } else {
      message.reply("Invalid action. Please use 'add' or 'get'.");
    }
  },
};
