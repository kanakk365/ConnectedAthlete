"use client";

import type React from "react";
import type { LucideIcon } from "lucide-react";

import {
  Home,
  User,
  FileText,
  ComponentIcon as ImageIconComponent,
  Activity,
  Menu,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    children,
    isActive = false,
  }: {
    href: string;
    icon: LucideIcon;
    children: React.ReactNode;
    isActive?: boolean;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          isActive
            ? "bg-[#9161ff] text-black"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <Icon className="h-4 w-4 mr-3 shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-70 p-2 rounded-lg bg-background shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-muted-foreground" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-70 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-sidebar-foreground">
                Connected Athletes
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4 scrollbar-thin">
            <div className="space-y-2">
              <NavItem href="/dashboard" icon={Home} isActive>
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
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-65 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
