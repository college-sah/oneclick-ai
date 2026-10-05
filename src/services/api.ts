import { ImageItem, Plan, ProcessingJob, UsageStats, User, ApiKeyItem, ContactMessage } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('oneclickbg_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // -------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------
  async register(name: string, email: string, password: string): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(email: string, password?: string): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },

  // -------------------------------------------------------------
  // User Profile
  // -------------------------------------------------------------
  async getProfile(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User; message: string }> {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update profile' }));
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },

  // -------------------------------------------------------------
  // Images & AI Background Removal
  // -------------------------------------------------------------
  async getImages(): Promise<{ images: ImageItem[] }> {
    const res = await fetch(`${API_BASE}/images`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load images');
    return res.json();
  },

  async getImage(id: string): Promise<{ image: ImageItem }> {
    const res = await fetch(`${API_BASE}/images/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Image not found');
    return res.json();
  },

  async deleteImage(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/images/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete image');
    return res.json();
  },

  async uploadImage(payload: {
    filename: string;
    mimeType: string;
    size: number;
    base64Data: string;
    width: number;
    height: number;
  }): Promise<{ image: ImageItem }> {
    const res = await fetch(`${API_BASE}/images/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  async removeBackground(payload: {
    imageId?: string;
    base64Data?: string;
    filename?: string;
    mimeType?: string;
    width?: number;
    height?: number;
  }): Promise<{
    success: boolean;
    image: ImageItem;
    job: ProcessingJob;
    remainingCredits: number;
    processingTimeMs: number;
    provider: string;
  }> {
    const res = await fetch(`${API_BASE}/images/remove-background`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Background removal failed' }));
      throw new Error(err.error || 'Background removal failed');
    }
    return res.json();
  },

  // -------------------------------------------------------------
  // Usage & Subscription Plans
  // -------------------------------------------------------------
  async getUsage(): Promise<UsageStats> {
    const res = await fetch(`${API_BASE}/usage`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch usage stats');
    return res.json();
  },

  async getPlans(): Promise<{ plans: Plan[] }> {
    const res = await fetch(`${API_BASE}/plans`);
    if (!res.ok) throw new Error('Failed to fetch plans');
    return res.json();
  },

  async createSubscription(planId: string): Promise<{ success: boolean; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/subscription/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ planId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update subscription' }));
      throw new Error(err.error || 'Failed to update subscription');
    }
    return res.json();
  },

  async cancelSubscription(): Promise<{ success: boolean; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/subscription/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to cancel subscription');
    return res.json();
  },

  // -------------------------------------------------------------
  // API Keys
  // -------------------------------------------------------------
  async getApiKeys(): Promise<{ keys: ApiKeyItem[] }> {
    const res = await fetch(`${API_BASE}/api-keys`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch API keys');
    return res.json();
  },

  async createApiKey(name: string): Promise<{ key: ApiKeyItem; message: string }> {
    const res = await fetch(`${API_BASE}/api-keys`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create API key' }));
      throw new Error(err.error || 'Failed to create API key');
    }
    return res.json();
  },

  async deleteApiKey(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/api-keys/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete API key');
    return res.json();
  },

  // -------------------------------------------------------------
  // Contact
  // -------------------------------------------------------------
  async sendContactMessage(payload: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to send message' }));
      throw new Error(err.error || 'Failed to send message');
    }
    return res.json();
  },

  // -------------------------------------------------------------
  // Admin
  // -------------------------------------------------------------
  async getAdminOverview(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Admin access required');
    return res.json();
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Admin access required');
    return res.json();
  },

  async getAdminJobs(): Promise<{ jobs: ProcessingJob[] }> {
    const res = await fetch(`${API_BASE}/admin/jobs`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Admin access required');
    return res.json();
  },

  async getAdminContactMessages(): Promise<{ messages: ContactMessage[] }> {
    const res = await fetch(`${API_BASE}/admin/contact-messages`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Admin access required');
    return res.json();
  },
};
