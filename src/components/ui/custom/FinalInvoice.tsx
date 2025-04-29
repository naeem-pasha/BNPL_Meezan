import { RequestData } from "@/App";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import axios from "axios";

interface FinalInvoiceProps {
  data: RequestData;
}

export default function FinalInvoice({ data }: FinalInvoiceProps) {
  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="outline">final invoice</Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg p-6 font-sans overflow-y-auto max-h-[90vh]">
        <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-300">
          <div className="mb-4">
            <p className="mb-2">
              Dear <span className="text-red-600 font-bold">MBL</span>,
            </p>
            <p className="mb-4">
              With reference to the intimation of sale receipt ref #{" "}
              {data._id.split("-")[0]}, we hereby confirm that we have given the
              possession of item(s) to customer Ms/Mr {data.name}.
            </p>
            <p className="mb-2">Atlas Honda (Merchant)</p>
          </div>

          <div className="border border-gray-800">
            <div className="border-b border-gray-800 text-center py-2 bg-gray-100">
              <p className="font-bold text-lg">Invoice</p>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-800">
              <div className="border-r border-gray-800 p-3">
                To, <span className="text-red-600">Meezan Bank Ltd.</span>
              </div>
              <div className="p-3">Date: {data.updatedAt.split("T")[0]}</div>
            </div>

            <div className="border-b border-gray-800 p-3">
              Sale receipt # {data._id.split("-")[0]}
            </div>

            <div className="border-b border-gray-800 p-3 font-medium">
              Detail of sold asset(s) to you.
            </div>

            {/* Table Header Row */}
            <div className="grid grid-cols-5 text-center border-b border-gray-800">
              <div className="border-r border-gray-800 p-3 font-medium">
                Asset Name
              </div>
              <div className="border-r border-gray-800 p-3 font-medium col-span-2">
                Engine #
              </div>
              <div className="border-r border-gray-800 p-3 font-medium">
                Rate
              </div>
              <div className="p-3 font-medium">Qty</div>
            </div>

            {/* Table Data Row */}
            <div className="grid grid-cols-5 text-center border-b border-gray-800">
              <div className="border-r border-gray-800 p-3">
                {data.bikeVarient}
              </div>
              <div className="border-r border-gray-800 p-3 col-span-2">
                {data.engineNo}
              </div>
              <div className="border-r border-gray-800 p-3">
                {data.price_meezan}
              </div>
              <div className="border-r border-gray-800 p-3">1</div>
            </div>

            {/* Total Amount Row */}
            <div className="grid grid-cols-5 text-center border-b border-gray-800">
              <div className="col-span-4"></div>
              <div className="p-3">
                <div className="font-bold">Total Amount</div>
                <div className="font-bold text-red-600">PKR</div>
                <div>{data.price_meezan}</div>
              </div>
            </div>

            {/* <div className="p-3 border-b border-gray-800">
              Purchase price is pending at{" "}
              <span className="text-red-600">MBL</span>.
            </div>

            <div className="p-3">From, ABC Pvt. Ltd.</div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
