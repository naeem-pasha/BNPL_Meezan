interface errorProps {
  error: string;
  getAllRequest: () => void;
}

const Error = ({ error, getAllRequest }: errorProps) => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <h2 className="text-red-600 text-xl font-bold mb-3">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={getAllRequest}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Error;
