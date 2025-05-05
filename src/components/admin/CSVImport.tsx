import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImportStatus {
  success: boolean;
  message: string;
}

const CSVImport: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<ImportStatus | null>(null);

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, i) => {
        let value = values[i] || null;
        if (value === '') value = null;
        
        // Convert boolean strings
        if (value === 'Yes') value = true;
        if (value === 'No') value = false;
        
        // Convert dates
        if (header.includes('date') && value) {
          value = new Date(value).toISOString();
        }
        
        const key = header.toLowerCase().replace(/[^\w]+/g, '_');
        row[key] = value;
      });
      return row;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatus(null);

    try {
      const text = await file.text();
      const shops = parseCSV(text);

      // Insert shops in batches
      const batchSize = 100;
      for (let i = 0; i < shops.length; i += batchSize) {
        const batch = shops.slice(i, i + batchSize);
        const { error } = await supabase
          .from('shops')
          .insert(batch);

        if (error) throw error;
      }

      setStatus({
        success: true,
        message: `Successfully imported ${shops.length} shops`
      });
    } catch (error) {
      console.error('Import error:', error);
      setStatus({
        success: false,
        message: 'Error importing shops. Please check the console for details.'
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Import Shops</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Upload a CSV file containing shop data. The file should include headers matching the database columns.
          </p>
          <ul className="text-sm text-gray-500 list-disc list-inside">
            <li>First row must contain column headers</li>
            <li>Use "Yes" or "No" for boolean values</li>
            <li>Dates should be in YYYY-MM-DD format</li>
          </ul>
        </div>

        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={importing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className={`
            flex items-center justify-center border-2 border-dashed rounded-lg p-6
            ${importing ? 'border-gray-300 bg-gray-50' : 'border-green-300 hover:border-green-400 hover:bg-green-50'}
          `}>
            <div className="text-center">
              <Upload className={`
                w-8 h-8 mx-auto mb-2
                ${importing ? 'text-gray-400' : 'text-green-500'}
              `} />
              <p className="text-sm font-medium">
                {importing ? 'Importing...' : 'Click or drag CSV file here'}
              </p>
            </div>
          </div>
        </div>

        {status && (
          <div className={`
            mt-4 p-4 rounded-lg flex items-start
            ${status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
          `}>
            {status.success ? (
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            )}
            <p className="text-sm">{status.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVImport;