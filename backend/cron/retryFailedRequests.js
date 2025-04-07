const axios = require("axios");
const FailedRequest = require("../models/failer.model");

const retryFailedRequests = async () => {
  const failedRequests = await FailedRequest.find();
  if (failedRequests.length === 0) {
    console.log("No failed requests found. Skipping retry");
    return; // Exit if no failed requests
  }

  for (const request of failedRequests) {
    try {
      if (request.method === "POST") {
        await axios.post(request.endpoint, request.requestData);
      } else if (request.method === "PUT") {
        await axios.put(request.endpoint, request.requestData);
      }

      console.log(
        `Successfully retried: ${request.method} ${request.endpoint}`
      );

      // Remove successful request from DB
      await FailedRequest.findByIdAndDelete(request._id);
    } catch (error) {
      console.error(`Retry failed for ${request.method} ${request.endpoint}`);

      // Increment retry count and update last attempt time
      await FailedRequest.findByIdAndUpdate(request._id, {
        retryCount: request.retryCount + 1,
        lastAttempt: new Date(),
      });
    }
  }
};

module.exports = retryFailedRequests;
