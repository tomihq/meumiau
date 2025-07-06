import { Heart } from 'lucide-react'
import React from 'react'
import WalkingCat from './walking-cat'

const Footer = () => {
  return (
   <footer className="relative z-10 border-t border-purple-500/20 bg-black/10 backdrop-blur-md">
        <WalkingCat />
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-gray-300 font-normal">
            {"Made with "} <Heart className="w-4 h-4 inline text-pink-400" /> {" and lots of ☕ by Tomás"}
          </p>
          <p className="text-sm text-gray-300 font-light mt-2">{`© ${new Date().getFullYear()} ✨`}</p>
        </div>
      </footer>
  )
}

export default Footer