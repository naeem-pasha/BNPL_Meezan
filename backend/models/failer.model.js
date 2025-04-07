const mongoose = require("mongoose");

const failedRequestSchema = new mongoose.Schema(
  {
    requestType: { type: String, required: true }, // e.g., "approveRequest"
    method: { type: String, enum: ["POST", "PUT"], required: true }, // HTTP Method
    endpoint: { type: String, required: true }, // API endpoint to retry
    requestData: { type: Object, required: true }, // Request payload
    retryCount: { type: Number, default: 0 }, // Track retry attempts
    lastAttempt: { type: Date, default: Date.now }, // Last retry attempt timestamp
  },
  { timestamps: true }
);

const FailedRequest = mongoose.model("FailedRequest", failedRequestSchema);
module.exports = FailedRequest;
