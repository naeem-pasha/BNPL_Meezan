import { RequestData } from "@/App";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import axios from "axios";

interface DeliveryAuthorizationProps {
  data: RequestData;
}

export default function RejectedPurchaseOrder({
  data,
}: DeliveryAuthorizationProps) {
  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="outline">Rejected PO</Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg p-6 font-sans overflow-y-auto max-h-[90vh]">
        <h3>The Vendor has rejected your Purchase Order!</h3>
        {/* These reasons will appear when vendor would reject PO: Mistake in
        <br />
        - Purchase Order
        <br />
        - Product not available
        <br />- Price increased */}
      </DialogContent>
    </Dialog>
  );
}
