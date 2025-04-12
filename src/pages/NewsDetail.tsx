
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { mockNews } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye, MessageSquare, Share2, ThumbsUp, User, ChevronLeft } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const newsArticle = mockNews.find((news) => news.id === id);
      setArticle(newsArticle);
      
      // Get related news from same category
      if (newsArticle) {
        const related = mockNews
          .filter((news) => news.category === newsArticle.category && news.id !== id)
          .slice(0, 3);
        setRelatedNews(related);
      }
      
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">செய்தி கண்டுபிடிக்கப்படவில்லை</h2>
          <Link to="/">
            <Button>முகப்புக்குத் திரும்பு</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLike = () => {
    setLikes(likes + 1);
    toast({
      title: "விருப்பம் சேர்க்கப்பட்டது",
      description: "இந்த செய்திக்கு உங்கள் விருப்பம் பதிவு செய்யப்பட்டது.",
    });
  };

  const handleShare = () => {
    // In a real app, implement sharing functionality
    toast({
      title: "பகிர்வு",
      description: "இந்த செய்தி பகிரப்பட்டது.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center mb-6 text-tamil-blue hover:text-tamil-blue/80">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>முகப்புக்குத் திரும்பு</span>
          </Link>
          
          {/* Article Header */}
          <div className="mb-8">
            <Link to={`/category/${article.category.toLowerCase()}`}>
              <Badge className="mb-4 bg-tamil-blue hover:bg-tamil-blue/80">
                {article.category}
              </Badge>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-gray-600 text-sm gap-4 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>5 நிமிடம் படிக்க</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{article.views} பார்வைகள்</span>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden h-64 md:h-96 mb-6">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Article Content */}
          <Card className="p-6 mb-8">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            <div className="flex items-center mt-8 pt-4 border-t border-gray-100">
              <div className="flex items-center mr-6">
                <Button variant="outline" size="sm" onClick={handleLike} className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  <span>விருப்பம் ({likes})</span>
                </Button>
              </div>
              <div className="flex items-center mr-6">
                <Button variant="outline" size="sm" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>கருத்து</span>
                </Button>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>பகிர்</span>
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Author Info */}
          <Card className="p-6 mb-12">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={article.author.avatar} alt={article.author.name} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{article.author.name}</h3>
                <p className="text-sm text-gray-500">எழுத்தாளர்</p>
              </div>
            </div>
          </Card>
          
          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">தொடர்புடைய செய்திகள்</h2>
              <Separator className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((news) => (
                  <NewsCard
                    key={news.id}
                    id={news.id}
                    title={news.title}
                    excerpt={news.excerpt}
                    image={news.image}
                    category={news.category}
                    author={news.author.name}
                    date={news.date}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;
