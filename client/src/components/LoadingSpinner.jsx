const LoadingSpinner = ({ message = "Loading posts...", server = true }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      <p className="text-gray-600">{message}</p>
      {server && (
        <p className="text-sm text-gray-400">
          If this is taking a while, our server might be waking up...
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
