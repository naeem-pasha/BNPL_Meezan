const { default: axios } = require("axios");
const RequestByUser = require("../models/request.model");
const { v4: uuidV4 } = require("uuid");
const { default: mongoose } = require("mongoose");
const requestByUserSchema = require("../utils/validate.request");
const { z } = require("zod");
const FailedRequest = require("../models/failer.model");
const { data } = require("autoprefixer");

const requestUser = async (req, res) => {
  try {
    const uuid = uuidV4();

    // Validate request body
    const validateData = requestByUserSchema.parse(req.body);

    // Destructure validated data
    const {
      name,
      email,
      cnic,
      EmployID,
      phoneNo,
      City,
      bikeColor,
      bikeVarient,
      installment_tenure,
      price,
    } = validateData;

    // Check if user already exists
    const existingUser = await RequestByUser.findOne({
      $or: [{ email }, { cnic }, { phoneNo }],
    });

    if (existingUser) {
      const field =
        existingUser.email === email
          ? "Email"
          : existingUser.cnic === cnic
          ? "CNIC"
          : "Phone number";

      return res.status(400).json({ message: `${field} already exists` });
    }

    // Create and save new request
    const newRequest = await RequestByUser.create({
      _id: uuid,
      name,
      email,
      cnic,
      EmployID,
      phoneNo,
      City,
      bikeColor,
      bikeVarient,
      installment_tenure,
      price,
    });

    // Data to send to the external server
    const requestData = {
      _id: uuid,
      name,
      email,
      cnic,
      phoneNo,
      City,
      bikeColor,
      bikeVarient,
      EmployID,
      price,
      installment_tenure,
    };

    // Send request to another API
    try {
      await axios.post(
        `${process.env.USER_URL}/api/user/create-user`,
        requestData
      );
    } catch (error) {
      console.error(
        "Failed to update remote server, storing request for retry..."
      );
      await FailedRequest.create({ requestData });
    }
    // Success response
    res.status(201).json({
      success: true,
      message: "Request sent successfully",
      result: newRequest,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        messages: error.errors.map(({ message }) => message),
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Meezan_server error",
    });
  }
};

const getAllRequest = async (req, res) => {
  try {
    const result = await RequestByUser.find().sort({ createdAt: -1 });
    res.status(201).json({
      message: "Request Send Successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { priceMeezan } = req.body;
    // Update request status in DB
    const data = await RequestByUser.findByIdAndUpdate(
      id,
      { isAprovedByBank: true, price_meezan: priceMeezan },
      { new: true, lean: true }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User request not found",
      });
    }

    // Define API requests (POST and PUT requests)
    const apiRequests = [
      {
        method: "POST",
        endpoint: `${process.env.VENDOR_URL}/aprove/bybank`,
        payload: { data },
      },
      {
        method: "PUT",
        endpoint: `${process.env.USER_URL}/api/user/approveByBank/${id}`,
        payload: {},
      },
    ];

    // Execute API calls
    for (const request of apiRequests) {
      try {
        if (request.method === "POST") {
          await axios.post(request.endpoint, request.payload);
        } else if (request.method === "PUT") {
          await axios.put(request.endpoint, request.payload);
        }
      } catch (error) {
        console.error(
          `Failed ${request.method} request to ${request.endpoint}, storing for retry.`
        );
        await FailedRequest.create({
          requestType: "approveRequest",
          method: request.method,
          endpoint: request.endpoint,
          requestData: request.payload,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while approving request",
      error: error.message || error.data?.message,
    });
  }
};

const assignNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { chasisNo, engineNo, status, distributerNo } = req.body;

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      {
        chasisNo,
        engineNo,
        status,
        distributerNo,
        isAprovedByVendor: true,
      },
      { new: true, lean: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User request not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "assign  Number successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in assigning number",
    });
  }
};

const rejectedByBank = async (req, res) => {
  try {
    const { id } = req.params; // Retrieve the ID from the request parameters

    // First, hit the external server via GET request with the id
    const externalResponse = await axios.get(
      `${process.env.USER_URL}/api/user/rejectedbybank/${id}`
    );

    console.log(`externalResponse`, externalResponse.data);

    // Check if the response from the external server is successful
    if (externalResponse.data.success) {
      // Now, update the RequestByUser schema if the external server response is successful
      const updatedRequest = await RequestByUser.findByIdAndUpdate(
        id,
        { isRejectedByBank: true, status: "You Rejected" }, // Set `isRejectedByBank` to true
        { new: true } // This returns the updated document after the update operation
      );

      if (updatedRequest) {
        return res.status(200).json({
          success: true,
          message: "Request rejected and updated successfully.",
          updatedRequest,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Request not found.",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "External verification failed.",
      });
    }
  } catch (error) {
    console.error("Error during rejection process:", error);

    // Return appropriate error message depending on the type of error
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
      error: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await RequestByUser.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true, lean: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "unable to update status",
      });
    }
    return res.status(200).json({
      success: true,
      message: "status successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error While updateing status",
    });
  }
};

const ownerShiptransfer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required.",
      });
    }

    const result = await RequestByUser.findOne({ _id: id });

    const { chasisNo, engineNo, status, distributerNo } = result;
    const { data } = await axios.put(
      `${process.env.USER_URL}/api/user/assign-no/${id}`,
      { chasisNo, engineNo, status, distributerNo }
    );
    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to approve transfer to the User.",
      });
    }

    // Make external API call to approve transfer
    const vendorResponse = await axios.put(
      `${process.env.VENDOR_URL}/aprove/transferownership/${id}`
    );

    if (!vendorResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to approve transfer to the vendor.",
      });
    }

    // Update ownership transfer status in the database
    const updatedRequest = await RequestByUser.findByIdAndUpdate(
      id,
      { ownerShipTransfer: true, status: "Risk Tranfer to Bank" },
      { new: true } // Return the updated document
    );

    // Check if request exists
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Ownership transfer approved and updated successfully.",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error in ownerShiptransfer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
const updateFinalAcceptence = async (req, res) => {
  try {
    const { id } = req.params;

    // Send PUT request to the vendor service
    const vendorResult = await axios.put(
      `${process.env.VENDOR_URL}/aprove/final-acceptence/${id}`
    );

    // Check if the vendor service request was successful
    if (vendorResult.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Failed to update vendor acceptance.",
        data: vendorResult.data,
      });
    }

    // Update the request by user with final acceptance
    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { finalAcceptence: true },
      { new: true, lean: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Final acceptance updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error in updateFinalAcceptence controller:", error);
    return res.status(500).json({
      success: false,
      message: "Error in updateFinalAcceptence controller.",
      error: error.message,
    });
  }
};

const updateIsPublishedDeliveryLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { isPublishedDeliveryLetter: true },
      { new: true, lean: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery letter status updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Error in updateIsPublishedDeliveryLetter controller:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Error in updateIsPublishedDeliveryLetter controller.",
      error: error.message,
    });
  }
};

const acceptMusawamahUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RequestByUser.findByIdAndUpdate(
      id,
      {
        isAcceptMusawamah: true,
      },
      { new: true, lean: true }
    );
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in acceptMusawamah controller.",
      error: error.message,
    });
  }
};

const sendAutherizedToVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.put(
      `${process.env.VENDOR_URL}/aprove/accept-autherized/${id}`
    );
    if (data.success === false) {
      return res.status(400).json({
        success: false,
        message: "Error in acceptAherizedVendor while updating the Vendor",
      });
    }

    const response = await RequestByUser.findByIdAndUpdate(
      id,
      {
        isSendOfferToVendor: true,
      },
      { new: true }
    );

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Error in updating RequestByUser document.",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in acceptAherizedVendor while updating the Vendor",
      error: error.message,
    });
  }
};

const assignDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryDate } = req.body;

    if (!id || !deliveryDate) {
      return res
        .status(400)
        .json({ success: false, message: "ID and deliveryDate are required." });
    }

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { deliveryDate, isShowInvoice: true },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found." });
    }

    res.status(200).json({
      message: "Delivery date updated successfully.",
      data: result,
      success: true,
    });
  } catch (error) {
    console.error("Error updating delivery date:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

const sendAutherizedLetterToUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userResponse = await axios.put(
      `${process.env.USER_URL}/api/user/send-autherized-user/${id}`
    );

    if (userResponse.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Unable to send authorized letter to user, server error.",
      });
    }

    const distributerResponse = await axios.put(
      `${process.env.DISTRIBUTER_URL}/api/send-autherized-user/${id}`
    );
    if (distributerResponse.status !== 200) {
      return res.status(500).json({
        success: false,
        message:
          "Unable to send authorized letter to distributer, server error.",
      });
    }

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { isSendAutherizedToUser: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request by user not found",
      });
    }

    return res.status(200).json({
      message: "Authorized to user successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in sendAutherizedLetterToUser controller.",
      error: error.message,
    });
  }
};

// const sendInvoiceLetterToUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const userResponse = await axios.put(
//       `${process.env.USER_URL}/api/user/send-invoice-user/${id}`
//     );

//     if (userResponse.status !== 200) {
//       return res.status(500).json({
//         success: false,
//         message: "Unable to send Invoice letter to user, server error.",
//       });
//     }

//     const distributerResponse = await axios.put(
//       `${process.env.DISTRIBUTER_URL}/api/send-invoice-user/${id}`
//     );
//     if (distributerResponse.status !== 200) {
//       return res.status(500).json({
//         success: false,
//         message: "Unable to send authorized letter to invoice, server error.",
//       });
//     }

//     const result = await RequestByUser.findByIdAndUpdate(
//       id,
//       { isSendInvoiceToUser: true },
//       { new: true }
//     );

//     if (!result) {
//       return res.status(404).json({
//         success: false,
//         message: "Request by user not found",
//       });
//     }

//     return res.status(200).json({
//       message: "Authorized to user successfully",
//       data: result,
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error in sendAutherizedLetterToUser controller.",
//       error: error.message,
//     });
//   }
// };
const userAcceptDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      {
        isUserAcceptDelivery: true,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request Not found Meezan",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Meezan server error",
      error: error.message,
    });
  }
};

const sendInvoiceLetterToVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const userResponse = await axios.put(
      `${process.env.VENDOR_URL}/aprove/send-invoice-vendor/${id}`
    );
    if (userResponse.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Unable to send Invoice letter to user, server error.",
      });
    }
    const distributerResponse = await axios.put(
      `${process.env.DISTRIBUTER_URL}/api/send-invoice-user/${id}`
    );
    if (distributerResponse.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Unable to send authorized letter to invoice, server error.",
      });
    }

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { isSendInvoiceToVendor: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request by user not found",
      });
    }

    return res.status(200).json({
      message: "Authorized to user successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in sendAutherizedLetterToUser controller.",
      error: error.message,
    });
  }
};

const acceptInvoiceFromVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { isAcceptFinalInvoiceVendor: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice accepted successfully",
    });
  } catch (error) {
    console.error("Error in acceptInvoiceFromVendor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const rejectSalesRecipt = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required.",
      });
    }

    try {
      await axios.put(
        `${process.env.VENDOR_URL}/aprove/rejectsale-receipt/${id}`
      );
    } catch (axiosError) {
      console.error("Failed to notify vendor service:", axiosError.message);
      return res.status(502).json({
        success: false,
        message: "Failed to notify vendor service.",
        error: axiosError.message,
      });
    }

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      {
        status: "invoice Rejected",
        isInvoiceRejectedByBank: true,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sales receipt rejected successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error in rejectSalesRecipt:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error rejectSalesRecipt",
      error: error.message,
    });
  }
};

const rejectPurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { isRejectPurchaseOrder: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Purchase order rejected successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Internal server error in meezan bank:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while rejecting the purchase order.",
      error: error.message,
    });
  }
};

const rejectMusawamahUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { isRejectMusawamah: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "musawamah rejected successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Internal server error in meezan bank:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while rejecting the musawamah in Bank.",
      error: error.message,
    });
  }
};

const rejectMusawamahToVendor = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const { data } = await axios.put(
        `${process.env.VENDOR_URL}/aprove/reject-musawamah/${id}`
      );
      // Optionally check the `data` for success if needed
    } catch (axiosError) {
      console.error("Failed to notify bank server:", axiosError.message);

      return res.status(200).json({
        success: true,
        message: "User rejected locally, but failed to notify bank server.",
        data: data,
      });
    }

    const result = await RequestByUser.findByIdAndUpdate(
      id,
      { isRejectSendMusawamahToVendor: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "musawamah rejected successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Internal server error in meezan bank:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while rejecting the musawamah in Bank.",
      error: error.message,
    });
  }
};

module.exports = {
  requestUser,
  getAllRequest,
  assignNumber,
  approveRequest,
  rejectedByBank,
  updateStatus,
  ownerShiptransfer,
  updateFinalAcceptence,
  updateIsPublishedDeliveryLetter,
  acceptMusawamahUser,
  sendAutherizedToVendor,
  assignDate,
  sendAutherizedLetterToUser,
  // sendInvoiceLetterToUser,
  userAcceptDelivery,
  sendInvoiceLetterToVendor,
  acceptInvoiceFromVendor,
  rejectSalesRecipt,
  rejectPurchaseOrder,
  rejectMusawamahUser,
  rejectMusawamahToVendor,
};
