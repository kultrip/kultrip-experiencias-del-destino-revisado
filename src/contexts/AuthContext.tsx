import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch user preferences
      const { data: preferences, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (preferencesError) throw preferencesError;

      // Fetch notification preferences
      const { data: notifications, error: notificationsError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (notificationsError) throw notificationsError;

      // Fetch privacy settings
      const { data: privacy, error: privacyError } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (privacyError) throw privacyError;

      // Construct user object
      const userData: User = {
        id: profile.id,
        email: (await supabase.auth.getUser()).data.user?.email || '',
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        avatar: profile.avatar,
        dateOfBirth: profile.date_of_birth,
        nationality: profile.nationality,
        preferredLanguage: profile.preferred_language,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        emailVerified: true,
        status: profile.status,
        role: profile.role,
        profile: {
          interests: preferences.interests,
          budgetRange: preferences.budget_range,
          groupSizePreference: preferences.group_size_preference,
          accessibilityNeeds: preferences.accessibility_needs,
          bio: preferences.bio,
          location: preferences.location,
          experienceLevel: preferences.experience_level,
          specializations: preferences.specializations,
          notifications: {
            email: {
              bookingConfirmation: notifications.email_booking_confirmation,
              experienceRecommendations: notifications.email_experience_recommendations,
              promotionalOffers: notifications.email_promotional_offers,
              experienceUpdates: notifications.email_experience_updates,
              socialActivity: notifications.email_social_activity,
            },
            push: {
              bookingReminders: notifications.push_booking_reminders,
              lastMinuteDeals: notifications.push_last_minute_deals,
              weatherAlerts: notifications.push_weather_alerts,
            },
          },
          privacy: {
            profileVisibility: privacy.profile_visibility,
            showRealName: privacy.show_real_name,
            shareBookingHistory: privacy.share_booking_history,
            allowContactFromProviders: privacy.allow_contact_from_providers,
          },
        },
      };

      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // User profile will be loaded by the auth state change listener
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName || 'Usuario',
            last_name: userData.lastName || 'Nuevo',
            phone: userData.phone,
            preferred_language: userData.preferredLanguage || 'es',
          }
        }
      });
      
      if (error) throw error;
      
      // User profile will be created automatically by the database trigger
      // and loaded by the auth state change listener
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Update user profile in Supabase
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          phone: updates.phone,
          preferred_language: updates.preferredLanguage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update user preferences if included
      if (updates.profile) {
        const { error: preferencesError } = await supabase
          .from('user_preferences')
          .update({
            interests: updates.profile.interests,
            budget_range: updates.profile.budgetRange,
            group_size_preference: updates.profile.groupSizePreference,
            accessibility_needs: updates.profile.accessibilityNeeds,
            bio: updates.profile.bio,
            location: updates.profile.location,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (preferencesError) throw preferencesError;
      }

      // Refresh user data
      await fetchUserProfile(user.id);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};