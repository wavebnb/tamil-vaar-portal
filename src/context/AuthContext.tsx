
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          // Get user profile from the database
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
                
              if (error) {
                console.error("Error fetching profile:", error);
                return;
              }
                
              if (profileData) {
                setUser({
                  id: currentSession.user.id,
                  name: profileData.name,
                  email: profileData.email,
                  avatar: profileData.avatar,
                  bio: profileData.bio
                });
              } else {
                // Fallback to auth data if profile not found
                setUser({
                  id: currentSession.user.id,
                  name: currentSession.user.user_metadata?.name || 'User',
                  email: currentSession.user.email || '',
                  avatar: null,
                  bio: null
                });
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          // Get user profile
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
              
            if (error) {
              console.error("Error fetching profile:", error);
              setIsLoading(false);
              return;
            }
            
            if (profileData) {
              setUser({
                id: currentSession.user.id,
                name: profileData.name,
                email: profileData.email,
                avatar: profileData.avatar,
                bio: profileData.bio
              });
            } else {
              // Fallback to auth data
              setUser({
                id: currentSession.user.id,
                name: currentSession.user.user_metadata?.name || 'User',
                email: currentSession.user.email || '',
                avatar: null,
                bio: null
              });
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    session
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
