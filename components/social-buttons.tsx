"use client"

import type React from "react"

import {  Github, Linkedin, Mail,  } from "lucide-react"
import Link from "next/link"

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/tomihq",
    icon: Linkedin,
    color: "hover:bg-blue-500/20 hover:text-gray-300",
  },
  {
    name: "GitHub",
    href: "https://github.com/tomihq",
    icon: Github,
    color: "hover:bg-gray-500/20 hover:text-gray-300",
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
