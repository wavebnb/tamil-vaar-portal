
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { mockNews, mockCategories } from "@/data/mockData";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

const CategoryNews = () => {
  const { category } = useParams<{ category: string }>();
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const selectedCategory = mockCategories.find(
      (cat) => cat.slug === category
    );
    
    if (selectedCategory) {
      setCategoryName(selectedCategory.name);
      
      // Filter news by category
      const filteredNews = mockNews.filter(
        (news) => news.category === selectedCategory.name
      );
      
      setNewsItems(filteredNews);
    }
  }, [category]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Link to="/" className="inline-flex items-center mb-6 text-tamil-blue hover:text-tamil-blue/80">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>முகப்புக்குத் திரும்பு</span>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
          <p className="text-gray-600">
            {categoryName} தொடர்பான அனைத்து தற்போதைய செய்திகளும்
          </p>
        </div>
        
        {/* News List */}
        {newsItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
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
          <Card className="py-12 text-center">
            <p className="text-xl mb-4">இந்தப் பிரிவில் தற்போது செய்திகள் எதுவும் இல்லை.</p>
            <Link to="/">
              <Button className="bg-tamil-blue">முகப்புக்குத் திரும்பு</Button>
            </Link>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CategoryNews;
