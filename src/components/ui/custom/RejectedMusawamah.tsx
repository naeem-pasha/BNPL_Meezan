import { RequestData } from "@/App";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";

interface DeliveryAuthorizationProps {
  data: RequestData;
}

export default function RejectedMusawamah({
  data,
}: DeliveryAuthorizationProps) {
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${
          import.meta.env.VITE_MEEZAN_SERVER
        }/api/request/reject-musawamah-to-vendor/${data._id}`
      );

      if (response.data?.success) {
        alert("Rejection sent successfully.");
        window.location.reload();
      } else {
        console.error("Rejection failed:", response.data?.message);
      }
    } catch (error) {
      console.error("Error sending rejection:", error);
      alert("An error occurred while sending rejection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button variant="outline">Rejected Musawamah</Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg p-6 font-sans overflow-y-auto max-h-[90vh]">
        <p className="mb-4">The customer has rejected your sale offer!</p>
        <Button
          onClick={handleReject}
          disabled={loading || data.isRejectSendMusawamahToVendor}
        >
          {loading ? "Sending..." : "Send Rejection to Vendor"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
