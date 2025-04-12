
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import NewsCard from "@/components/NewsCard";
import { mockCategories } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";

// Define types for our news data
interface Author {
  id: string;
  name: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: Author;
}

const fetchNews = async () => {
  const { data, error } = await supabase
    .from("news")
    .select(`
      id, 
      title, 
      excerpt, 
      content, 
      image_url,
      category,
      created_at,
      author_id,
      profiles:author_id (id, name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    throw error;
  }

  // Transform the data to match our NewsItem interface
  return data.map(item => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    image: item.image_url || "/placeholder.svg", // Fallback to placeholder if no image
    category: item.category,
    date: format(parseISO(item.created_at), 'yyyy-MM-dd HH:mm'),
    author: {
      id: item.profiles?.id || "",
      name: item.profiles?.name || "Unknown Author"
    }
  })) as NewsItem[];
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch news from Supabase using React Query
  const { data: newsItems = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews
  });
  
  // Get featured news (first item if available)
  const featuredNews = newsItems.length > 0 ? newsItems[0] : null;
  
  // Get trending news (next 3 items)
  const trendingNews = newsItems.slice(1, 4);
  
  // Filter news based on active tab
  const filteredNews = activeTab === "all" 
    ? newsItems.slice(4) 
    : newsItems.filter(news => news.category === mockCategories.find(cat => cat.slug === activeTab)?.name);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading news...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Error loading news</h1>
            <p className="text-lg text-gray-600">Please try again later.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-tamil-blue">
            தமிழ் வார் <span className="text-tamil-orange">செய்திகள்</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            தமிழ்நாட்டின் முன்னணி செய்தி இணையதளம், நம்பகமான செய்திகள் மற்றும் தகவல்கள்.
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="mb-12">
            <NewsCard
              id={featuredNews.id}
              title={featuredNews.title}
              excerpt={featuredNews.excerpt}
              image={featuredNews.image}
              category={featuredNews.category}
              author={featuredNews.author.name}
              date={featuredNews.date}
              featured={true}
            />
          </div>
        )}

        {/* Trending News */}
        {trendingNews.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-tamil-dark">
                முக்கிய செய்திகள்
              </h2>
              <Link to="/category/trending">
                <Button variant="ghost" className="group">
                  அனைத்தையும் காண்க
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingNews.map((news) => (
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

        {/* Categorized News */}
        <div>
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap mb-4">
              <TabsTrigger value="all">அனைத்தும்</TabsTrigger>
              {mockCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.slug}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.slice(0, 6).map((news) => (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No news available in this category yet.</p>
                </div>
              )}
              {activeTab !== "all" && filteredNews.length > 0 && (
                <div className="text-center mt-8">
                  <Link to={`/category/${activeTab}`}>
                    <Button className="bg-tamil-blue">
                      மேலும் {mockCategories.find(cat => cat.slug === activeTab)?.name} செய்திகள்
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
