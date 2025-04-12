
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Home, Newspaper, PenSquare } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const NavBar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "வெற்றிகரமாக வெளியேறியது",
        description: "நீங்கள் வெற்றிகரமாக வெளியேறிவிட்டீர்கள்",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "வெளியேறுவதில் பிழை",
        description: "வெளியேறுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { name: "அரசியல்", path: "/category/politics" },
    { name: "சினிமா", path: "/category/cinema" },
    { name: "விளையாட்டு", path: "/category/sports" },
    { name: "தொழில்நுட்பம்", path: "/category/technology" },
    { name: "கல்வி", path: "/category/education" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-tamil-blue">
              தமிழ் வார்
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 hover:text-tamil-blue">
              முகப்பு
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-2">
                  பிரிவுகள்
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.path}>
                    <Link
                      to={category.path}
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/post-news" 
                  className="px-3 py-2 hover:text-tamil-blue"
                >
                  செய்தி எழுது
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-3 py-2">
                      <User className="h-5 w-5 mr-1" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link to="/profile" className="w-full">
                        சுயவிவரம்
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      வெளியேறு
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="px-3 py-2">
                    உள்நுழைக
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="bg-tamil-blue">
                    பதிவு செய்க
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="inline h-4 w-4 mr-2" />
              முகப்பு
            </Link>
            
            <div className="px-3 py-2 font-semibold">பிரிவுகள்:</div>
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="block px-6 py-2 rounded hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Newspaper className="inline h-4 w-4 mr-2" />
                {category.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/post-news"
                  className="block px-3 py-2 rounded hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PenSquare className="inline h-4 w-4 mr-2" />
                  செய்தி எழுது
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="inline h-4 w-4 mr-2" />
                  சுயவிவரம்
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-muted"
                >
                  <LogOut className="inline h-4 w-4 mr-2" />
                  வெளியேறு
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  உள்நுழைக
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-tamil-blue text-white rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  பதிவு செய்க
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavBar;
