import fs from 'fs';
import path from 'path';
import { parseCSVData } from '../utils/dataParser';

// This script would be used to load the full CSV data and write it to a JSON file
const loadFullCSVData = () => {
  try {
    // This path would be where your CSV file is located
    const csvPath = path.resolve(__dirname, '../data/shops.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    const shops = parseCSVData(csvData);
    
    // Write the parsed data to a JSON file
    const jsonOutput = path.resolve(__dirname, '../data/shops.json');
    fs.writeFileSync(jsonOutput, JSON.stringify(shops, null, 2));
    
    console.log(`Successfully parsed ${shops.length} shops and saved to ${jsonOutput}`);
  } catch (error) {
    console.error('Error processing CSV file:', error);
  }
};

// Execute the function if this file is run directly
if (require.main === module) {
  loadFullCSVData();
}

export default loadFullCSVData;