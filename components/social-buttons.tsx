"use client"

import type React from "react"

import { Twitter, Github, Youtube, Twitch,Mail,  } from "lucide-react"
import Link from "next/link"

const SOCIAL_LINKS = [
  {
    name: "Twitter",
    href: "https://twitter.com/tomihq_",
    icon: Twitter,
    color: "hover:bg-blue-500/20 hover:text-blue-400",
  },
  
  {
    name: "GitHub",
    href: "https://github.com/tomihq",
    icon: Github,
    color: "hover:bg-gray-500/20 hover:text-gray-300",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@tomihq",
    icon: Youtube,
    color: "hover:bg-red-500/20 hover:text-red-400",
  },
  {
    name: "Twitch",
    href: "https://twitch.tv/ttomihq",
    icon: Twitch,
    color: "hover:bg-purple-600/20 hover:text-purple-400",
  },
  {
    name: "Email",
    href: "mailto:hernandeztomas584@gmail.com",
    icon: Mail,
    color: "hover:bg-green-500/20 hover:text-green-400",
  },
]

const SocialButtons: React.FC = () => {

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* Social Media Links */}
      {SOCIAL_LINKS.map((social) => {
        const IconComponent = social.icon
        return (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              p-2 rounded-full transition-all duration-300 
              text-white dark:text-gray-400
              hover:scale-110 hover:shadow-lg
              ${social.color}
              backdrop-blur-sm
            `}
            title={social.name}
          >
            <IconComponent size={16} />
          </Link>
        )
      })}

      
    </div>
  )
}

export default SocialButtons
