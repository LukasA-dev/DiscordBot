// Function to initialize voice connection
function initializeVoiceConnection(connection) {
  // Remove existing listeners if any
  connection.removeAllListeners("stateChange");
  connection.removeAllListeners("error");

  // Attach new listeners
  connection.on("stateChange", (oldState, newState) => {
    console.log(
      `Voice connection state changed: ${oldState.status} -> ${newState.status}`
    );
  });
  
  // Handle errors
  connection.on("error", (error) => {
    console.error(`Voice connection error: ${error}`);
  });
}
module.exports = { initializeVoiceConnection };