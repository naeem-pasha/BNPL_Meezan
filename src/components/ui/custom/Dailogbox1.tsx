import { RequestData } from "@/App";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import numberToWords from "number-to-words";
import { Button } from "../button";
import axios from "axios";

interface dailogProps {
  customer: RequestData;
}

const SalesReciptDailog = ({ customer }: dailogProps) => {
  // const handleViewDownload = async (request: RequestData) => {
  //   const blob = await pdf(<MyDocument details={request} />).toBlob();
  //   const url = URL.createObjectURL(blob);
  //   window.open(url);
  // };

  const handleAccepts = async (id: string) => {
    try {
      if (!id) {
        console.error("Request ID is required.");
        return;
      }

      const response = await axios.put(
        `${
          import.meta.env.VITE_MEEZAN_SERVER
        }/api/request/ownerShiptransfer/${id}`
      );

      if (response.data.success) {
        window.location.reload();
        console.log("Ownership transfer approved successfully:", response.data);
      } else {
        console.error(
          "Failed to approve ownership transfer:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error in handleAccepts:", error);
    }
  };

  if (!customer?.price_meezan) {
    return <p>loading...</p>;
  }

  const handleReject = async (id: string) => {
    try {
      if (!id) {
        console.error("Request ID is required.");
        return;
      }

      const response = await axios.put(
        `${
          import.meta.env.VITE_MEEZAN_SERVER
        }/api/request/rejectsale-receipt/${id}`
      );

      if (response.data.success) {
        window.location.reload();
        console.log("Sales receipt rejected successfully:", response.data);
      } else {
        console.error("Failed to reject sales receipt:", response.data.message);
      }
    } catch (error) {
      console.error("Error in handleReject:", error);
    }
  };
  const priceInWords = numberToWords.toWords(customer?.price_meezan);

  return (
    <Dialog>
      <DialogTrigger>
        <button
          className={` bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1 rounded-md text-xs font-medium transition-colors`}
        >
          Sale Receipt
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white w-[794px] h-[800px] mx-auto shadow-lg p-8">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg font-mono">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-4">Sales Receipt</h1>
            <div className="flex justify-between mb-2">
              <div className="text-left"></div>
              <div className="text-right">
                <span className="font-semibold">Date:</span>{" "}
                {customer.updatedAt.split("T")[0]}
              </div>
            </div>
            <div className="text-center font-bold mb-4">
              Meezan Bank Limited
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="font-semibold">MBL.Order Reference#</span>
            </div>
            <div className="text-right">
              <span className="font-semibold">
                {customer._id.split("-")[0]}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-4 border-collapse">
            <thead>
              <tr className="border-b-2 border-t-2 border-black">
                <th className="text-left p-2 w-3/6">Description</th>
                <th className="text-left p-2 w-1/6">Engine#</th>
                <th className="text-left p-2 w-1/6">Chassis#</th>
                <th className="text-left p-2 w-1/6">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="p-2">{customer.bikeVarient}</td>
                <td className="p-2">{customer.engineNo}</td>
                <td className="p-2">{customer.chasisNo}</td>
                <td className="p-2">{customer.price_meezan}</td>
              </tr>
              <tr></tr>
            </tbody>
          </table>

          {/* Total Section */}
          <div className="flex justify-between items-center mb-4 font-bold border-t-2 border-b-2 border-black py-2">
            <span>TOTAL</span>
            <span>{customer.price_meezan}</span>
          </div>

          {/* Amount in Words */}
          <div className="mb-4 p-2 bg-gray-100 italic text-sm">
            Amount in Words: {priceInWords}
          </div>

          {/* Terms Section */}
          <div className="text-xs mb-6">
            <p className="mb-2">
              With reference to details of the asset mentioned in the Purchase
              Order, we sold you the captioned asset,at the above-mentioned
              price. Now,the ownership of the mentioned assest is transfered to
              MBL, and the risk and reward of the asset shall also be
              transferred to Meezan Bank, as per agrreed terms in our MOU. after
              which it shall be taken over by us as a trustee of MBL.
            </p>
          </div>

          {/* Footer */}
          <div className="text-right font-bold">REGARDS</div>
          <Button
            onClick={() => handleAccepts(customer._id)}
            className="bg-green-800 hover:bg-green-500"
            disabled={
              customer.ownerShipTransfer || customer.isInvoiceRejectedByBank
            }
          >
            Accept
          </Button>
          <Button
            className="bg-red-800 hover:bg-red-500"
            onClick={() => handleReject(customer._id)}
            disabled={
              customer.ownerShipTransfer || customer.isInvoiceRejectedByBank
            }
          >
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesReciptDailog;
