import {
  Home,
  Inbox,
  BookOpen,
  ClipboardList,
  Users,
  Star,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react';

export type MenuItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Inbox', icon: Inbox, path: '/inbox' },
  { name: 'Lesson', icon: BookOpen, path: '/lesson' },
  { name: 'Task', icon: ClipboardList, path: '/task' },
  { name: 'Group', icon: Users, path: '/forum' },
  { name: 'Point', icon: Star, path: '/point' },
  { name: 'Game', icon: Gamepad2, path: '/game' },
];

