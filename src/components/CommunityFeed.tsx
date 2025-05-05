import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, Image, Smile, 
  MapPin, User, Users, Calendar, ThumbsUp, Bookmark, Send
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  images?: string[];
  timestamp: Date;
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  saved?: boolean;
  tags?: string[];
}

const dummyPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      username: 'vapequeen',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      isVerified: true,
    },
    content: "Just picked up this amazing new glass piece from @SmokeHaven! The craftsmanship is incredible and the percolator gives the smoothest hits. Definitely recommend checking them out if you're in the Portland area. #NewPiece #GlassArt",
    images: [
      'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    location: 'Portland, OR',
    likes: 128,
    comments: 24,
    shares: 5,
    tags: ['NewPiece', 'GlassArt', 'SmokeHaven']
  },
  {
    id: '2',
    author: {
      name: 'CBD Wellness Group',
      username: 'cbdwellness',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      isVerified: true,
    },
    content: "NEW STUDY: Recent research shows CBD may help reduce anxiety symptoms by 47% in participants with generalized anxiety disorder. Have you tried CBD for anxiety? Share your experience below! #CBDResearch #NaturalWellness",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 312,
    comments: 89,
    shares: 76,
    tags: ['CBDResearch', 'NaturalWellness', 'AnxietyRelief']
  },
  {
    id: '3',
    author: {
      name: 'Mike Stevens',
      username: 'vapetricks',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    content: "Check out this cloud comp from last weekend! Such an amazing atmosphere and great to meet so many fellow enthusiasts. Thanks to @CloudChasers for organizing! Who's going to the next one? 💨",
    images: [
      'https://images.unsplash.com/photo-1543203564-25307bf9004d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1559548331-f9cb98001426?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    location: 'Denver, CO',
    likes: 412,
    comments: 53,
    shares: 21,
    tags: ['VapeTricks', 'CloudComp', 'VapeCommunity']
  },
  {
    id: '4',
    author: {
      name: 'Green Leaf Dispensary',
      username: 'greenleafdispo',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      isVerified: true,
    },
    content: "🎉 WEEKEND SPECIAL: Buy one, get one 50% off on all Delta-8 products! Stop by our shop and mention this post. Valid Friday-Sunday only. Tag a friend who needs to know! #Delta8 #WeekendDeals",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    likes: 97,
    comments: 12,
    shares: 43,
    tags: ['Delta8', 'WeekendDeals', 'BOGO']
  },
  {
    id: '5',
    author: {
      name: 'Jason Lee',
      username: 'glasscollector',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    },
    content: "Added another piece to my collection today! This one's by @GlassArtist - they use a special technique to create these color-changing effects. Swipe to see it in different lighting! #GlassCollection #HeadyGlass",
    images: [
      'https://images.unsplash.com/photo-1612995925421-8252d85a7086?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1590341328520-63256eb32bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
    likes: 254,
    comments: 41,
    shares: 8,
    tags: ['GlassCollection', 'HeadyGlass', 'GlassArt']
  }
];

const formatTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else if (diffDay < 7) {
    return `${diffDay}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [newPostText, setNewPostText] = useState('');
  
  const handlePostLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.liked;
        return {
          ...post,
          liked: !isLiked,
          likes: isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };
  
  const handlePostSave = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved
        };
      }
      return post;
    }));
  };
  
  const handleNewPost = () => {
    if (newPostText.trim() === '') return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        username: 'you',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      },
      content: newPostText,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      saved: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostText('');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Create Post Card */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
              placeholder="Share something with the community..."
              rows={3}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <Image size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <MapPin size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <Smile size={20} />
                </button>
              </div>
              <button
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNewPost}
                disabled={newPostText.trim() === ''}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feed Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2 mb-6">
        <div className="flex justify-between">
          <button className="flex-1 py-2 text-center rounded-lg bg-brand text-white font-medium">
            Recent
          </button>
          <button className="flex-1 py-2 text-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Popular
          </button>
          <button className="flex-1 py-2 text-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Following
          </button>
          <button className="flex-1 py-2 text-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Shops
          </button>
        </div>
      </div>
      
      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Post Header */}
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-neutral">
                        {post.author.name}
                      </h3>
                      {post.author.isVerified && (
                        <span className="ml-1 bg-brand text-white text-xs rounded-full p-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>@{post.author.username}</span>
                      <span className="mx-1">•</span>
                      <span>{formatTime(post.timestamp)}</span>
                      {post.location && (
                        <>
                          <span className="mx-1">•</span>
                          <MapPin size={12} className="mr-1" />
                          <span>{post.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              {/* Post Content */}
              <div className="mt-3">
                <p className="text-neutral whitespace-pre-line">{post.content}</p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-brand text-sm hover:underline cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div className={`grid ${post.images.length > 1 ? 'grid-cols-2 gap-0.5' : 'grid-cols-1'}`}>
                {post.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-video bg-gray-100"
                  >
                    <img 
                      src={img} 
                      alt={`Post image ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Post Stats */}
            <div className="px-4 py-2 text-sm text-gray-500 flex items-center border-t border-gray-100">
              <div className="flex items-center mr-4">
                <ThumbsUp size={16} className="mr-1 text-brand" />
                <span>{post.likes}</span>
              </div>
              <div className="flex-1 text-right">
                <span>{post.comments} comments</span>
                <span className="mx-1">•</span>
                <span>{post.shares} shares</span>
              </div>
            </div>
            
            {/* Post Actions */}
            <div className="flex border-t border-gray-100 divide-x divide-gray-100">
              <button 
                className={`flex-1 py-2 flex items-center justify-center gap-2 ${
                  post.liked ? 'text-brand font-medium' : 'text-gray-500'
                } hover:bg-gray-50 transition-colors`}
                onClick={() => handlePostLike(post.id)}
              >
                <Heart size={18} className={post.liked ? 'fill-brand text-brand' : ''} />
                Like
              </button>
              <button className="flex-1 py-2 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors">
                <MessageCircle size={18} />
                Comment
              </button>
              <button className="flex-1 py-2 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors">
                <Share2 size={18} />
                Share
              </button>
              <button 
                className={`flex-1 py-2 flex items-center justify-center gap-2 ${
                  post.saved ? 'text-brand font-medium' : 'text-gray-500'
                } hover:bg-gray-50 transition-colors`}
                onClick={() => handlePostSave(post.id)}
              >
                <Bookmark size={18} className={post.saved ? 'fill-brand text-brand' : ''} />
                Save
              </button>
            </div>
            
            {/* Quick Comment */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                  placeholder="Write a comment..."
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-brand">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Community Connection Card */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl shadow-md p-6 mt-8">
        <div className="text-center">
          <Users className="h-10 w-10 mx-auto mb-3 text-brand" />
          <h3 className="text-xl font-bold text-neutral mb-2">Join the Community</h3>
          <p className="text-gray-600 mb-4">
            Connect with 50,000+ enthusiasts, shop owners, and industry experts!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors">
              Find Friends
            </button>
            <button className="px-4 py-2 bg-white text-brand border border-brand rounded-lg hover:bg-gray-50 transition-colors">
              Browse Groups
            </button>
          </div>
        </div>
        
        {/* Upcoming Events Teaser */}
        <div className="mt-6 bg-white rounded-lg p-4">
          <div className="flex items-start">
            <Calendar className="h-10 w-10 text-brand mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-neutral">Upcoming Events</h4>
              <p className="text-sm text-gray-600 mb-2">
                3 community events happening near you this week
              </p>
              <a href="/events" className="text-sm text-brand hover:underline">View all events</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed; 