import { Shop, BusinessType } from '../types/shop';

// Simple geocoding function - in real world, would use a geocoding service like Google Maps API
// This creates fake coordinates based on zip codes (not accurate, just for demo)
const getCoordinatesFromZipCode = (zipCode: string, state: string): [number, number] => {
  // Let's create coordinates based on US state rough positions
  // Not accurate positioning - just for demo purposes
  const stateCoordinates: Record<string, [number, number]> = {
    'AL': [32.7794, -86.8287],
    'AK': [64.0685, -152.2782],
    'AZ': [34.2744, -111.6602],
    'AR': [34.8938, -92.4426],
    'CA': [37.1841, -119.4696],
    'CO': [38.9972, -105.5478],
    'CT': [41.6219, -72.7273],
    'DE': [38.9896, -75.5050],
    'FL': [28.6305, -82.4497],
    'GA': [32.6415, -83.4426],
    'HI': [20.2927, -156.3737],
    'ID': [44.3509, -114.6130],
    'IL': [40.0417, -89.1965],
    'IN': [39.8942, -86.2816],
    'IA': [42.0751, -93.4960],
    'KS': [38.4937, -98.3804],
    'KY': [37.5347, -85.3021],
    'LA': [31.0689, -91.9968],
    'ME': [45.3695, -69.2428],
    'MD': [39.0550, -76.7909],
    'MA': [42.2596, -71.8083],
    'MI': [44.3467, -85.4102],
    'MN': [46.2807, -94.3053],
    'MS': [32.7364, -89.6678],
    'MO': [38.3566, -92.4580],
    'MT': [47.0527, -109.6333],
    'NE': [41.5378, -99.7951],
    'NV': [39.3289, -116.6312],
    'NH': [43.6805, -71.5811],
    'NJ': [40.1907, -74.6728],
    'NM': [34.4071, -106.1126],
    'NY': [42.9538, -75.5268],
    'NC': [35.5557, -79.3877],
    'ND': [47.4501, -100.4659],
    'OH': [40.2862, -82.7937],
    'OK': [35.5889, -97.4943],
    'OR': [43.9336, -120.5583],
    'PA': [40.8781, -77.7996],
    'RI': [41.6762, -71.5562],
    'SC': [33.9169, -80.8964],
    'SD': [44.4443, -100.2263],
    'TN': [35.8580, -86.3505],
    'TX': [31.4757, -99.3312],
    'UT': [39.3055, -111.6703],
    'VT': [44.0687, -72.6658],
    'VA': [37.5215, -78.8537],
    'WA': [47.3826, -120.4472],
    'WV': [38.6409, -80.6227],
    'WI': [44.6243, -89.9941],
    'WY': [42.9957, -107.5512],
    'DC': [38.9101, -77.0147]
  };

  const baseCoords = stateCoordinates[state] || [39.8283, -98.5795]; // Default to center of US
  
  // Add some randomness based on zip code for shops within the same state
  // Last 3 digits of zip code used to create variation
  const lastThreeDigits = parseInt(zipCode.slice(Math.max(0, zipCode.length - 3)), 10) || 0;
  
  // Add a small offset based on the last three digits of the zip code 
  // (up to +/- ~0.2 degrees lat/long which is roughly 10-15 miles)
  const latOffset = (lastThreeDigits % 100) * 0.004 - 0.2;
  const lngOffset = (lastThreeDigits % 100) * 0.006 - 0.3;
  
  return [
    baseCoords[0] + latOffset,
    baseCoords[1] + lngOffset
  ];
};

export function parseCSVData(csvData: string): Shop[] {
  console.log(`CSV data length: ${csvData.length} bytes`);
  
  // Split into lines
  const allLines = csvData.split('\n');
  console.log(`Total lines in CSV: ${allLines.length}`);
  
  // Process each line
  const shops: Shop[] = [];
  let shopId = 0;
  
  // Process all lines
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i].trim();
    
    // Skip empty lines and header line
    if (!line || line.startsWith('Shop Name,') || !line.includes(',')) {
      continue;
    }
    
    // Skip lines that are just commas
    if (line.replace(/,/g, '').trim() === '') {
      continue;
    }
    
    // Parse the line
    const pattern = /,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/;
    const columns = line.split(pattern);
    
    // Ensure line has enough columns
    if (columns.length < 8) continue;
    
    // Clean up column values and handle quoted values
    const cleanValue = (value: string) => {
      if (!value) return '';
      // Remove quotes if the value is quoted
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      return value.trim();
    };
    
    // Extract values
    const name = cleanValue(columns[0]);
    const address1 = cleanValue(columns[1]);
    const address2 = cleanValue(columns[2]);
    const city = cleanValue(columns[3]);
    const state = cleanValue(columns[4]);
    const zipCode = cleanValue(columns[5]);
    const phone = cleanValue(columns[6]);
    const website = cleanValue(columns[7]);
    const email = cleanValue(columns[8] || '');
    
    // Skip rows with missing critical information
    if (!name || !city || !state) {
      continue;
    }
    
    // Determine business type
    let businessType = BusinessType.Smoke; // Default
    if (name.toLowerCase().includes('vape')) {
      businessType = BusinessType.Vape;
    } else if (name.toLowerCase().includes('tobacco')) {
      businessType = BusinessType.Tobacco;
    } else if (name.toLowerCase().includes('hookah')) {
      businessType = BusinessType.Hookah;
    } else if (name.toLowerCase().includes('cbd')) {
      businessType = BusinessType.CBD;
    } else if (name.toLowerCase().includes('lounge')) {
      businessType = BusinessType.Lounge;
    }
    
    // Determine if shop has CBD based on name or other data
    const hasCBD = name.toLowerCase().includes('cbd') || 
                   businessType === BusinessType.CBD;
    
    // Determine if shop has Kratom based on name
    const hasKratom = name.toLowerCase().includes('kratom');
    
    // Generate coordinates for the shop based on its address
    const [latitude, longitude] = getCoordinatesFromZipCode(zipCode, state);

    shopId++;
    
    shops.push({
      id: shopId.toString(),
      name,
      address1,
      address2,
      city,
      state,
      zipCode,
      country: 'USA',
      phone,
      website,
      email,
      dateAdded: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      businessType,
      hasCBD,
      hasKratom,
      hasMarijuana: false,
      buyerName: '',
      title: '',
      claimed: false,
      latitude,
      longitude
    });
  }
  
  console.log(`Parsed ${shops.length} shops from CSV data`);
  return shops;
}

export function generateSearchIndex(shops: Shop[]): Record<string, string[]> {
  const searchIndex: Record<string, string[]> = {};
  
  shops.forEach(shop => {
    const shopId = shop.id;
    const searchTerms = [
      shop.name,
      shop.city,
      shop.state,
      shop.zipCode,
    ].filter(Boolean);
    
    searchTerms.forEach(term => {
      const normalizedTerm = term.toLowerCase();
      if (!searchIndex[normalizedTerm]) {
        searchIndex[normalizedTerm] = [];
      }
      if (!searchIndex[normalizedTerm].includes(shopId)) {
        searchIndex[normalizedTerm].push(shopId);
      }
    });
  });
  
  return searchIndex;
}