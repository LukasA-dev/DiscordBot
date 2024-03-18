// Function to add a new review to the database
async function addReview(client, movieTitle, userId, rating, review) {
  // Construct the review document to be inserted into the database
  const reviewDocument = {
    movieTitle: movieTitle.toLowerCase(), // Normalize movie title to lowercase for consistency
    displayTitle: movieTitle, // Preserve original casing for display purposes
    userId, // User ID of the reviewer
    rating: parseFloat(rating), // Ensure the rating is stored as a floating-point number
    review, // Review text
    createdAt: new Date(), // Timestamp of when the review was created
  };

  // Insert the constructed review document into the 'reviewsCollection' of the database
  await client.dbCollections.reviewsCollection.insertOne(reviewDocument);
}

// Function to fetch reviews for a specific movie from the database
async function getReviews(client, movieTitle, guild) {
  const lowercasedTitle = movieTitle.toLowerCase(); // Normalize movie title to lowercase for querying
  // Query the database for reviews matching the specified movie title
  const reviews = await client.dbCollections.reviewsCollection
    .find({ movieTitle: lowercasedTitle })
    .toArray();

  // Early return if no reviews found
  if (reviews.length === 0) return { averageRating: 0, reviewMessages: [] };

  let totalRating = 0; // Accumulator for total ratings to compute average
  const reviewMessages = []; // Array to hold formatted review messages

  // Iterate through each fetched review
  for (const review of reviews) {
    let userDisplayName = "Unknown User"; // Default display name in case user lookup fails
    try {
      // Attempt to fetch the reviewer's member object from the guild
      const member = await guild.members.fetch(review.userId);
      userDisplayName = member.nickname || member.user.username; // Use nickname if available, else username
    } catch (error) {
      console.error(
        `Failed to fetch member details for user ID ${review.userId}`
      );
    }

    totalRating += review.rating; // Add review rating to total

    // Format and add the review message to the array
    reviewMessages.push(
      `${userDisplayName}: ${review.rating}/10 - "${
        review.review
      } - ${review.createdAt.toLocaleDateString()}"`
    );
  }

  // Compute the average rating for the movie
  const averageRating = totalRating / reviews.length;

  // Return the computed average rating and array of formatted review messages
  return {
    averageRating: averageRating.toFixed(1), // Round average rating to one decimal place
    reviewMessages: reviewMessages, // Array of review messages
  };
}

// Function to get a summary of all reviews grouped by movie title
async function getAllReviewsSummary(client) {
  // Define the aggregation pipeline for computing average rating and review count per movie
  const aggregatePipeline = [
    {
      $group: {
        _id: "$movieTitle", // Group by movie title
        displayTitle: { $first: "$displayTitle" }, // Use the first encountered display title for each group
        averageRating: { $avg: "$rating" }, // Compute average rating
        reviewCount: { $sum: 1 }, // Count number of reviews
      },
    },
    {
      $project: {
        // Specify the format of the output documents
        _id: 0, // Exclude the '_id' field
        movieTitle: "$displayTitle", // Include display title as 'movieTitle'
        averageRating: { $round: ["$averageRating", 1] }, // Round average rating to one decimal place
        reviewCount: 1, // Include review count
      },
    },
    { $sort: { averageRating: -1 } }, // Sort results by average rating in descending order
  ];

  // Execute the aggregation pipeline and convert the results to an array
  const summary = await client.dbCollections.reviewsCollection
    .aggregate(aggregatePipeline)
    .toArray();

  return summary; // Return the aggregation results
}

// Export the utility functions for use in other parts of the application
module.exports = { addReview, getReviews, getAllReviewsSummary };
