/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { 
  FolderClosed, 
  Search, 
  Blocks,
  Terminal,
  Github,
  Play
} from 'lucide-react';
import { ActivityView, VSCodeTheme } from '../../../shared/types';
import ActivityItem from './activity/ActivityItem';
import ProfileSection from './activity/ProfileSection';

interface ActivityBarProps {
  activeView: ActivityView;
  onViewChange: (view: ActivityView) => void;
  theme: VSCodeTheme;
  avatarUrl: string;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export default function ActivityBar({
  activeView,
  onViewChange,
  theme,
  avatarUrl,
  showSettings,
  setShowSettings
}: ActivityBarProps) {
  
  interface ActivityConfig {
    id: ActivityView;
    icon: React.ComponentType<any>;
    label: string;
    notification: string | null;
  }

  const activities: ActivityConfig[] = [
    { id: 'explorer', icon: FolderClosed, label: 'Explorer (Ctrl+Shift+E)', notification: null },
    { id: 'search', icon: Search, label: 'Search (Ctrl+Shift+F)', notification: null },
    { id: 'git', icon: Github, label: 'Source Control (Ctrl+Shift+G)', notification: null },
    { id: 'debug', icon: Play, label: 'Run and Debug (Ctrl+Shift+D)', notification: null },
    { id: 'extensions', icon: Blocks, label: 'Extensions (Ctrl+Shift+X)', notification: '4' },
    { id: 'cmd', icon: Terminal, label: 'Command Line & CLI Sandbox (Ctrl+Alt+C)', notification: null },
  ];

  return (
    <div
      className="w-12 flex flex-col justify-between items-center py-2 select-none border-r relative shrink-0"
      id="activity-bar-container"
      style={{
        backgroundColor: theme.id === 'dark-default' ? '#333333' : theme.activityBg,
        borderColor: theme.id === 'dark-default' ? '#1a1a1a' : `${theme.activeBorder}20`,
        color: theme.id === 'dark-default' ? '#cccccc' : theme.textColor
      }}
    >
      {/* Upper Section: Core Tabs */}
      <div className="flex flex-col items-center space-y-1 w-full" id="activity-icons-group">
        {activities.map((act) => (
          <ActivityItem
            key={act.id}
            id={act.id}
            icon={act.icon}
            label={act.label}
            notification={act.notification}
            isActive={activeView === act.id && !showSettings}
            theme={theme}
            onClick={() => {
              onViewChange(act.id);
              setShowSettings(false);
            }}
          />
        ))}
      </div>

      {/* Lower Section: User Profile & Configs */}
      <ProfileSection
        theme={theme}
        avatarUrl={avatarUrl}
        activeView={activeView}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        onViewChange={onViewChange}
      />
    </div>
  );
}
