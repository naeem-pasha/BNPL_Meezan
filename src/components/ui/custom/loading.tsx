import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <div className="mb-4">
        <Loader className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
      <p className="text-lg text-gray-700 font-medium">Loading data...</p>
    </div>
  );
};

export default Loading;
