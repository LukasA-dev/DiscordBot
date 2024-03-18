// Import necessary modules and utility functions
const { EmbedBuilder } = require("discord.js");
const {
  addReview,
  getReviews,
  getAllReviewsSummary,
} = require("../utilities/reviewUtilities");

// Define the command module for handling reviews in a Discord bot
module.exports = {
  name: "review", // Command trigger word
  description: "Submit or fetch reviews for a movie.", // Short description of the command
  // Detailed usage instructions
  detailedDescription:
    "To review a movie or fetch existing reviews, use the following formats: \n\n" +
    'Add a review: `k!review add "Movie Title" [Rating /10] [Comment]`\n' +
    'Fetch reviews: `k!review get "Movie Title"`\n' +
    "List all reviews: `k!review list`\n\n" +
    '**Note**: For the `add` and `get` commands, always enclose the movie title in quotation marks (`" "`). Ratings should be between 0 and 10.',

  // Asynchronous function to execute the review command
  async execute(message, args, client) {
    // Check if no arguments were provided and respond accordingly
    if (!args.length) {
      return message.reply(
        "Please specify an action (add, get, list) and follow the command format."
      );
    }

    const action = args.shift().toLowerCase(); // Extract and normalize the action from arguments

    // Handle the 'list' action to show summary of all reviews
    if (action === "list") {
      try {
        const reviewsSummary = await getAllReviewsSummary(client);
        if (reviewsSummary.length === 0) {
          return message.reply("There are no reviews yet.");
        }

        // Generate a formatted table-like string to display reviews summary
        let descriptionText = "```"; // Start a code block for monospaced font
        descriptionText +=
          "Title                                   | Rating  | Reviews \n";
        descriptionText +=
          "---------------------------------------------------------\n";
        for (const review of reviewsSummary) {
          const title = review.movieTitle.padEnd(40, " ").substring(0, 40); // Format movie title
          const rating = `${review.averageRating}`.padEnd(8, " "); // Format average rating
          const reviewCount = `${review.reviewCount} `.padEnd(3, " "); // Format review count
          descriptionText += `${title}| ${rating}| ${reviewCount}\n`; // Append each row
        }
        descriptionText += "```"; // Close code block
        const embed = new EmbedBuilder()
          .setColor(0x0099ff) // Set embed color
          .setTitle(`All Movie Reviews Summary`) // Set embed title
          .setDescription(descriptionText) // Set embed description with the summary table
          .setTimestamp(); // Add timestamp to the embed

        return message.reply({ embeds: [embed] }); // Reply with the embed
      } catch (error) {
        console.error("Error listing all reviews:", error);
        return message.reply(
          "There was an error listing the reviews. Please try again later."
        );
      }
    }

    // Parse arguments for 'add' and 'get' actions
    const remainingArgs = args.join(" "); // Join remaining arguments into a string
    const match = remainingArgs.match(/"([^"]+)"\s*(.*)/); // Regex to match movie title and the rest of the command

    if (!match) {
      return message.reply(
        "Please make sure to enclose the movie title in **quotation marks.** \n" +
          'For example: `k!review add "Inception" 8.5 "Great movie!"` or `k!review get "Inception"`'
      );
    }

    const movieTitle = match[1].toLowerCase(); // Extract movie title and convert to lowercase
    const restOfCommand = match[2].trim().split(/\s+/); // Split the rest of the command by whitespace

    // Handle 'add' action to add a new review
    if (action === "add") {
      if (restOfCommand.length < 2) {
        return message.reply(
          "Please provide a rating and a review for the movie."
        );
      }

      const ratingStr = restOfCommand.shift().trim(); // Extract rating from the command
      if (ratingStr === "" || isNaN(parseFloat(ratingStr))) {
        return message.reply("Please provide a valid rating as a number.");
      }
      const rating = parseFloat(ratingStr); // Convert rating string to float
      if (rating < 0 || rating > 10) {
        return message.reply("The rating must be a number between 0 and 10.");
      }

      const reviewText = restOfCommand.join(" ").trim(); // Join the rest of the command as the review text
      if (!reviewText) {
        return message.reply(
          "Please add some comments about the movie along with your rating."
        );
      }

      // Attempt to add the review to the database
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
    } else if (action === "get") {
      // Handle 'get' action to fetch and display reviews for a specific movie
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
          .setColor(0x0099ff) // Set embed color
          .setTitle(`Reviews for "${match[1]}"`) // Set embed title using the original case of the movie title
          .addFields(
            {
              name: "Average Rating", // Field for average rating
              value: `${averageRating}/10`,
              inline: false,
            },
            {
              name: "Reviews", // Field for individual reviews
              value: reviewMessages.join("\n\n") || "No reviews to display.",
            }
          )
          .setTimestamp(); // Add timestamp to the embed

        message.reply({ embeds: [embed] }); // Reply with the embed
      } catch (error) {
        console.error("Error fetching reviews:", error);
        message.reply(
          "There was an error retrieving the reviews. Please try again later."
        );
      }
    } else {
      // Handle invalid actions
      message.reply("Invalid action. Please use 'add', 'get', or 'list'.");
    }
  },
};
