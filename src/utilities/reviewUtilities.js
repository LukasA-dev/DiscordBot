// Function to add a new review to the database
async function addReview(client, movieTitle, userId, rating, review) {
  const reviewDocument = {
    movieTitle: movieTitle.toLowerCase(), // Lowercase for case-insensitive querying
    displayTitle: movieTitle, // Original case for displaying
    userId,
    rating: parseFloat(rating), // Ensure rating is stored as a number
    review,
    createdAt: new Date(), // Timestamp for when the review was added
  };

  // Insert the review document into the reviews collection
  await client.dbCollections.reviewsCollection.insertOne(reviewDocument);
}

// Function to fetch reviews for a specific movie from the database
async function getReviews(client, movieTitle, guild) {
  const lowercasedTitle = movieTitle.toLowerCase();
  const reviews = await client.dbCollections.reviewsCollection
    .find({ movieTitle: lowercasedTitle })
    .toArray();

  if (reviews.length === 0) return { averageRating: 0, reviewMessages: [] };

  let totalRating = 0;
  const reviewMessages = [];

  // Iterate through each review and fetch the user's display name from the guild
  for (const review of reviews) {
    let userDisplayName = "Unknown User";
    try {
      const member = await guild.members.fetch(review.userId);
      userDisplayName = member.nickname || member.user.username;
    } catch (error) {
      console.error(
        `Failed to fetch member details for user ID ${review.userId}`
      );
    }

    // Add the rating to the total for calculating the average
    totalRating += review.rating;

    // Format the review message with user display name, rating, review text, and timestamp
    reviewMessages.push(
      `${userDisplayName}: ${review.rating}/10 - "${
        review.review
      } - ${review.createdAt.toLocaleDateString()}"`
    );
  }

  // Calculate the average rating for the movie
  const averageRating = totalRating / reviews.length;

  // Return the average rating and the review messages
  return {
    averageRating: averageRating.toFixed(1),
    reviewMessages: reviewMessages,
  };
}

// Export the utility functions for use in other parts of the application
module.exports = { addReview, getReviews };
