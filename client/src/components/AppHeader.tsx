import { Button } from "@/components/ui/button";
import { Video, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  onLogout?: () => void;
  rightContent?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AppHeader({
  title,
  showLogo = true,
  onLogout,
  rightContent,
  breadcrumbs,
}: AppHeaderProps) {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Main Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            {showLogo && (
              <button
                onClick={() => setLocation("/")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Video className="h-6 sm:h-8 w-6 sm:w-8 text-pink-600" />
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Flayve
                </h1>
              </button>
            )}

            {/* Title (Mobile) */}
            {title && (
              <h2 className="text-lg font-semibold text-gray-900 md:hidden">
                {title}
              </h2>
            )}

            {/* Right Content */}
            <div className="flex items-center gap-2 sm:gap-4">
              {rightContent}
              {onLogout && (
                <Button onClick={onLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Sair</span>
                </Button>
              )}
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Title (Desktop) */}
          {title && (
            <h2 className="text-2xl font-semibold text-gray-900 mt-4 hidden md:block">
              {title}
            </h2>
          )}

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mt-3 text-sm text-gray-600">
              {breadcrumbs.map((crumb, index) => (
                <span key={index}>
                  {crumb.href ? (
                    <button
                      onClick={() => setLocation(crumb.href!)}
                      className="text-pink-600 hover:underline"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                </span>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b bg-white md:hidden">
          <div className="container mx-auto px-3 py-3 space-y-2">
            {/* Menu items will be added here by parent component */}
          </div>
        </div>
      )}
    </>
  );
}
