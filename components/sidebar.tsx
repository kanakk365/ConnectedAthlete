"use client";

import {
  Home,
  User,
  FileText,
  ComponentIcon as ImageIconComponent,
  Activity,
  Menu,
  Settings,
  HelpCircle,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: LucideIcon;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-background shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-muted-foreground" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] w-64 bg-background transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-border
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <Link
            href="/dashboard"
            className="h-16 px-6 flex items-center border-b border-border"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold hover:cursor-pointer text-foreground">
                Connected Athletes
              </span>
            </div>
          </Link>
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              <NavItem href="/dashboard" icon={Home}>
                Dashboard
              </NavItem>
              <NavItem href="/profile" icon={User}>
                Profile
              </NavItem>
              <NavItem href="/documents" icon={FileText}>
                Documents
              </NavItem>
              <NavItem href="/gallery" icon={ImageIconComponent}>
                Gallery
              </NavItem>
              <NavItem href="/sensors" icon={Activity}>
                Sensors
              </NavItem>
            </div>
          </div>
          <div className="px-4 py-4 border-t border-border">
            <div className="space-y-1">
              <NavItem href="/dashboard" icon={Settings}>
                Settings
              </NavItem>
              <NavItem href="/dashboard" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
