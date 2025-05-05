import fs from 'fs';
import path from 'path';

// Output file
const outputFile = 'all_shops.csv';

// Get all CSV files in the current directory
const csvFiles = fs.readdirSync('.').filter(file => file.endsWith('.csv'));

console.log(`Found ${csvFiles.length} CSV files to process...`);

// Create a write stream for the output file
const writeStream = fs.createWriteStream(outputFile);

// Header flag to track if header has been written
let headerWritten = false;

// Process each CSV file
csvFiles.forEach((file, index) => {
  console.log(`Processing (${index + 1}/${csvFiles.length}): ${file}`);
  
  // Skip the output file itself if it exists
  if (file === outputFile) return;
  
  // Read the content of the current file
  const content = fs.readFileSync(file, 'utf8');
  
  // Split content into lines
  const lines = content.split('\n');
  
  // Process lines
  lines.forEach((line, lineIndex) => {
    // Skip empty lines
    if (!line.trim()) return;
    
    // Check if this is a header line (contains "Shop Name" and is the first line or contains many column names)
    const isHeader = (lineIndex === 0 && line.includes('Shop Name')) || 
                     (line.includes('Shop Name') && line.includes('Address') && line.includes('City'));
    
    // Only write header once, for the first file
    if (isHeader) {
      if (!headerWritten) {
        writeStream.write(line + '\n');
        headerWritten = true;
      }
    } else {
      // Make sure it's a proper data line with at least one comma
      if (line.includes(',')) {
        writeStream.write(line + '\n');
      }
    }
  });
});

writeStream.end();

console.log(`All CSV files combined into ${outputFile}`);
console.log('Done!'); 