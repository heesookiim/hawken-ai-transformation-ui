export default function Custom404() {
  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">404 - Page Not Found</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            The page you are looking for could not be found. It might have been removed,
            renamed, or is temporarily unavailable.
          </p>
        </div>
        
        <p className="mb-6">
          Please try one of these options:
        </p>
        
        <ul className="list-disc ml-6 mb-6 space-y-2">
          <li>Check the URL for spelling errors</li>
          <li>Go back to the <a href="/" className="text-blue-600 hover:underline">home page</a></li>
          <li>Try generating a new transformation plan</li>
        </ul>
        
        <a 
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
} 