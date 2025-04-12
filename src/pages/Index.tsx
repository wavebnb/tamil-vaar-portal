
import { useState } from "react";
import Layout from "@/components/Layout";
import NewsCard from "@/components/NewsCard";
import { mockNews, mockCategories } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Get featured news (first item)
  const featuredNews = mockNews[0];
  
  // Get trending news (next 3 items)
  const trendingNews = mockNews.slice(1, 4);
  
  // Filter news based on active tab
  const filteredNews = activeTab === "all" 
    ? mockNews.slice(4) 
    : mockNews.filter(news => news.category === mockCategories.find(cat => cat.slug === activeTab)?.name);

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

        {/* Trending News */}
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
              {activeTab !== "all" && (
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
