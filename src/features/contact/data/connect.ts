/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { VFSNode } from '@/types';
import { PROFILE_DATA, SocialLink, ProfileData } from '@/features/about';
import { ExtractedSocialInfo, BrandingInfo } from '../types/contact.types';

// ─── Data Extractors ───────────────────────────────────────────

/**
 * Extract username from a SocialLink array
 */
const extractUsername = (links: SocialLink[], fallback: string): string => {
  if (!links?.length) return fallback;
  
  const primary = links[0]!;
  
  // Use handle if available
  if (primary.handle) {
    return primary.handle.replace(/^@/, '');
  }
  
  // Try extracting from URL
  if (primary.url) {
    const parts = primary.url.replace(/\/$/, '').split('/');
    const last = parts.pop();
    if (last) return last.replace(/^@/, '');
  }
  
  return fallback;
};

/**
 * Extract first URL from a SocialLink array
 */
const extractUrl = (links: SocialLink[], fallback: string): string => {
  if (!links?.length) return fallback;
  return links[0]!.url || fallback;
};

/**
 * Extract email local part (before @)
 */
const extractEmailLocal = (email: string): string => {
  return email.split('@')[0] ?? email;
};

/**
 * Dynamic platform captions based on profile data
 */
const getPlatformCaption = (platform: string, identifier: string): string => {
  const captions: Record<string, string> = {
    github: `Explore open-source repositories, research code, and automated systems by ${identifier}.`,
    linkedin: `Professional profile, publications, and networking updates for ${identifier}.`,
    twitter: `Technical thoughts, AI insights, and development logs from ${identifier}.`,
    instagram: `Visual updates and behind-the-scenes content from ${identifier}.`,
    facebook: `Connect with ${identifier} on Facebook for updates and announcements.`,
    email: `Send inquiries, proposals, or collaboration requests directly to ${identifier}.`,
  };
  return captions[platform] ?? `Connect with ${identifier} on ${platform}.`;
};

/**
 * Dynamic platform tags based on profile focus areas
 */
const getPlatformTags = (platform: string): string[] => {
  const profile = PROFILE_DATA;
  
  const baseTags: Record<string, string[]> = {
    github: ['Open Source', 'Research Code', ...profile.focus.slice(0, 2)],
    linkedin: ['Professional Feed', 'Career Updates', ...profile.roles.slice(0, 1)],
    twitter: ['Tech Thoughts', 'AI Insights', ...profile.researchAreas.slice(0, 1)],
    instagram: ['Behind the Scenes', 'Developer Life'],
    facebook: ['Updates', 'Community'],
    email: ['Direct Contact', 'Fast Response'],
  };
  
  return baseTags[platform] ?? ['Connect'];
};

/**
 * Dynamic platform stats based on profile data
 */
const getPlatformStats = (platform: string, identifier: string): string => {
  const stats: Record<string, string> = {
    github: `${PROFILE_DATA.projects?.length ?? 0}+ repos`,
    linkedin: 'Active profile',
    twitter: 'Regular updates',
    instagram: 'Active',
    facebook: 'Connected',
    email: `Replies within 24hr`,
  };
  return stats[platform] ?? 'Active';
};

/**
 * Build social channel info dynamically from profile data
 */
const buildSocialChannels = (profile: ProfileData): ExtractedSocialInfo[] => {
  const channels: ExtractedSocialInfo[] = [];
  
  // GitHub
  if (profile.github?.length) {
    const username = extractUsername(profile.github, 'SanjibBayen');
    const url = extractUrl(profile.github, `https://github.com/${username}`);
    channels.push({
      platform: 'GitHub',
      username,
      url,
      icon: 'Github',
      caption: getPlatformCaption('github', username),
      tags: getPlatformTags('github'),
      stats: getPlatformStats('github', username),
    });
  }
  
  // LinkedIn
  if (profile.linkedin?.length) {
    const username = extractUsername(profile.linkedin, 'sanjibbayen');
    const url = extractUrl(profile.linkedin, `https://linkedin.com/in/${username}`);
    channels.push({
      platform: 'LinkedIn',
      username,
      url,
      icon: 'Linkedin',
      caption: getPlatformCaption('linkedin', username),
      tags: getPlatformTags('linkedin'),
      stats: getPlatformStats('linkedin', username),
    });
  }
  
  // Twitter/X
  if (profile.twitter?.length) {
    const username = extractUsername(profile.twitter, 'sanjibbayen');
    const handle = username.startsWith('@') ? username : `@${username}`;
    const url = extractUrl(profile.twitter, `https://x.com/${username.replace('@', '')}`);
    channels.push({
      platform: 'Twitter / X',
      username: handle,
      url,
      icon: 'Twitter',
      caption: getPlatformCaption('twitter', handle),
      tags: getPlatformTags('twitter'),
      stats: getPlatformStats('twitter', handle),
    });
  }
  
  // Instagram
  if (profile.instagram?.length) {
    const username = extractUsername(profile.instagram, 'bayen04x');
    const url = extractUrl(profile.instagram, `https://instagram.com/${username}`);
    channels.push({
      platform: 'Instagram',
      username,
      url,
      icon: 'Instagram',
      caption: getPlatformCaption('instagram', username),
      tags: getPlatformTags('instagram'),
      stats: getPlatformStats('instagram', username),
    });
  }
  
  // Facebook
  if (profile.facebook?.length) {
    const username = extractUsername(profile.facebook, 'sanjib.bayen');
    const url = extractUrl(profile.facebook, `https://facebook.com/${username}`);
    channels.push({
      platform: 'Facebook',
      username,
      url,
      icon: 'Facebook',
      caption: getPlatformCaption('facebook', username),
      tags: getPlatformTags('facebook'),
      stats: getPlatformStats('facebook', username),
    });
  }
  
  // Email (always present)
  if (profile.email) {
    channels.push({
      platform: 'Direct Email',
      username: extractEmailLocal(profile.email),
      url: `mailto:${profile.email}`,
      icon: 'Mail',
      caption: getPlatformCaption('email', profile.email),
      tags: getPlatformTags('email'),
      stats: getPlatformStats('email', profile.email),
    });
  }
  
  return channels;
};

/**
 * Build branding info from profile data
 */
const buildBrandingInfo = (profile: ProfileData): BrandingInfo => {
  return {
    name: profile.name,
    tagline: profile.roles?.[0] 
      ? `${profile.roles[0]} | ${profile.roles[1] ?? profile.focus?.[0] ?? 'Engineer'}`
      : 'Software Engineer',
    location: profile.location,
    timezone: 'GMT+5:30 (IST)',
  };
};

// ─── Content Generators ────────────────────────────────────────

/**
 * Generate API.tsx content dynamically from profile data
 */
const generateApiTsxContent = (): string => {
  const profile = PROFILE_DATA;
  const socialChannels = buildSocialChannels(profile);
  
  // Build social endpoints object
  const socialEndpoints = socialChannels
    .filter(ch => ch.platform !== 'Direct Email')
    .map(ch => {
      const key = ch.platform.toLowerCase().replace(/[^a-z]/g, '');
      return `  ${key}: "${ch.url}",`;
    })
    .join('\n');
  
  const emailEndpoint = socialChannels.find(ch => ch.platform === 'Direct Email');
  
  return `/**
 * @name CONTACT_API
 * @description React-enabled REST API client for ${profile.name}
 * @generated Dynamically from profile data
 * @license Apache-2.0
 */

import React, { useState, useCallback, type FormEvent } from 'react';

// ─── Types ────────────────────────────────────────────────────

export interface ContactDataPayload {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  preferredContact?: 'email' | 'phone';
}

export type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

export interface APIResponse {
  success: boolean;
  message: string;
  data?: {
    ticketId: string;
    estimatedResponse: string;
  };
}

// ─── Constants ─────────────────────────────────────────────────

export const PROFILE_INFO = {
  name: "${profile.name}",
  email: "${profile.email}",
  location: "${profile.location}",
  roles: [${profile.roles.map(r => `"${r}"`).join(', ')}],
  focus: [${profile.focus.map(f => `"${f}"`).join(', ')}],
} as const;

export const API_ENDPOINT = "/api/v1/contact";

function getCsrfToken(): string {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf_token') return value || '';
    }
  } catch (err) {
    console.warn("Could not read CSRF cookie:", err);
  }
  return '';
}

export const SOCIAL_ENDPOINTS = {
${socialEndpoints}
  email: "${emailEndpoint?.url ?? `mailto:${profile.email}`}",
} as const;

export const REQUEST_CONFIG = {
  maxRetries: 3,
  timeoutMs: 10000,
  rateLimitMs: 60000,
} as const;

// ─── Validation ────────────────────────────────────────────────

interface ValidationErrors {
  senderName?: string;
  senderEmail?: string;
  message?: string;
}

const validateForm = (data: ContactDataPayload): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!data.senderName.trim()) {
    errors.senderName = 'Name is required';
  }
  
  if (!data.senderEmail.trim()) {
    errors.senderEmail = 'Email is required';
  } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.senderEmail)) {
    errors.senderEmail = 'Invalid email format';
  }
  
  if (!data.message.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return errors;
};

// ─── Hook ──────────────────────────────────────────────────────

interface UseContactFormReturn {
  formData: ContactDataPayload;
  status: SubmissionStatus;
  errors: ValidationErrors;
  errorMessage: string | null;
  updateField: <K extends keyof ContactDataPayload>(
    field: K, 
    value: ContactDataPayload[K]
  ) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  resetForm: () => void;
}

const INITIAL_FORM_DATA: ContactDataPayload = {
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  subject: '',
  message: '',
};

export function useContactForm(): UseContactFormReturn {
  const [formData, setFormData] = useState<ContactDataPayload>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof ContactDataPayload>(
    field: K,
    value: ContactDataPayload[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    if (status === 'error') setStatus('idle');
  }, [status]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('sending');
    setErrorMessage(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_CONFIG.timeoutMs);

      const csrfToken = getCsrfToken();

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Client-Version': '1.0.0',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          ...formData,
          csrfToken,
          timestamp: new Date().toISOString(),
          source: 'portfolio-website',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      const data = await response.json() as APIResponse;
      setStatus('success');
      
      if (data.data?.ticketId) {
        console.log(\`Ticket created: \${data.data.ticketId}\`);
      }
    } catch (error) {
      setStatus('error');
      if (error instanceof DOMException && error.name === 'AbortError') {
        setErrorMessage('Request timed out. Please try again.');
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
      }
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setStatus('idle');
    setErrors({});
    setErrorMessage(null);
  }, []);

  return {
    formData,
    status,
    errors,
    errorMessage,
    updateField,
    handleSubmit,
    resetForm,
  };
}

// ─── Component ─────────────────────────────────────────────────

interface ContactAPIControllerProps {
  className?: string;
  onSuccess?: () => void;
}

export default function ContactAPIController({ 
  className = '', 
  onSuccess 
}: ContactAPIControllerProps) {
  const {
    formData,
    status,
    errors,
    errorMessage,
    updateField,
    handleSubmit,
    resetForm,
  } = useContactForm();

  React.useEffect(() => {
    if (status === 'success' && onSuccess) {
      onSuccess();
    }
  }, [status, onSuccess]);

  const inputClass = (field: keyof ValidationErrors) => 
    \`w-full px-3 py-2 bg-zinc-800 border rounded text-sm transition-colors \${
      errors[field] ? 'border-red-500' : 'border-zinc-600 focus:border-sky-500'
    } outline-none\`;

  return (
    <div className={\`p-4 border rounded bg-zinc-900 border-zinc-700 text-zinc-100 \${className}\`}>
      <h3 className="text-lg font-bold">Contact Gateway Endpoint Client</h3>
      <p className="text-xs text-zinc-400 font-mono mt-1">POST {API_ENDPOINT}</p>
      
      <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
        <div>
          <input
            type="text"
            placeholder="Your Name *"
            value={formData.senderName}
            onChange={(e) => updateField('senderName', e.target.value)}
            className={inputClass('senderName')}
          />
          {errors.senderName && (
            <p className="text-red-400 text-xs mt-1">{errors.senderName}</p>
          )}
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Your Email *"
            value={formData.senderEmail}
            onChange={(e) => updateField('senderEmail', e.target.value)}
            className={inputClass('senderEmail')}
          />
          {errors.senderEmail && (
            <p className="text-red-400 text-xs mt-1">{errors.senderEmail}</p>
          )}
        </div>
        
        <input
          type="text"
          placeholder="Phone (optional)"
          value={formData.senderPhone ?? ''}
          onChange={(e) => updateField('senderPhone', e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-sm outline-none focus:border-sky-500 transition-colors"
        />
        
        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-sm outline-none focus:border-sky-500 transition-colors"
        />
        
        <div>
          <textarea
            placeholder="Your Message *"
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            rows={4}
            className={inputClass('message') + ' resize-y'}
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1">{errors.message}</p>
          )}
        </div>
        
        {errorMessage && (
          <p className="text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-800/30">
            {errorMessage}
          </p>
        )}
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={status === 'sending'}
            className={\`px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed \${
              status === 'success'
                ? 'bg-emerald-600 text-white'
                : status === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }\`}
          >
            {status === 'sending' ? 'Sending...' : 
             status === 'success' ? '✓ Sent Successfully!' : 
             'Send Message'}
          </button>
          
          {status === 'success' && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
            >
              Send Another Message
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
`;
};

/**
 * Generate links.yml content dynamically from profile data
 */
const generateLinksYmlContent = (): string => {
  const profile = PROFILE_DATA;
  const branding = buildBrandingInfo(profile);
  const channels = buildSocialChannels(profile);
  
  const lines: string[] = [
    '# ====================================================================',
    `# ${branding.name.toUpperCase()} - SOCIAL CONNECTIONS`,
    '# Auto-generated from profile data',
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    '# ====================================================================',
    '',
    'branding_identity:',
    `  name: "${branding.name}"`,
    `  tagline: "${branding.tagline}"`,
    `  city: "${branding.location}"`,
    `  timezone: "${branding.timezone}"`,
    '',
    'social_channels:',
    '',
  ];
  
  // Add each social channel
  for (const channel of channels) {
    const yamlEntry = [
      `  - platform: "${channel.platform}"`,
      `    username: "${channel.username}"`,
      `    icon: "${channel.icon}"`,
      `    url: "${channel.url}"`,
      `    caption: "${channel.caption}"`,
      `    tags: [${channel.tags.map(t => `"${t}"`).join(', ')}]`,
      `    stats: "${channel.stats}"`,
    ].join('\n');
    
    lines.push(yamlEntry);
    lines.push('');
  }
  
  return lines.join('\n');
};

// ─── VFS Node Export ───────────────────────────────────────────

export const connectFolder: VFSNode = {
  name: "connect",
  type: "folder",
  path: "connect",
  children: [
    {
      name: "api.tsx",
      type: "file",
      path: "connect/api.tsx",
      language: "typescriptreact",
      content: generateApiTsxContent(),
    },
    {
      name: "links.yml",
      type: "file",
      path: "connect/links.yml",
      language: "yaml",
      content: generateLinksYmlContent(),
    },
  ],
};
