import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

const ListingSubmittedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-900 rounded-lg p-8 shadow-xl border border-amber-500/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-6">
            <CheckCircle className="w-8 h-8 text-amber-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-amber-500 mb-4">
            Listing Submitted Successfully
          </h1>
          
          <p className="text-amber-300/80 mb-8">
            Thank you for submitting your business listing. Our team will review it shortly.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingSubmittedPage;