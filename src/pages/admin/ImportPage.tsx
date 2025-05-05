import React from 'react';
import CSVImport from '../../components/admin/CSVImport';

const ImportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop Data Import</h1>
        <CSVImport />
      </div>
    </div>
  );
};

export default ImportPage;