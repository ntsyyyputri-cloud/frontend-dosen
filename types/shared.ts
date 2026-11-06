import { ReactNode } from "react";

export interface BreadcrumbProps {
  breadcrumbs?: string[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface MenuGroup {
  group: string;
  items: NavItem[];
}

