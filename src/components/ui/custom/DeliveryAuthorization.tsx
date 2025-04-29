// //////////////

import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { RequestData } from "@/App";

export default function DeliveryAuthorizationDialog({
  data,
  onSuccess,
}: DeliveryAuthorizationProps & {
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSendToVendor = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${
          import.meta.env.VITE_MEEZAN_SERVER
        }/api/request/accept-autherized-vendor/${id}`
      );

      if (result.data.success) {
        // Show success toast
        toast({
          title: "Success",
          description: "Delivery authorization sent successfully.",
          variant: "default",
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);

        // Close dialog
        setIsDialogOpen(false);

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
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
      setIsLoading(false);
    }
  };

  const handleSendToCustomer = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await axios.put(
        `${
          import.meta.env.VITE_MEEZAN_SERVER
        }/api/request/send-autherized-letter-user/${id}`
      );

      if (result.data.success) {
        // Show success toast
        toast({
          title: "Success",
          description: "Delivery authorization sent successfully.",
          variant: "default",
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
        // Close dialog
        setIsDialogOpen(false);

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
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
      setIsLoading(false);
    }
  };
  console.log(data);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="outline">Delivery Letter Issued</Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg p-6 font-sans overflow-y-auto max-h-[90vh]">
        {/* Existing dialog content... */}
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-4">
            Delivery Authorization Notice
          </h1>
          <p className="text-right font-semibold text-gray-600">
            {data.updatedAt.split("T")[0]}
          </p>
        </div>

        {/* To Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">To,</h2>
          <div className="grid md:grid-cols-2 gap-4 border-b-2 pb-4">
            <div>
              <p className="font-semibold">Honda Atlas</p>
              <p className="text-gray-600">Karachi</p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold w-20">Attention:</span>
                <span>Mr. {data.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-20">From:</span>
                <span>Meezan Bank Ltd.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 border-b-2 border-dashed pb-2">
            Authorization to take delivery of the Bike
          </h3>
          <p className="text-gray-600 mb-4">
            With reference to the Musawamah contract, signed between MBL and
            you, # {data?._id.split("-")[0]}
            {/* dated
            <span className="font-semibold">
              {" "}
              {data?.updatedAt.split("T")[0]}
            </span> */}
            . We hereby allow you to take possession of the Bike which has the
            following details:
          </p>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left border">Goods</th>
                <th className="p-3 text-left border">Quantity</th>
                <th className="p-3 text-left border">Engine No.</th>
                <th className="p-3 text-left border">Chassis No.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">
                  {data.bikeVarient}, {data.bikeColor}
                </td>
                <td className="p-3 border">01 Unit</td>
                <td className="p-3 border">{data.engineNo}</td>
                <td className="p-3 border">{data.chasisNo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buyer Information */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold w-32">Buyer Name:</span>
              <span>Mr. {data.name}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32">Contact #:</span>
              <span>{data.phoneNo}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold w-32">Buyer CNIC Number:</span>
              <span>{data.cnic}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32">Delivery Time Period:</span>
              <span> {data.deliveryDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-8 border-t-2 pt-4">
          <div className="text-right">
            <p className="font-semibold">For and on behalf of</p>
            <p className="text-lg font-bold text-gray-700">
              Meezan Bank Limited
            </p>
          </div>
        </div>

        {!data.isShowInvoice && (
          <Button
            onClick={() => handleSendToVendor(data._id)}
            disabled={isLoading || data.isSendOfferToVendor}
          >
            {isLoading ? "Sending..." : "Send to Vendor"}
          </Button>
        )}

        {data.isShowInvoice && (
          <Button
            onClick={() => handleSendToCustomer(data._id)}
            disabled={isLoading || data.isSendAutherizedToUser}
          >
            {isLoading ? "Sending..." : "Send to Customer"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

// TypeScript interface for props (add this if not already defined)
interface DeliveryAuthorizationProps {
  data: RequestData;
  onSuccess?: () => void;
}
