import { Link, useLocation, Navigate } from 'react-router-dom';
import { User, Package, MapPin, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  const tabs = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Orders', href: '/profile/orders', icon: Package },
    { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
    { name: 'Wishlist', href: '/profile/wishlist', icon: Heart },
  ];
  
  const activeTab = tabs.find((tab) => tab.href === location.pathname) || tabs[0];
  
  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="heading-2 text-gray-900 mb-8">My Account</h1>
      
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.href === location.pathname;
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            {activeTab.name === 'Profile' && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Name</label>
                    <input type="text" value={user?.name || ''} readOnly className="input bg-gray-50" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" value={user?.email || ''} readOnly className="input bg-gray-50" />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab.name === 'Orders' && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-6">Order History</h2>
                <p className="text-gray-600">No orders yet.</p>
              </div>
            )}
            
            {activeTab.name === 'Addresses' && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-6">Saved Addresses</h2>
                <p className="text-gray-600">No saved addresses.</p>
              </div>
            )}
            
            {activeTab.name === 'Wishlist' && (
              <div>
                <h2 className="font-semibold text-gray-900 mb-6">My Wishlist</h2>
                <p className="text-gray-600">Your wishlist is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
