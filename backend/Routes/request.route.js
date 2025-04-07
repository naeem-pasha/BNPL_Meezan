const { Router } = require("express");
const {
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
  sendInvoiceLetterToUser,
  userAcceptDelivery,
  sendInvoiceLetterToVendor,
} = require("../controller/request.control");

const route = Router();

route.post("/user", requestUser);

route.get("/allrequest", getAllRequest);

route.put("/aproveRequest/:id", approveRequest);

route.put("/assignnumber/:id", assignNumber);

route.put("/ownerShipTransfer/:id", ownerShiptransfer);

route.put("/rejectedbybank/:id", rejectedByBank);

route.put("/update-status/:id", updateStatus);

route.put("/update-finalAcceptence/:id", updateFinalAcceptence);

route.put(
  "/update-isPublishedDeliveryLetter/:id",
  updateIsPublishedDeliveryLetter
);

route.put("/accept-musawamah-user/:id", acceptMusawamahUser);

route.get("/accept-autherized-vendor/:id", sendAutherizedToVendor);

route.put("/assaign-date/:id", assignDate);

route.put("/send-autherized-letter-user/:id", sendAutherizedLetterToUser);

// route.put("/send-invoice-letter-user/:id", sendInvoiceLetterToUser);

route.put("/send-invoice-letter-vendor/:id", sendInvoiceLetterToVendor);

route.put("/user-accept-delivery/:id", userAcceptDelivery);

module.exports = route;
