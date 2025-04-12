
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import NewsCard from "@/components/NewsCard";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  author_id: string;
  created_at: string;
}

const Profile = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [userNews, setUserNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    
    // Fetch user's news from Supabase
    const fetchUserNews = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setUserNews(data || []);
      } catch (error) {
        console.error("Error fetching user news:", error);
        toast({
          title: "செய்திகளை பெறுவதில் பிழை",
          description: "உங்கள் செய்திகளை பெறுவதில் பிழை ஏற்பட்டது.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserNews();
  }, [isAuthenticated, user, navigate, toast]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userProfile.name,
          bio: userProfile.bio,
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setUser({
        ...user,
        name: userProfile.name,
        bio: userProfile.bio,
      });
      
      setIsEditing(false);
      
      toast({
        title: "சுயவிவரம் புதுப்பிக்கப்பட்டது",
        description: "உங்கள் சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "சுயவிவரத்தை புதுப்பிப்பதில் பிழை",
        description: error.message || "உங்கள் சுயவிவரத்தை புதுப்பிப்பதில் பிழை ஏற்பட்டது.",
        variant: "destructive",
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">சுயவிவரம்</h1>
            <p className="text-gray-600">உங்கள் தனிப்பட்ட தகவல்களை நிர்வகிக்கவும்</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>சுயவிவரம்</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl mb-1">{userProfile.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{userProfile.email}</p>
                {!isEditing && userProfile.bio && (
                  <p className="text-sm text-center">{userProfile.bio}</p>
                )}
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    சுயவிவரத்தை திருத்து
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>சுயவிவரத்தை திருத்து</CardTitle>
                    <CardDescription>
                      உங்கள் தனிப்பட்ட தகவல்களை புதுப்பிக்கவும்
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">பெயர்</Label>
                          <Input
                            id="name"
                            name="name"
                            value={userProfile.name}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">மின்னஞ்சல்</Label>
                          <Input
                            id="email"
                            name="email"
                            value={userProfile.email}
                            disabled
                          />
                          <p className="text-xs text-gray-500">மின்னஞ்சலை மாற்ற முடியாது</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">சுயவிவரக் குறிப்பு</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            placeholder="உங்களைப் பற்றி சிறிது எழுதுங்கள்"
                            value={userProfile.bio || ""}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                          <Button type="submit" className="bg-tamil-blue">
                            சேமி
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            ரத்து செய்
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="news">
                  <TabsList className="mb-6">
                    <TabsTrigger value="news">என் செய்திகள்</TabsTrigger>
                    <TabsTrigger value="saved">சேமித்த செய்திகள்</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="news">
                    <h2 className="text-xl font-bold mb-4">நீங்கள் எழுதிய செய்திகள்</h2>
                    {isLoading ? (
                      <Card className="p-6 text-center">
                        <p>செய்திகளை ஏற்றுகிறது...</p>
                      </Card>
                    ) : userNews.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {userNews.map(news => (
                          <NewsCard
                            key={news.id}
                            id={news.id}
                            title={news.title}
                            excerpt={news.excerpt}
                            image={news.image_url}
                            category={news.category}
                            author={user?.name || ""}
                            date={new Date(news.created_at).toLocaleDateString()}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-6 text-center">
                        <p className="mb-4">நீங்கள் இன்னும் எந்த செய்தியும் எழுதவில்லை.</p>
                        <Button onClick={() => navigate("/post-news")} className="bg-tamil-blue">
                          புதிய செய்தி எழுது
                        </Button>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="saved">
                    <h2 className="text-xl font-bold mb-4">சேமித்த செய்திகள்</h2>
                    <Card className="p-6 text-center">
                      <p>நீங்கள் இன்னும் எந்த செய்தியும் சேமிக்கவில்லை.</p>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
