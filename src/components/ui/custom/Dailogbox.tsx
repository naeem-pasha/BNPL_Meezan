import { RequestData } from "@/App";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import MyDocument from "./pdfComponent";
import { pdf } from "@react-pdf/renderer";
import MeezanLogo from "@/assets/meezanHeader.png";

interface dailogProps {
  customer: RequestData;
}

const Dailogbox = ({ customer }: dailogProps) => {
  const handleViewDownload = async (request: RequestData) => {
    const blob = await pdf(<MyDocument details={request} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button
          className={` bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1 rounded-md text-xs font-medium transition-colors`}
        >
          View Form
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white w-[794px] h-[800px] mx-auto shadow-lg p-8">
        {/* <!-- Main Form Container --> */}
        <div>
          {/* <!-- Header Section --> */}
          <header className="border-b-2 border-black pb-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-32 h-full bg-gray-200">
                <img src={MeezanLogo} alt="meezan logo" />
              </div>
              <h1 className="text-2xl font-bold">Asset Request Form</h1>
              <Download
                className="cursor-pointer"
                onClick={() => handleViewDownload(customer)}
              />
            </div>
          </header>

          {/* <!-- Requester Information Section --> */}
          <section className="mb-8">
            <h2 className="text-lg font-bold bg-gray-100 px-2 py-1 mb-4">
              Requester Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-semibold mb-1">
                  Employee Name:
                </label>
                <div className="border-b border-gray-400 pb-1">
                  {customer.name}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Employee ID:</label>
                <div className="border-b border-gray-400 pb-1">
                  {customer.EmployID}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">CNIC</label>
                <div className="border-b border-gray-400 pb-1">
                  {customer.cnic}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Request Date:
                </label>
                <div className="border-b border-gray-400 pb-1">
                  {customer.createdAt.toString().split("T")[0]}
                </div>
              </div>
            </div>
          </section>

          {/* <!-- Asset Details Table --> */}
          <section className="mb-8">
            <h2 className="text-lg font-bold bg-gray-100 px-2 py-1 mb-4">
              Asset Details
            </h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 font-semibold">
                  <th className="border border-gray-400 p-2 w-1/4">
                    Asset Type
                  </th>
                  <th className="border border-gray-400 p-2 w-2/4">
                    Specification
                  </th>
                  <th className="border border-gray-400 p-2 w-1/4">Quantity</th>
                  <th className="border border-gray-400 p-2 w-1/4">Urgency</th>
                  <th className="border border-gray-400 p-2 w-1/4">price</th>
                  <th className="border border-gray-400 p-2 w-1/4">
                    Installment
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2">Bike</td>
                  <td className="border border-gray-400 p-2">
                    {customer.bikeVarient}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">1</td>
                  <td className="border border-gray-400 p-2 text-center">
                    High
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {customer.price}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {customer.installment_tenure}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* <!-- Justification Section --> */}
          <section className="mb-8">
            <h2 className="text-lg font-bold bg-gray-100 px-2 py-1 mb-4">
              Justification
            </h2>
            <div className="border border-gray-400 p-3 h-32 text-sm">
              Current equipment is outdated and insufficient for development
              tasks. New laptop required for project deadlines.
            </div>
          </section>

          {/* <!-- Approval Section --> */}
          {/* <section className="mt-12">
            <div className="flex justify-between text-sm">
              <div className="w-[45%]">
                <div className="border-t border-gray-400 pt-2">
                  <span className="font-semibold">Requester Signature:</span>
                  <div className="h-16 mt-2 border border-gray-400"></div>
                  <div className="mt-1 text-xs text-gray-600">
                    Date: ___________
                  </div>
                </div>
              </div>

              <div className="w-[45%]">
                <div className="border-t border-gray-400 pt-2">
                  <span className="font-semibold">Approver Signature:</span>
                  <div className="h-16 mt-2 border border-gray-400"></div>
                  <div className="mt-1 text-xs text-gray-600">
                    Date: ___________
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* <!-- Footer Note --> */}
          <div className="mt-8 text-xs text-gray-600 text-center">
            Note: This form must be approved by department head before
            processing
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Dailogbox;
