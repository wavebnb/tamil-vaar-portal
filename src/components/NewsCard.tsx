
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CalendarIcon, User } from "lucide-react";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  featured?: boolean;
}

const NewsCard = ({
  id,
  title,
  excerpt,
  image,
  category,
  author,
  date,
  featured = false,
}: NewsCardProps) => {
  return featured ? (
    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
      <div className="relative h-64 md:h-96">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <Link to={`/category/${category.toLowerCase()}`}>
            <Badge className="mb-2 bg-tamil-orange hover:bg-tamil-orange/80">
              {category}
            </Badge>
          </Link>
          <Link to={`/news/${id}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 hover:underline">
              {title}
            </h2>
          </Link>
          <p className="line-clamp-2 mb-2">{excerpt}</p>
          <div className="flex items-center text-sm opacity-80">
            <User className="h-4 w-4 mr-1" />
            <span className="mr-3">{author}</span>
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Card>
  ) : (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <Link to={`/news/${id}`}>
        <div className="relative h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <CardHeader className="p-4 pb-0">
        <Link to={`/category/${category.toLowerCase()}`}>
          <Badge className="mb-2 bg-tamil-blue hover:bg-tamil-blue/80">
            {category}
          </Badge>
        </Link>
        <Link to={`/news/${id}`}>
          <h3 className="font-bold text-lg hover:text-tamil-blue transition-colors">
            {title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 line-clamp-2">{excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-gray-500 flex items-center">
        <User className="h-3 w-3 mr-1" />
        <span className="mr-3">{author}</span>
        <CalendarIcon className="h-3 w-3 mr-1" />
        <span>{date}</span>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
