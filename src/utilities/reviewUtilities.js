// Function to add a new review to the database
async function addReview(client, movieTitle, userId, rating, review) {
  const reviewDocument = {
    // Construct the review document
    movieTitle, // Movie title
    userId, // ID of the user who submitted the review
    rating: parseInt(rating, 10), // Convert the rating to an integer
    review, // Review text
    createdAt: new Date(), // Timestamp of when the review was created
  };

  // Insert the review document into the reviews collection
  await client.dbCollections.reviewsCollection.insertOne(reviewDocument);
}

// Function to fetch reviews for a specific movie from the database
async function getReviews(client, movieTitle, guild) {
  // Find all reviews for the specified movie
  const reviews = await client.dbCollections.reviewsCollection
    .find({ movieTitle })
    .toArray();
  if (reviews.length === 0) return { averageRating: 0, reviewMessages: [] }; // Return early if no reviews

  let totalRating = 0; // Initialize total rating for calculating the average
  const reviewMessages = []; // Initialize an array to hold review messages

  // Iterate over each review
  for (const review of reviews) {
    let userDisplayName = "Unknown User"; // Default display name
    try {
      // Fetch the member from the guild using the userId and get their display name
      const member = await guild.members.fetch(review.userId);
      userDisplayName = member.nickname || member.user.username; // Use the nickname if available, otherwise the username
    } catch (error) {
      console.error(
        `Failed to fetch member details for user ID ${review.userId}`
      );
    }

    totalRating += review.rating; // Add the review's rating to the total
    // Construct the review message and add it to the reviewMessages array
    reviewMessages.push(
      `${userDisplayName}: ${review.rating}/10 - "${review.review}"`
    );
  }

  // Calculate the average rating
  const averageRating = totalRating / reviews.length;

  // Return the average rating and review messages
  return {
    averageRating: averageRating.toFixed(1), // Rounds to one decimal place
    reviewMessages: reviewMessages,
  };
}

// Export the utility functions
module.exports = { addReview, getReviews };
