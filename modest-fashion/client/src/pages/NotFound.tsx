import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-serif font-semibold text-gray-900 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
