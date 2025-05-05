import fs from 'fs';

const filename = 'all_shops.csv';

try {
  console.log(`Reading file: ${filename}`);
  
  // Read file synchronously
  const stats = fs.statSync(filename);
  console.log(`File size: ${stats.size} bytes`);
  
  // Read file content
  const data = fs.readFileSync(filename, 'utf8');
  console.log(`Read ${data.length} bytes of data`);
  
  // Split by lines
  const allLines = data.split('\n');
  console.log(`Total lines (including empty): ${allLines.length}`);
  
  // Filter non-empty lines
  const nonEmptyLines = allLines.filter(line => line.trim() !== '');
  console.log(`Non-empty lines: ${nonEmptyLines.length}`);
  
  // Print sample of the data
  if (nonEmptyLines.length > 0) {
    console.log('\nHeader:');
    console.log(nonEmptyLines[0]);
    
    if (nonEmptyLines.length > 1) {
      console.log('\nFirst data record:');
      console.log(nonEmptyLines[1]);
    }
    
    if (nonEmptyLines.length > 2) {
      console.log('\nSecond data record:');
      console.log(nonEmptyLines[2]);
    }
    
    console.log(`\nTotal number of shop records: ${nonEmptyLines.length - 1}`);
  } else {
    console.log('File appears to be empty');
  }
} catch (error) {
  console.error(`Error processing file: ${error.message}`);
  console.error(error.stack);
} 