import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "../button";
import { RequestData } from "@/App";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface DeliveryAuthorizationProps {
  data: RequestData;
}

const InvoiceLetter = ({ data }: DeliveryAuthorizationProps) => {
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open state

  const handleSendToVendor = async (id: string) => {
    setIsLoading(true); // Set loading to true when the button is clicked

    try {
      const result = await axios.put(
        `${
          import.meta.env.VITE_MEEZAN_SERVER
        }/api/request/send-invoice-letter-vendor/${id}`
      );

      if (result.data.success) {
        toast({
          title: "Success",
          description: "Delivery authorization sent successfully.",
          variant: "default",
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);

        setIsDialogOpen(false); // Close the dialog on success

        // You can invoke onSuccess() here if needed
      } else {
        // Handle case where success is false
        toast({
          title: "Error",
          description:
            result.data.message || "Failed to send delivery authorization.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error sending delivery authorization:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending delivery authorization.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Set loading to false when the request is done
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Invoice
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg p-6 font-sans overflow-y-auto max-h-[90vh]">
        <div className="container mx-auto p-6 max-w-2xl">
          <div className="border border-gray-400 p-6">
            <h1 className="text-center text-xl font-bold mb-6">
              Intimation for Sale Certificate / Sale Invoice
            </h1>

            {/* To Section */}
            <div className="mb-4">
              <p className="mb-2">
                To Mr. <span className="font-bold">{data.name}</span>
              </p>
              <p>Honda Atlas</p>
            </div>

            {/* Main Content */}
            <div className="mb-4">
              <p className="mb-2">
                With reference to the details and price of the Bike Engine No.
                <span className="font-bold">{data.engineNo}</span> MBL/GN0010000
                & Chassis No. <span className="font-bold">{data.chasisNo}</span>
                mentioned in your offer to sell via Sale Receipt and MBL's
                acceptance dated{" "}
                <span className="font-bold">
                  {data.updatedAt.split("T")[0]}
                </span>{" "}
                through which MBL purchased the Bike & which you are holding
                right now on trust basis.
              </p>

              <p className="mb-2">
                This is to inform you that we have now sold the Bike to one of
                our financing customers. Therefore, you are requested to please
                issue formal sale certificate / sale invoice in favor of our
                customer (the End User).
              </p>
            </div>

            {/* Details Section */}
            <div className="mb-4">
              <h2 className="font-bold mb-2">Details are given below:</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <span>Customer Name:</span>{" "}
                    <span className="font-bold">{data.name}</span>
                  </p>
                  <p>
                    <span>CNIC Number:</span>{" "}
                    <span className="font-bold">{data.cnic}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span>Contact Number:</span>{" "}
                    <span className="font-bold">{data.phoneNo}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-12">
              <p>Regards</p>
              <div className="mt-8">
                <p>____________________</p>
                <p className="font-bold">Megzap Bank</p>
              </div>
            </div>

            {/* Note Section */}
            <div className="mt-6 border-t pt-4 text-sm italic">
              <p>
                Note: Provided Sale certificate / Sale invoice will be used by
                customer to get the Bike registered on his name.
              </p>
            </div>
            <Button
              onClick={() => handleSendToVendor(data._id)}
              disabled={isLoading || data.isSendInvoiceToVendor}
              className="w-fit mx-auto"
            >
              {isLoading ? "Sending..." : "Send to Vendor"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceLetter;
