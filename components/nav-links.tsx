'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const SECTIONS = {
  home: { path: "/", description: "Home page - About Tomás" },
  skills: { path: "/skills", description: "Technical skills and technologies" },
  projects: { path: "/projects", description: "Current and featured projects" },
  /* notes: { path: "/notes", description: "Mathematical notes and thoughts" }, */
   blog: { path: "/blog", description: "Latest blog posts and articles" }, 
/*   contact: { path: "/contact", description: "Contact information and links" }, */
};

const NavLinks: React.FC = () => {
  const pathname = usePathname(); // Get the current path from the client-side router

  // Helper to get the path from the section name
  const getSectionPath = (sectionName: string) => {
    return SECTIONS[sectionName as keyof typeof SECTIONS]?.path || '/';
  };

  // Function to determine if a link is active
  const isActive = (href: string) => {
    // For the home page, both '/' and 'home' should make it active
    if (href === '/' && pathname === '/') {
      return true;
    }
    // For other sections, compare the href directly with the current pathname
    return href === pathname;
  };

  const getLinkClasses = (href: string) => {
    const baseClasses = "font-mono text-xs px-2 md:px-3 py-1 rounded-full transition-all duration-300 whitespace-nowrap";
    const activeClasses = "text-white bg-purple-500/50 shadow-lg shadow-purple-500/25";
    const inactiveClasses = "text-gray-400 hover:text-purple-300 hover:bg-purple-500/10";

    return `${baseClasses} ${isActive(href) ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex items-center gap-3 md:gap-6 min-w-max">
      <Link href="/" className={getLinkClasses("/")}>
        home
      </Link>
      <Link href="/skills" className={getLinkClasses("/skills")}>
        skills
      </Link>
      <Link href="/projects" className={getLinkClasses("/projects")}>
        projects
      </Link>
     {/*  <Link href="/notes" className={getLinkClasses("/notes")}>
        notes
      </Link>*/}
      <Link href="/blog" className={getLinkClasses("/blog")}>
        blog
      </Link> 
      {/* <Link href="/contact" className={getLinkClasses("/contact")}>
        contact
      </Link> */}
    </div>
  );
};

export default NavLinks;