import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';

// Define types for RSS feed items
interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  isoDate?: string;
  creator?: string;
  categories?: string[];
}

interface CannabisNewsFeedProps {
  maxItems?: number;
}

const CannabisNewsFeed: React.FC<CannabisNewsFeedProps> = ({ maxItems = 5 }) => {
  const [news, setNews] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // List of cannabis news RSS feeds
  const rssFeeds = [
    'https://www.leafly.com/feed',
    'https://www.ganjapreneur.com/feed/',
    'https://www.cannabisbusinesstimes.com/rss/',
    'https://mjbizdaily.com/feed/',
    'https://hightimes.com/feed/'
  ];

  useEffect(() => {
    const fetchRssFeeds = async () => {
      try {
        setLoading(true);
        
        // Create a CORS proxy URL to avoid CORS issues
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        
        const parser = new Parser();
        let allNews: FeedItem[] = [];
        
        // Fetch news from multiple sources
        for (const feedUrl of rssFeeds) {
          try {
            const proxyUrl = encodeURIComponent(feedUrl);
            const feed = await parser.parseURL(`${corsProxy}${proxyUrl}`);
            
            if (feed.items && feed.items.length > 0) {
              // Add source name to each item
              const sourceName = feed.title || new URL(feedUrl).hostname.replace('www.', '');
              const sourceItems = feed.items.map(item => ({
                ...item,
                source: sourceName
              })) as unknown as FeedItem[];
              
              allNews = [...allNews, ...sourceItems];
            }
          } catch (feedError) {
            console.error(`Error fetching feed ${feedUrl}:`, feedError);
            // Continue with other feeds even if one fails
          }
        }
        
        // Sort by date (newest first) and limit to maxItems
        allNews.sort((a, b) => {
          const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
          const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
          return dateB - dateA;
        });
        
        setNews(allNews.slice(0, maxItems));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching RSS feeds:', err);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    fetchRssFeeds();
  }, [maxItems]);

  // Format publication date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-full bg-amber-400 h-3 w-3"></div>
          <div className="rounded-full bg-amber-400 h-3 w-3"></div>
          <div className="rounded-full bg-amber-400 h-3 w-3"></div>
        </div>
        <p className="text-gray-400 mt-2">Loading latest cannabis news...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="py-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Empty news state
  if (news.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p>No cannabis news articles available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Newspaper className="h-5 w-5 text-amber-500 mr-2" />
          Latest Cannabis News
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-all duration-200 flex flex-col h-full"
            >
              <h4 className="font-medium text-white text-md mb-2 line-clamp-2 hover:text-amber-400">
                {item.title}
              </h4>
              <p className="text-gray-300 text-sm mb-3 line-clamp-3 flex-grow">
                {item.contentSnippet || "Read more..."}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(item.pubDate || item.isoDate || '')}
                </div>
                <div className="flex items-center text-amber-400">
                  Read More
                  <ExternalLink className="h-3 w-3 ml-1" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CannabisNewsFeed; 