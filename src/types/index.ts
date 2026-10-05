export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'business';
  credits: number;
  totalCreditsUsed: number;
  storageUsedBytes: number;
  createdAt: string;
}

export interface ImageItem {
  id: string;
  userId: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  originalUrl: string;
  processedUrl: string;
  status: 'completed' | 'processing' | 'failed';
  provider: string;
  processingTimeMs: number;
  createdAt: string;
}

export interface ProcessingJob {
  id: string;
  userId: string;
  imageId: string;
  filename: string;
  status: 'completed' | 'processing' | 'failed';
  provider: string;
  processingTimeMs: number;
  error?: string;
  startedAt: string;
  completedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  creditsMonthly: number;
  maxResolution: string;
  maxFileSizeMb: number;
  features: string[];
  popular?: boolean;
}

export interface ApiKeyItem {
  id: string;
  userId: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt: string | null;
  requestsCount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface UsageStats {
  creditsRemaining: number;
  creditsUsed: number;
  totalImages: number;
  storageUsedBytes: number;
  currentPlan: string;
  recentJobs: ProcessingJob[];
}

export interface EditorSettings {
  backgroundType: 'transparent' | 'color' | 'gradient' | 'image';
  backgroundColor: string;
  backgroundGradient: string;
  backgroundImageUrl: string;
  blurAmount: number; // 0 to 30px
  brightness: number; // 50 to 150 (100 = default)
  contrast: number; // 50 to 150 (100 = default)
  saturation: number; // 0 to 200 (100 = default)
  zoom: number; // 0.25 to 4 (1 = 100%)
  panX: number;
  panY: number;
  featherEdges: number; // 0 to 10
}
