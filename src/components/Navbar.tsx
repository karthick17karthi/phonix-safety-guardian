
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, User, Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NavLink: React.FC<{ to: string; children: React.ReactNode; currentPath: string }> = ({ to, children, currentPath }) => {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "bg-phoenix-teal text-white" 
          : "text-phoenix-blue hover:bg-phoenix-lightblue/20"
      )}
    >
      {children}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Safety Tools', path: '/safety' },
    { name: 'Contacts', path: '/contacts' },
    { name: 'Safe Routes', path: '/routes' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-phoenix-red" />
              <span className="ml-2 text-lg font-bold text-phoenix-blue">Phoenix Guardian</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.name} to={item.path} currentPath={location.pathname}>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-phoenix-blue">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-phoenix-blue">
              <User size={20} />
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} size="icon">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === item.path
                    ? "bg-phoenix-teal text-white"
                    : "text-phoenix-blue hover:bg-phoenix-lightblue/20"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex justify-around pt-4 border-t mt-4">
              <Button variant="ghost" size="icon" className="text-phoenix-blue">
                <Bell size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-phoenix-blue">
                <User size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
