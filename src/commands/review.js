// Import necessary modules and utility functions
const { EmbedBuilder } = require("discord.js");
const { addReview, getReviews } = require("../utilities/reviewUtilities");

// Define the command module for handling reviews
module.exports = {
  name: "review",
  description: "Submit or fetch reviews for a movie.",
  // Detailed instructions on how to use the review command
  detailedDescription:
    "`k!review [add/get] [movie name] [rating out of 10] [comment]` \n \n" +
    "Review a movie, fetch existing reviews of a movie.\n Use either `k!review add` or `k!review get` \n\n" +
    "Examples:\n" +
    "`k!review add Inception 8.5 Great movie!`\n" +
    "This command adds your review for 'Inception' with a rating of 8.5 and your comment.\n\n" +
    "`k!review get Inception`\n" +
    "This command fetches and displays all reviews for `Inception` and the average rating.",

  // The execute function is called when the review command is issued
  async execute(message, args, client) {
    const [action, ...params] = args; // Destructure the action and parameters from the command arguments

    if (action === "add") {
      // Handle the 'add' action for submitting a new review
      const [movieTitle, rating, ...reviewParts] = params; // Destructure and assemble the review parts
      const reviewText = reviewParts.join(" "); // Join the review parts to form the review text
      // Call the addReview utility function to save the review in the database
      await addReview(
        client,
        movieTitle,
        message.author.id,
        rating,
        reviewText
      );
      message.reply("Your review has been added successfully!"); // Confirm the addition of the review
    } else if (action === "get") {
      // Handle the 'get' action for fetching reviews
      const movieTitle = params.join(" "); // Assemble the movie title from the parameters
      // Call the getReviews utility function to fetch reviews from the database
      const { averageRating, reviewMessages } = await getReviews(
        client,
        movieTitle,
        message.guild
      );

      if (reviewMessages.length === 0) {
        // Check if there are no reviews
        return message.reply("There are no reviews for this movie yet.");
      }

      // Construct an embed with the fetched reviews and average rating
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`Reviews for ${movieTitle}`)
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

      // Reply with the constructed embed
      message.reply({ embeds: [embed] });
    } else {
      // Handle invalid actions
      message.reply("Invalid action. Please use 'add' or 'get'.");
    }
  },
};
