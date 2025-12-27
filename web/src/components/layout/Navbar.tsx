"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';

const navItems = [
  { name: 'Insights', href: '/insights' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Asistente IA', href: '/assistant' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#111]/80 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Logo Cobre.svg"
            alt="Cobre Logo"
            width={135}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-white transition-colors flex items-center gap-1 ${pathname === item.href ? 'text-white' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="https://github.com/luisjbilgo/cobre-assessment" target="_blank" className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
            Ver Repo en Github
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-white">
          <Menu />
        </button>
      </div>
    </nav>
  );
}
