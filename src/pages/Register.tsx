
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    
    if (!formData.name.trim()) {
      newErrors.name = "பெயர் அவசியம்";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "மின்னஞ்சல் அவசியம்";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்";
    }
    
    if (!formData.password) {
      newErrors.password = "கடவுச்சொல் அவசியம்";
    } else if (formData.password.length < 6) {
      newErrors.password = "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "கடவுச்சொல் பொருந்தவில்லை";
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
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setIsAuthenticated(true);
        setUser({
          id: data.user.id,
          name: formData.name,
          email: formData.email,
          avatar: null,
        });
        
        toast({
          title: "பதிவு வெற்றிகரமாக முடிந்தது",
          description: "உங்கள் கணக்கு உருவாக்கப்பட்டது.",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.message.includes("email")) {
        setErrors(prev => ({ ...prev, email: "இந்த மின்னஞ்சல் ஏற்கனவே பயன்படுத்தப்படுகிறது" }));
      } else {
        toast({
          title: "பதிவு தோல்வியடைந்தது",
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
              பதிவு செய்க
            </CardTitle>
            <CardDescription className="text-center">
              உங்கள் சொந்த கணக்கை உருவாக்கி தமிழ் வார் இணையதளத்தில் செய்திகளை பகிரவும்
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">பெயர்</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="உங்கள் பெயர்"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <Alert variant="destructive" className="py-2 mt-1">
                      <AlertDescription>{errors.name}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">கடவுச்சொல் உறுதிப்படுத்தல்</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <Alert variant="destructive" className="py-2 mt-1">
                      <AlertDescription>{errors.confirmPassword}</AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-tamil-blue" disabled={isSubmitting}>
                  {isSubmitting ? "செயலாக்கம்..." : "பதிவு செய்க"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              ஏற்கனவே கணக்கு உள்ளதா? {" "}
              <Link to="/login" className="text-tamil-blue hover:underline">
                உள்நுழைக
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
