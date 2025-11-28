
import { Code } from 'lucide-react';
import React from 'react';
import NavLinks from './nav-links';

const Nav = () => {
  return (
    <div >
    <nav className="fixed w-full md:w-fit top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-md rounded-full border border-gray-500/30 px-3 md:px-6 py-3 max-w-[95vw] md:max-w-none overflow-x-auto">
      <div className="flex items-center gap-3 md:gap-6 min-w-max">
        <div className="flex items-center gap-2 mr-2 md:mr-4">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Code className="w-3 h-3 text-white" />
          </div>
          <span className="font-mono text-gray-300 text-sm hidden md:inline">{"~/tomas"}</span>
        </div>  
        <NavLinks />
        {/* <SocialButtons/> */}
      </div>
    </nav>

    </div>

  );
};

export default Nav;