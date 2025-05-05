import React, { useState } from 'react';
import { Users, MapPin, Leaf, Clock, MessageCircle, Share2, Shield, Filter } from 'lucide-react';

interface SeshMeetupProps {
  className?: string;
}

type MeetupType = 'share' | 'needWeed' | 'haveWeed' | 'explore' | 'any';
type MeetupDistance = 1 | 5 | 10 | 25 | 50;

interface SeshProfile {
  id: number;
  name: string;
  age: number;
  distance: number;
  type: MeetupType;
  message: string;
  image: string;
  online: boolean;
}

const SeshMeetup: React.FC<SeshMeetupProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'messages'>('browse');
  const [meetupType, setMeetupType] = useState<MeetupType>('any');
  const [distance, setDistance] = useState<MeetupDistance>(10);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock data for sample profiles
  const sampleProfiles: SeshProfile[] = [
    {
      id: 1,
      name: 'SmokeySam',
      age: 28,
      distance: 0.8,
      type: 'share',
      message: 'Looking to share some Blue Dream and chill',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      online: true,
    },
    {
      id: 2,
      name: 'VapeLady',
      age: 24,
      distance: 1.4,
      type: 'haveWeed',
      message: 'Got some Purple Haze, who wants to join?',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      online: true,
    },
    {
      id: 3,
      name: 'GreenThumb',
      age: 32,
      distance: 2.7,
      type: 'explore',
      message: 'New in town, looking to explore dispensaries',
      image: 'https://randomuser.me/api/portraits/men/68.jpg',
      online: false,
    },
    {
      id: 4,
      name: 'BlazingB',
      age: 26,
      distance: 3.5,
      type: 'needWeed',
      message: 'Dry spell. Can anyone help a sister out?',
      image: 'https://randomuser.me/api/portraits/women/22.jpg',
      online: true,
    },
    {
      id: 5,
      name: 'ChillDude',
      age: 30,
      distance: 4.2,
      type: 'share',
      message: 'Got a new bong. Let\'s break it in!',
      image: 'https://randomuser.me/api/portraits/men/42.jpg',
      online: false,
    },
  ];
  
  const filteredProfiles = sampleProfiles.filter(profile => 
    (meetupType === 'any' || profile.type === meetupType) && 
    profile.distance <= distance
  );

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Users className="h-5 w-5 mr-2" />
            SeshBuddy
          </h2>
          <span className="bg-green-500 text-xs px-2 py-1 rounded-full">Beta</span>
        </div>
        <p className="text-sm text-green-100 mt-1">Meet up, light up, connect</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-3 text-center font-medium text-sm ${
            activeTab === 'browse' 
              ? 'text-purple-700 border-b-2 border-purple-600' 
              : 'text-gray-500 hover:text-purple-600'
          }`}
        >
          Browse
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-3 text-center font-medium text-sm ${
            activeTab === 'create' 
              ? 'text-purple-700 border-b-2 border-purple-600' 
              : 'text-gray-500 hover:text-purple-600'
          }`}
        >
          Create Sesh
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-3 text-center font-medium text-sm ${
            activeTab === 'messages' 
              ? 'text-purple-700 border-b-2 border-purple-600' 
              : 'text-gray-500 hover:text-purple-600'
          }`}
        >
          Messages
          <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">2</span>
        </button>
      </div>
      
      {/* Browse Tab Content */}
      {activeTab === 'browse' && (
        <div className="p-4">
          {/* Filters */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Nearby Sesh Buddies</h3>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-xs text-purple-600 hover:text-purple-800"
              >
                <Filter className="h-3 w-3 mr-1" />
                Filters
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1">Looking for</label>
                  <select 
                    value={meetupType}
                    onChange={(e) => setMeetupType(e.target.value as MeetupType)}
                    className="w-full px-2 py-1.5 text-sm border border-purple-200 rounded-md"
                  >
                    <option value="any">Any Sesh Type</option>
                    <option value="share">Willing to Share</option>
                    <option value="needWeed">Need Weed</option>
                    <option value="haveWeed">Have Weed</option>
                    <option value="explore">Explore Together</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Distance (miles)</label>
                  <select 
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value) as MeetupDistance)}
                    className="w-full px-2 py-1.5 text-sm border border-purple-200 rounded-md"
                  >
                    <option value="1">1 mile</option>
                    <option value="5">5 miles</option>
                    <option value="10">10 miles</option>
                    <option value="25">25 miles</option>
                    <option value="50">50 miles</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Profiles List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <div key={profile.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={profile.image} 
                        alt={profile.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800 flex items-center">
                            {profile.name}, {profile.age}
                            {profile.online && (
                              <span className="h-2 w-2 bg-green-500 rounded-full ml-2"></span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {profile.distance} miles away
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getSeshTypeStyles(profile.type)}`}>
                          {getSeshTypeLabel(profile.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{profile.message}</p>
                      <div className="flex justify-end mt-2">
                        <button className="text-xs px-3 py-1 text-purple-600 hover:bg-purple-50 rounded-md transition-colors">
                          <MessageCircle className="h-3 w-3 inline mr-1" />
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p>No sesh buddies found with current filters.</p>
                <p className="text-sm">Try adjusting your filters or create a new sesh!</p>
              </div>
            )}
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg mt-4">
            <p className="text-xs text-center text-gray-600">
              <Shield className="h-3 w-3 inline mx-1" />
              SeshBuddy is a $4.20 members-only feature. Your privacy is our top priority.
            </p>
          </div>
        </div>
      )}
      
      {/* Create Sesh Tab Content */}
      {activeTab === 'create' && (
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Create a Sesh Meetup</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sesh Type</label>
              <select className="w-full px-3 py-2 text-sm border border-purple-200 rounded-md">
                <option>I want to share my stash</option>
                <option>I'm looking for weed</option>
                <option>I have weed to share</option>
                <option>Let's explore together</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Your Message</label>
              <textarea 
                className="w-full px-3 py-2 text-sm border border-purple-200 rounded-md h-20"
                placeholder="Tell potential buddies what you're looking for..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Meetup Location</label>
              <div className="flex space-x-2">
                <select className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-md">
                  <option>Current Location</option>
                  <option>Specific Address</option>
                  <option>At a Smoke Shop</option>
                </select>
                <button className="bg-purple-100 text-purple-700 px-3 rounded-md hover:bg-purple-200">
                  <MapPin className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">When</label>
              <div className="flex space-x-2">
                <select className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-md">
                  <option>Right Now</option>
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This Weekend</option>
                  <option>Custom Date</option>
                </select>
                <button className="bg-purple-100 text-purple-700 px-3 rounded-md hover:bg-purple-200">
                  <Clock className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-green-500 text-white py-2 rounded-md hover:from-purple-700 hover:to-green-600 transition-colors">
              Create Sesh Meetup
            </button>
            
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <p className="text-xs text-center text-gray-700">
                <Shield className="h-3 w-3 inline mx-1" />
                Always meet in public places and follow our community safety guidelines.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Messages Tab Content */}
      {activeTab === 'messages' && (
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your Messages</h3>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="VapeLady" 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    VapeLady
                    <span className="ml-2 h-2 w-2 bg-green-500 rounded-full"></span>
                    <span className="ml-auto text-xs text-gray-500">12m ago</span>
                  </h4>
                  <p className="text-sm text-gray-600 truncate">Hey! I'm down to share my Purple Haze...</p>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700">
                  Reply
                </button>
              </div>
            </div>
            
            <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="SmokeySam" 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    SmokeySam
                    <span className="ml-2 h-2 w-2 bg-green-500 rounded-full"></span>
                    <span className="ml-auto text-xs text-gray-500">43m ago</span>
                  </h4>
                  <p className="text-sm text-gray-600 truncate">Still up for that Blue Dream session?</p>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700">
                  Reply
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/68.jpg" 
                  alt="GreenThumb" 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    GreenThumb
                    <span className="ml-auto text-xs text-gray-500">2d ago</span>
                  </h4>
                  <p className="text-sm text-gray-600 truncate">Thanks for showing me around yesterday!</p>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">
                  Reply
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg mt-4 border border-green-100">
            <p className="text-xs text-center text-gray-700">
              <Shield className="h-3 w-3 inline mx-1" />
              All messages are encrypted. We respect your privacy.
            </p>
          </div>
        </div>
      )}
      
      {/* Premium Badge */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-3 text-white text-center text-sm">
        <p className="font-medium">$4.20 Member Exclusive Feature</p>
        <p className="text-xs text-purple-200 mt-1">Upgrade to connect with 420-friendly people near you</p>
      </div>
    </div>
  );
};

// Helper functions
function getSeshTypeLabel(type: MeetupType): string {
  switch (type) {
    case 'share': return 'Sharing';
    case 'needWeed': return 'Needs Weed';
    case 'haveWeed': return 'Has Weed';
    case 'explore': return 'Exploring';
    default: return 'Any';
  }
}

function getSeshTypeStyles(type: MeetupType): string {
  switch (type) {
    case 'share': return 'bg-purple-100 text-purple-800';
    case 'needWeed': return 'bg-orange-100 text-orange-800';
    case 'haveWeed': return 'bg-green-100 text-green-800';
    case 'explore': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default SeshMeetup; 