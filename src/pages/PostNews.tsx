
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
import { mockCategories } from "@/data/mockData";

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
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "படம் URL அவசியம்";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "செய்தி வெளியிடப்பட்டது",
        description: "உங்கள் செய்தி வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது மற்றும் மதிப்பாய்வுக்காக காத்திருக்கிறது.",
      });
      
      navigate("/profile");
      setIsSubmitting(false);
    }, 1500);
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
                  <Label htmlFor="imageUrl">படம் URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="செய்தியின் படத்திற்கான URL-ஐ உள்ளிடவும்"
                  />
                  <p className="text-xs text-gray-500">
                    படத்திற்கான ஒரு URL-ஐ உள்ளிடவும் (உதாரணம்: https://images.unsplash.com/...)
                  </p>
                  {errors.imageUrl && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription>{errors.imageUrl}</AlertDescription>
                    </Alert>
                  )}
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
