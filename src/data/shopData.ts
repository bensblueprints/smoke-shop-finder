import { parseCSVData } from '../utils/dataParser';

// Load the CSV data - use the combined file with all shops
const csvUrl = new URL('../../all_shops.csv', import.meta.url);

export const loadFullShopData = async (): Promise<string> => {
  try {
    console.log('Loading shop data from all_shops.csv...');
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }
    const csvData = await response.text();
    console.log(`Successfully loaded CSV data: ${csvData.length} bytes`);
    return csvData;
  } catch (error) {
    console.error('Error loading shop data:', error);
    return '';
  }
};

// Initialize with empty array, will be populated after data loads
export let shops: ReturnType<typeof parseCSVData> = [];

// Load the data immediately
loadFullShopData().then(csvData => {
  if (csvData) {
    shops = parseCSVData(csvData);
    console.log(`Loaded ${shops.length} shops`);
  } else {
    console.error('No CSV data was loaded');
  }
});