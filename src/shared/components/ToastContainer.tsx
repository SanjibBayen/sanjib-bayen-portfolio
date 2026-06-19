/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  AlertCircle 
} from 'lucide-react';
import { toast, Toast } from '@/shared/utils/toast';
import { VSCodeTheme } from '@/types';

interface ToastContainerProps {
  theme: VSCodeTheme;
}

export default function ToastContainer({ theme }: ToastContainerProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      const duration = newToast.duration || 3500;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, duration);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-450 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-10 right-4 z-[9999] flex flex-col space-y-2 max-w-sm w-full font-sans select-none pointer-events-none">
      <AnimatePresence>
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.15 }}
            className={`pointer-events-auto p-3.5 rounded-lg border flex items-start gap-3 shadow-2xl transition duration-150 backdrop-blur-md`}
            style={{
              backgroundColor: `${theme.panelBg}f2` || '#1e1f29f2',
              borderColor: theme.activeBorder ? `${theme.activeBorder}40` : '#333',
              color: theme.textColor || '#fff'
            }}
          >
            {getIcon(item.type)}
            
            <div className="flex-1 text-left">
              <p className="text-[11.5px] leading-relaxed font-semibold font-sans">
                {item.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="p-1 hover:bg-white/10 rounded transition text-slate-400 hover:text-white cursor-pointer inline-flex"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
