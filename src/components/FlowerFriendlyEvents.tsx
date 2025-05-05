import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Music, Heart, Share2, Ticket, Filter, Plus } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  address: string;
  description: string;
  image: string;
  attendees: number;
  price: string;
  category: string;
  tags: string[];
}

const demoEvents: Event[] = [
  {
    id: '1',
    title: 'Cannabis Cup 2023',
    date: '2023-07-15',
    location: 'Green Leaf Convention Center',
    address: 'Los Angeles, CA',
    description: 'The premier gathering for cannabis enthusiasts with competitions, exhibitions, and more.',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f96e?ixlib=rb-4.0.3',
    attendees: 1250,
    price: '$50 - $150',
    category: 'Festival',
    tags: ['competition', 'exhibition', 'music']
  },
  {
    id: '2',
    title: 'CBD Wellness Expo',
    date: '2023-08-20',
    location: 'Harmony Hall',
    address: 'Denver, CO',
    description: 'Learn about the health benefits of CBD with expert speakers and product demonstrations.',
    image: 'https://images.unsplash.com/photo-1585232352617-a8ee9f33e3b9?ixlib=rb-4.0.3',
    attendees: 850,
    price: '$25',
    category: 'Expo',
    tags: ['wellness', 'education', 'cbd']
  },
  {
    id: '3',
    title: 'Smoke & Chill - Live Music',
    date: '2023-06-30',
    location: 'Cloud 9 Lounge',
    address: 'Portland, OR',
    description: 'A relaxed evening with live music, food trucks, and a cannabis-friendly environment.',
    image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?ixlib=rb-4.0.3',
    attendees: 325,
    price: '$15',
    category: 'Social',
    tags: ['music', 'food', 'lounge']
  },
  {
    id: '4',
    title: 'Grow Your Own Workshop',
    date: '2023-07-08',
    location: 'Botany Center',
    address: 'Seattle, WA',
    description: 'Learn how to grow your own cannabis at home with expert cultivators.',
    image: 'https://images.unsplash.com/photo-1620219365994-f443a86a4ca7?ixlib=rb-4.0.3',
    attendees: 120,
    price: '$40',
    category: 'Workshop',
    tags: ['education', 'growing', 'cultivation']
  }
];

const categories = [
  { id: 'all', name: 'All Events' },
  { id: 'festival', name: 'Festivals' },
  { id: 'expo', name: 'Expos' },
  { id: 'social', name: 'Social Gatherings' },
  { id: 'workshop', name: 'Workshops' }
];

const FlowerFriendlyEvents: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewAll, setViewAll] = useState(false);
  
  const filteredEvents = selectedCategory === 'all' 
    ? demoEvents 
    : demoEvents.filter(event => event.category.toLowerCase() === selectedCategory.toLowerCase());
  
  // Display all events or just first 2
  const displayEvents = viewAll ? filteredEvents : filteredEvents.slice(0, 2);
  
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-12 rounded-xl shadow-sm">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-brand" />
              Flower Friendly Events
            </h2>
            <p className="text-gray-600 mt-2">
              Discover and connect at cannabis-friendly events in your area
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-brand text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {displayEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="md:flex h-full">
                <div className="md:w-1/3 relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-brand/70 backdrop-blur-sm text-white text-xs rounded-full px-2.5 py-1">
                    {event.category}
                  </div>
                </div>
                
                <div className="p-5 md:w-2/3">
                  <h3 className="font-bold text-xl text-neutral mb-2">{event.title}</h3>
                  
                  <div className="flex items-center mb-2 text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  <div className="flex items-center mb-2 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{event.location} - {event.address}</span>
                  </div>
                  
                  <div className="flex items-center mb-3 text-gray-500 text-sm">
                    <Users className="h-4 w-4 mr-1.5" />
                    <span>{event.attendees} attending</span>
                    <span className="mx-2">•</span>
                    <Ticket className="h-4 w-4 mr-1.5" />
                    <span>{event.price}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {event.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <button className="text-brand hover:text-brand-dark font-medium text-sm flex items-center">
                      Learn More
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <div className="flex space-x-2">
                      <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View all button */}
        {filteredEvents.length > 2 && (
          <div className="flex justify-center">
            <button 
              onClick={() => setViewAll(!viewAll)}
              className="px-5 py-2.5 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
            >
              {viewAll ? 'Show Less' : 'View All Events'}
              {!viewAll && <Plus className="h-4 w-4" />}
            </button>
          </div>
        )}
        
        {/* Create event button */}
        <div className="mt-12 text-center">
          <div className="inline-block mb-3 font-medium text-neutral">Organizing an event?</div>
          <div>
            <button 
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors shadow-md flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Add Your Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerFriendlyEvents; 