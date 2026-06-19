/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastCallback = (toast: Toast) => void;

class ToastManager {
  private listeners: Set<ToastCallback> = new Set();

  subscribe(callback: ToastCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  show(message: string, type: ToastType = 'info', duration = 3500) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, duration };
    this.listeners.forEach((listener) => listener(toast));
  }

  success(message: string, duration = 3500) {
    this.show(message, 'success', duration);
  }

  info(message: string, duration = 3500) {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 3500) {
    this.show(message, 'warning', duration);
  }

  error(message: string, duration = 3500) {
    this.show(message, 'error', duration);
  }
}

export const toast = new ToastManager();

if (typeof window !== 'undefined') {
  (window as any).showToast = (msg: string, type: ToastType = 'info') => {
    toast.show(msg, type);
  };
}
