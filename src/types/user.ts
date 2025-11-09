// User management types for Kultrip platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  nationality?: string;
  preferredLanguage: 'es' | 'en' | 'gl'; // Spanish, English, Galician
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  status: 'active' | 'suspended' | 'pending_verification';
  role: UserRole;
  profile: UserProfile;
}

export type UserRole = 
  | 'traveler'           // Regular customer
  | 'experience_creator' // Can create and publish experiences
  | 'provider'          // Activity provider (business)
  | 'guide'             // Professional guide
  | 'admin'             // Platform administrator
  | 'moderator';        // Content moderator

export interface UserProfile {
  // Travel Preferences
  interests: InterestCategory[];
  budgetRange: BudgetRange;
  groupSizePreference: 'solo' | 'couple' | 'small_group' | 'large_group' | 'family';
  accessibilityNeeds?: AccessibilityNeed[];
  
  // Personal Info
  bio?: string;
  location?: {
    city: string;
    region: string;
    country: string;
  };
  
  // Experience & Reputation (for creators)
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  specializations?: string[];
  rating?: number;
  reviewCount?: number;
  
  // Preferences
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export type InterestCategory = 
  | 'nature' | 'culture' | 'gastronomy' | 'adventure' | 'wellness'
  | 'history' | 'art' | 'wine' | 'photography' | 'literature' 
  | 'marine' | 'hiking' | 'spirituality' | 'architecture';

export type BudgetRange = 
  | 'budget' | 'mid_range' | 'luxury' | 'ultra_luxury';

export type AccessibilityNeed = 
  | 'wheelchair' | 'mobility_aid' | 'visual_impairment' 
  | 'hearing_impairment' | 'dietary_restrictions';

export interface NotificationPreferences {
  email: {
    bookingConfirmation: boolean;
    experienceRecommendations: boolean;
    promotionalOffers: boolean;
    experienceUpdates: boolean;
    socialActivity: boolean;
  };
  push: {
    bookingReminders: boolean;
    lastMinuteDeals: boolean;
    weatherAlerts: boolean;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showRealName: boolean;
  shareBookingHistory: boolean;
  allowContactFromProviders: boolean;
}

// User Activity & History
export interface UserBooking {
  id: string;
  userId: string;
  experienceId: string;
  bookingDate: string;
  experienceDate: string;
  participants: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export type PaymentStatus = 
  | 'pending' | 'paid' | 'refunded' | 'failed';

export interface UserReview {
  id: string;
  userId: string;
  experienceId: string;
  bookingId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  photos?: string[];
  helpful: number; // count of helpful votes
  createdAt: string;
  verified: boolean; // confirmed booking
}

export interface UserWishlist {
  id: string;
  userId: string;
  experienceId: string;
  notes?: string;
  addedAt: string;
}

// Social Features
export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadgeEarned {
  userId: string;
  badgeId: string;
  earnedAt: string;
}

// Statistics & Analytics
export interface UserStats {
  userId: string;
  totalBookings: number;
  totalSpent: number;
  experiencesCreated: number;
  averageRating: number;
  favoriteCategories: InterestCategory[];
  visitedLocations: string[];
  memberSince: string;
  lastActivity: string;
}