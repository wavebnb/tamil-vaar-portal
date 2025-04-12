
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "மின்னஞ்சல் அவசியம்";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்";
    }
    
    if (!formData.password) {
      newErrors.password = "கடவுச்சொல் அவசியம்";
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
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Get user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        setIsAuthenticated(true);
        setUser({
          id: data.user.id,
          name: profileData?.name || data.user.user_metadata?.name || 'User',
          email: data.user.email || '',
          avatar: profileData?.avatar || null,
          bio: profileData?.bio || null,
        });
        
        toast({
          title: "உள்நுழைவு வெற்றி",
          description: "வரவேற்கிறோம்!",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "உள்நுழைவு தோல்வி",
          description: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்",
          variant: "destructive",
        });
      } else {
        toast({
          title: "உள்நுழைவு தோல்வியடைந்தது",
          description: error.message || "ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              உள்நுழைக
            </CardTitle>
            <CardDescription className="text-center">
              உங்கள் கணக்கில் உள்நுழைந்து தொடரவும்
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">மின்னஞ்சல்</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="py-2 mt-1">
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">கடவுச்சொல்</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <Alert variant="destructive" className="py-2 mt-1">
                      <AlertDescription>{errors.password}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-tamil-blue" disabled={isSubmitting}>
                  {isSubmitting ? "செயலாக்கம்..." : "உள்நுழைக"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 items-center">
            <p className="text-sm text-gray-500">
              கணக்கு இல்லையா? {" "}
              <Link to="/register" className="text-tamil-blue hover:underline">
                பதிவு செய்க
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
