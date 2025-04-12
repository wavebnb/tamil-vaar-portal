
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
import { mockUsers } from "@/data/mockData";

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
    }
    
    if (!formData.password) {
      newErrors.password = "கடவுச்சொல் அவசியம்";
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
      // For demo, use mock user
      const user = mockUsers.find(u => u.email === formData.email);
      
      if (user && formData.password === "password") {
        setIsAuthenticated(true);
        setUser(user);
        
        toast({
          title: "உள்நுழைவு வெற்றிகரமானது",
          description: "வரவேற்கிறோம்!",
        });
        
        navigate("/");
      } else {
        // Failed login
        setErrors({
          password: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்",
        });
      }
      
      setIsSubmitting(false);
    }, 1000);
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
              உங்கள் கணக்கில் உள்நுழைந்து செய்திகளை வாசிக்கவும் மற்றும் பகிரவும்
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
              <p className="text-sm font-semibold">செயல்விளக்கத்திற்கு, பின்வரும் தகவலைப் பயன்படுத்தவும்:</p>
              <p className="text-xs mt-1">மின்னஞ்சல்: senthil@example.com</p>
              <p className="text-xs">கடவுச்சொல்: password</p>
            </div>
            
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">கடவுச்சொல்</Label>
                    <Link to="/forgot-password" className="text-xs text-tamil-blue hover:underline">
                      கடவுச்சொல் மறந்துவிட்டீர்களா?
                    </Link>
                  </div>
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
          <CardFooter className="flex justify-center">
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
