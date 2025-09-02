'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Database, FlaskConical, Settings, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Datasets', href: '/datasets', icon: Database },
  { name: 'Experiments', href: '/experiments', icon: FlaskConical },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm transition-all duration-300',
        isScrolled ? 'bg-background/95 shadow-sm' : 'border-transparent',
        'supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
            aria-label="Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <FlaskConical className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              ML Playground
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    'group relative after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-primary after:transition-all after:duration-200',
                    isActive 
                      ? 'text-foreground after:w-4/5' 
                      : 'text-muted-foreground hover:text-foreground hover:after:w-4/5',
                    'hover:bg-accent/50'
                  )}
                >
                  <item.icon className={cn(
                    'mr-2 h-4 w-4 transition-transform duration-200',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          
          <button 
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
          mobileMenuOpen ? 'max-h-96 border-t' : 'max-h-0'
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="px-2 pt-2 pb-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors',
                  'group hover:bg-accent/50',
                  isActive
                    ? 'bg-accent text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )} />
                {item.name}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
