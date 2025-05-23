
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCategories } from "@/data/mockData";
import MediaUpload from "@/components/MediaUpload";
import { supabase } from "@/integrations/supabase/client";

const PostNews = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    imageUrl: "",
    videoUrl: "",
    mediaType: "image" as "image" | "video",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ""
      }));
    }
  };
  
  const handleMediaTabChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      mediaType: value as "image" | "video"
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
    
    if (errors.imageUrl) {
      setErrors(prev => ({
        ...prev,
        imageUrl: ""
      }));
    }
  };

  const handleVideoUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      videoUrl: url
    }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "தலைப்பு அவசியம்";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "உள்ளடக்கம் அவசியம்";
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "சுருக்கம் அவசியம்";
    }
    
    if (!formData.category) {
      newErrors.category = "பிரிவு அவசியம்";
    }
    
    if (formData.mediaType === "image" && !formData.imageUrl) {
      newErrors.imageUrl = "படம் அவசியம்";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Save to Supabase
      const { data, error } = await supabase.from('news').insert({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        image_url: formData.imageUrl,
        video_url: formData.videoUrl,
        author_id: user.id,
        published: true, // Default to published
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "செய்தி வெளியிடப்பட்டது",
        description: "உங்கள் செய்தி வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.",
      });
      
      navigate("/profile");
    } catch (error: any) {
      console.error("Error submitting news:", error);
      toast({
        title: "பிழை ஏற்பட்டது",
        description: error.message || "செய்தியை சமர்ப்பிக்கும் போது பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">புதிய செய்தி எழுது</h1>
            <p className="text-gray-600">
              உங்கள் செய்தியை உருவாக்கி சமூகத்துடன் பகிரவும்
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>செய்தி விவரங்கள்</CardTitle>
              <CardDescription>
                உங்கள் செய்தியின் அனைத்து தேவையான விவரங்களையும் உள்ளிடவும்
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">தலைப்பு</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="செய்தியின் தலைப்பை உள்ளிடவும்"
                  />
                  {errors.title && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.title}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">சுருக்கம்</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    rows={2}
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="செய்தியின் சுருக்கமான விளக்கம் (160 எழுத்துகளுக்குள்)"
                  />
                  {errors.excerpt && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.excerpt}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">உள்ளடக்கம்</Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={8}
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="செய்தியின் முழு உள்ளடக்கத்தை இங்கே எழுதவும்"
                  />
                  {errors.content && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.content}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">பிரிவு</Label>
                  <Select onValueChange={handleSelectChange} value={formData.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="ஒரு பிரிவைத் தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map(category => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.category}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>ஊடகம்</Label>
                  <Tabs value={formData.mediaType} onValueChange={handleMediaTabChange}>
                    <TabsList className="grid grid-cols-2 w-[200px]">
                      <TabsTrigger value="image">படம்</TabsTrigger>
                      <TabsTrigger value="video">வீடியோ</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="image" className="mt-4">
                      <MediaUpload
                        type="image"
                        onUploadComplete={handleImageUpload}
                        value={formData.imageUrl}
                      />
                      {errors.imageUrl && (
                        <Alert variant="destructive" className="py-2 mt-2">
                          <AlertDescription>{errors.imageUrl}</AlertDescription>
                        </Alert>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="video" className="mt-4">
                      <MediaUpload
                        type="video"
                        onUploadComplete={handleVideoUpload}
                        value={formData.videoUrl}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        வீடியோ விருப்பத்தேர்வானது. இது இல்லாமலும் நீங்கள் தொடரலாம்.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button type="submit" className="bg-tamil-blue" disabled={isSubmitting}>
                    {isSubmitting ? "சமர்ப்பிக்கிறது..." : "செய்தியை சமர்ப்பி"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    ரத்து செய்
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PostNews;
