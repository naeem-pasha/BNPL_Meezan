import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import axios from "axios";
import Loading from "./components/ui/custom/loading";
import Error from "./components/ui/custom/Error";
import Dailogbox from "./components/ui/custom/Dailogbox";
import SalesReciptDailog from "./components/ui/custom/Dailogbox1";
import DeliveryAuthorizationDialog from "./components/ui/custom/DeliveryAuthorization";
import { Toaster } from "./components/ui/toaster";
import InvoiceLetter from "./components/ui/custom/InvoiceLetter";
import { Input } from "./components/ui/input";
import FinalInvoice from "./components/ui/custom/FinalInvoice";
import RejectedPurchaseOrder from "./components/ui/custom/PORejected";
import RejectedMusawamah from "./components/ui/custom/RejectedMusawamah";

const apiUrl = import.meta.env.VITE_MEEZAN_SERVER;

export interface RequestData {
  City: string;
  EmployID: string;
  bikeColor: string;
  bikeVarient: string;
  chasisNo: number;
  cnic: string;
  createdAt: string;
  distributerNo: string;
  email: string;
  engineNo: number;
  name: string;
  phoneNo: string;
  status: string;
  updatedAt: string;
  isAprovedByBank: boolean;
  isAprovedByVendor: boolean;
  isRejectedByBank: boolean;
  ownerShipTransfer: boolean;
  finalAcceptence: boolean;
  isPublishedDeliveryLetter: boolean;
  isAcceptMusawamah: boolean;
  isSendOfferToVendor: boolean;
  isShowInvoice: boolean;
  isSendAutherizedToUser: boolean;
  isUserAcceptDelivery: boolean;
  isSendInvoiceToVendor: boolean;
  deliveryDate: string;
  installment_tenure: number;
  price_meezan: number;
  isAcceptFinalInvoiceVendor: boolean;
  isInvoiceRejectedByBank: boolean;
  isRejectPurchaseOrder: boolean;
  isRejectMusawamah: boolean;
  isRejectSendMusawamahToVendor: boolean;
  price: number;
  _id: string;
  __v: number;
}

const MotorcycleDashboard = () => {
  const [data, setData] = useState<RequestData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 6; // Changed from 10 to 5 as requested

  // Filter customers based on search term
  const filteredCustomers = data.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cnic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.EmployID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to first page if search term changes
  useEffect(() => {
    setCurrentPage(1); // Reset pagination when search changes
  }, [searchTerm]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const getAllRequest = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${apiUrl}/api/request/allrequest`);
      if (data.success === true) {
        setData(data?.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllRequest(); // Fetch data on component mount
  }, []);

  // Loading component
  if (isLoading) {
    return <Loading />;
  }

  // Error component
  if (error) {
    return <Error getAllRequest={getAllRequest} error={error} />;
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Show maximum 5 page numbers
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      // If total pages are less than max buttons, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // More complex pagination logic for many pages
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

      // Adjust when near end
      if (endPage - startPage < maxPageButtons - 1) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  console.log(data);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Meezan Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage motorcycle listings and customer applications
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="flex items-center space-x-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table with pagination */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredCustomers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No motorcycle requests found</p>
              <button
                onClick={getAllRequest}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh Data
              </button>
            </div>
          )}

          {filteredCustomers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table headers */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider ">
                      Customer Name
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      CNIC
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Employ Id
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      City
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Bike Type
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Engine #
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Chassis #
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Product Price
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      View Application Form
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Offer to Purchase
                    </th>
                    <th className="sticky top-0 px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Delivered to Customer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((customer) => (
                    <CustomerRow
                      data={customer}
                      getAllRequest={getAllRequest}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Enhanced Pagination */}
          {filteredCustomers.length > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between ">
                  {/* Mobile pagination */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstItem + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredCustomers.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredCustomers.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      {/* Previous button */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        {/* You can add an icon here if you want */}
                        &laquo;
                      </button>

                      {/* Page numbers */}
                      {getPageNumbers().map((number) => (
                        <button
                          key={number}
                          onClick={() => setCurrentPage(number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === number
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {number}
                        </button>
                      ))}

                      {/* Next button */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        {/* You can add an icon here if you want */}
                        &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface customerRowProps {
  data: RequestData;
  getAllRequest: () => void;
}

// const CustomerRow = ({ data, getAllRequest }: customerRowProps) => {
//   const [priceMeezan, setPriceMeezan] = useState<number>();

//   // Handle approve, reject, and send offer functions remain the same
//   const handleAproved = (id: string) => {
//     return async () => {
//       try {
//         const { data } = await axios.put(
//           `${apiUrl}/api/request/aproveRequest/${id}`,
//           { priceMeezan }
//         );
//         if (data.success === true) {
//           getAllRequest(); // Refresh data after approval
//         }
//       } catch (error) {
//         console.error("Error approving request:", error);
//       }
//     };
//   };

//   const handleRejected = (id: string) => {
//     return async () => {
//       try {
//         const { data } = await axios.put(
//           `${apiUrl}/api/request/rejectedbybank/${id}`
//         );
//         if (data.success === true) {
//           getAllRequest(); // Refresh data after rejection
//         }
//       } catch (error) {
//         console.error("Error rejecting request:", error);
//       }
//     };
//   };
//   return (
//     <tr key={data._id} className="hover:bg-gray-50 transition-colors">
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//         {data.name}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {data.cnic}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {data.EmployID}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {data.phoneNo}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {data.City}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {data.bikeColor}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {data.bikeVarient}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {data?.engineNo}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {data?.chasisNo}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span>{data.status}</span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span>
//           {data.price_meezan ? (
//             data.price_meezan
//           ) : (
//             <Input
//               type="number"
//               onChange={(e) => setPriceMeezan(Number(e.target.value))}
//               value={priceMeezan}
//               className="w-40"
//               placeholder="Product Price"
//               disabled={!!data.price_meezan && true}
//             />
//           )}
//         </span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//         <div className="flex space-x-2">
//           <button
//             onClick={handleAproved(data._id)}
//             disabled={
//               data.isAprovedByBank || data.isRejectedByBank || !!priceMeezan
//             }
//             className={` ${
//               data.isAprovedByBank || data.isRejectedByBank
//                 ? "bg-green-50  text-green-600 cursor-not-allowed"
//                 : "bg-blue-50  text-blue-600"
//             }   hover:bg-blue-100  text-blue-600 px-3 py-1 rounded-md text-xs font-medium transition-colors`}
//           >
//             Approved
//           </button>
//           <button
//             onClick={handleRejected(data?._id)}
//             disabled={data.isAprovedByBank || data.isRejectedByBank}
//             className={`${
//               data.isAprovedByBank
//                 ? "bg-green-50  text-green-600 cursor-not-allowed"
//                 : "bg-blue-50  text-blue-600"
//             }  bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-medium transition-colors `}
//           >
//             Reject
//           </button>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//         <Dailogbox customer={data} />
//         {data.isAprovedByVendor && <SalesReciptDailog customer={data} />}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//         {data.isAcceptMusawamah && (
//           <>
//             <DeliveryAuthorizationDialog data={data} />
//             {data.isShowInvoice && <InvoiceLetter data={data} />}
//           </>
//         )}
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//         {data.isUserAcceptDelivery && (
//           <p className="bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1 rounded-md text-xs font-medium transition-colors">
//             DELIVERED
//           </p>
//         )}
//       </td>
//     </tr>
//   );
// };

const CustomerRow = ({ data, getAllRequest }: customerRowProps) => {
  // Initialize priceMeezan with existing data if available
  const [priceMeezan, setPriceMeezan] = useState<number | undefined>(
    data.price_meezan
  );
  // Handle approve, reject, and send offer functions remain the same
  const handleAproved = (id: string) => {
    return async () => {
      try {
        const { data } = await axios.put(
          `${apiUrl}/api/request/aproveRequest/${id}`,
          { priceMeezan }
        );
        if (data.success === true) {
          getAllRequest(); // Refresh data after approval
        }
      } catch (error) {
        console.error("Error approving request:", error);
      }
    };
  };

  const handleRejected = (id: string) => {
    return async () => {
      try {
        const { data } = await axios.put(
          `${apiUrl}/api/request/rejectedbybank/${id}`
        );
        if (data.success === true) {
          getAllRequest(); // Refresh data after rejection
        }
      } catch (error) {
        console.error("Error rejecting request:", error);
      }
    };
  };

  return (
    <tr key={data._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {data.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data.cnic}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data.EmployID}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data.phoneNo}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data.City}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data.bikeColor}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data.bikeVarient}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data?.engineNo}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data?.chasisNo}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span>{data.status}</span>
      </td>

      <td>
        {data.price_meezan ? (
          data.price_meezan // Show existing value
        ) : (
          <Input
            type="number"
            onChange={(e) => setPriceMeezan(Number(e.target.value))}
            value={priceMeezan ?? ""} // Handle undefined case
            className="w-40"
            placeholder="Product Price"
            disabled={!!data.price_meezan} // Disable if price exists
          />
        )}
      </td>

      <td>
        <div className="flex space-x-2">
          <button
            onClick={handleAproved(data._id)}
            disabled={
              data.isAprovedByBank ||
              data.isRejectedByBank ||
              (!data.price_meezan && !priceMeezan) // Validate input
            }
            className={` ${
              data.isAprovedByBank || data.isRejectedByBank
                ? "bg-green-50  text-green-600 cursor-not-allowed"
                : "bg-blue-50  text-blue-600"
            }   hover:bg-blue-100  text-blue-600 px-3 py-1 rounded-md text-xs font-medium transition-colors`}
          >
            Approved
          </button>
          <button
            onClick={handleRejected(data?._id)}
            disabled={data.isAprovedByBank || data.isRejectedByBank}
            className={`${
              data.isAprovedByBank
                ? "bg-green-50  text-green-600 cursor-not-allowed"
                : "bg-blue-50  text-blue-600"
            }  bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-medium transition-colors `}
          >
            Reject
          </button>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Dailogbox customer={data} />
        {data.isAprovedByVendor && <SalesReciptDailog customer={data} />}
        {data.isRejectPurchaseOrder && <RejectedPurchaseOrder data={data} />}
        {data.isRejectMusawamah && <RejectedMusawamah data={data} />}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {data.isAcceptMusawamah && (
          <>
            <DeliveryAuthorizationDialog data={data} />
            {data.isShowInvoice && <InvoiceLetter data={data} />}
          </>
        )}

        {data.isAcceptFinalInvoiceVendor && <FinalInvoice data={data} />}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {data.isUserAcceptDelivery && (
          <p className="bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1 rounded-md text-xs font-medium transition-colors">
            DELIVERED
          </p>
        )}
      </td>
    </tr>
  );
};
export default MotorcycleDashboard;
