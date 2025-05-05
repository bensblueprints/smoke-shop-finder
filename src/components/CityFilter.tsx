import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { useShops } from '../context/ShopContext';
import { Shop } from '../types/shop';

interface CityFilterProps {
  state: string;
  onSelectCity: (city: string) => void;
  onClose: () => void;
}

// Top cities by state - would normally be pulled from an API or backend
const majorCitiesByState: Record<string, string[]> = {
  "AL": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
  "AK": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
  "AZ": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
  "AR": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
  "CA": ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose"],
  "CO": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"],
  "CT": ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"],
  "DE": ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
  "FL": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
  "GA": ["Atlanta", "Savannah", "Augusta", "Columbus", "Macon"],
  "HI": ["Honolulu", "Hilo", "Kailua", "Waipahu", "Pearl City"],
  "ID": ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
  "IL": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
  "IN": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
  "IA": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
  "KS": ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe"],
  "KY": ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
  "LA": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
  "ME": ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
  "MD": ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Annapolis"],
  "MA": ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  "MI": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"],
  "MN": ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington"],
  "MS": ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"],
  "MO": ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
  "MT": ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
  "NE": ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
  "NV": ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
  "NH": ["Manchester", "Nashua", "Concord", "Derry", "Dover"],
  "NJ": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton"],
  "NM": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
  "NY": ["New York", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
  "NC": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
  "ND": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
  "OH": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  "OK": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
  "OR": ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"],
  "PA": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
  "RI": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
  "SC": ["Columbia", "Charleston", "North Charleston", "Mount Pleasant", "Rock Hill"],
  "SD": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
  "TN": ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
  "TX": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
  "UT": ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
  "VT": ["Burlington", "South Burlington", "Rutland", "Essex Junction", "Bennington"],
  "VA": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News"],
  "WA": ["Seattle", "Tacoma", "Spokane", "Vancouver", "Bellevue"],
  "WV": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
  "WI": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
  "WY": ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
  "DC": ["Washington"]
};

const CityFilter: React.FC<CityFilterProps> = ({ state, onSelectCity, onClose }) => {
  const { shops } = useShops();
  const [cities, setCities] = useState<{name: string, count: number}[]>([]);
  
  useEffect(() => {
    if (!state) return;
    
    // Get a list of cities for the selected state from actual shop data
    const stateShops = shops.filter(shop => shop.state === state);
    
    // Count shops in each city
    const cityCounts: Record<string, number> = {};
    stateShops.forEach(shop => {
      if (shop.city) {
        cityCounts[shop.city] = (cityCounts[shop.city] || 0) + 1;
      }
    });
    
    // Convert to array and sort by count (descending)
    const sortedCities = Object.entries(cityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Limit to top 20 cities
    
    setCities(sortedCities);
  }, [state, shops]);
  
  // If we don't have shops in the database yet, use our predefined list
  const displayCities = cities.length > 0 
    ? cities 
    : (majorCitiesByState[state] || []).map(city => ({ name: city, count: 0 }));
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-4 border-b border-purple-100 pb-3">
        <h3 className="text-xl font-bold text-purple-800 flex items-center">
          <MapPin className="h-5 w-5 text-purple-500 mr-2" />
          Cities in {state}
        </h3>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-purple-50 rounded-full text-purple-600"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-2">
        {displayCities.map(city => (
          <button
            key={city.name}
            onClick={() => onSelectCity(city.name)}
            className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 
                       p-3 rounded-lg text-left transition-all transform hover:scale-105"
          >
            <span className="text-purple-700 font-medium">{city.name}</span>
            {city.count > 0 && (
              <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1">
                {city.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CityFilter; 