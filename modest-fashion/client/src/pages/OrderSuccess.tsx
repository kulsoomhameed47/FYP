import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="container-custom py-16 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-serif font-semibold text-gray-900 mb-4">
        Thank You for Your Order!
      </h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Your order has been placed successfully. We'll send you an email confirmation shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/profile/orders" className="btn-primary">
          View Orders
        </Link>
        <Link to="/" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
