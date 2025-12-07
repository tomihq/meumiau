"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExternalLink, DownloadIcon } from "lucide-react"
import Link from "next/link"

const languages = [
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    file: "https://drive.google.com/file/d/1Nw1o5nLJWV8AvvxMFE3D1MhIhzRNwJK-/preview",
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    file: "https://drive.google.com/file/d/1C1-V58xjaLn22-ZzzvzSU-6EuAl4yBJ8/preview",
  }
]

export function CVDownloadModal() {
  const [open, setOpen] = useState(false)


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border border-gray-400 rounded-full hover:border-gray-500 transition-all drop-shadow-sm py-3 px-4 text-sm flex flex-row gap-2 items-center justify-center w-fit bg-transparent hover:bg-transparent">
        <DownloadIcon size={14} />
        Download Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md  bg-gradient-to-bl from-gray-700 via-gray-800 to-gray-900 border-none rounded-xl sm:rounded-xl brightness-95">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-white ">
          Select a language
                    </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
          Choose the language in which you'd like to download my resume.
</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {languages.map((language) => (
            <Link
              key={language.code}
              className="flex flex-row  items-center p-4 w-full justify-start h-14 text-lg font-medium border-2 border-gray-500 hover:border-gray-700 hover:bg-gray-800 hover:text-white  transition-all duration-200 bg-transparent"
              href={language.file}
              target="_blank"
            >
              <span className="text-2xl mr-4">{language.flag}</span>
              <span className="flex-1 text-left">{language.name}</span>
              <ExternalLink className="w-5 h-5 ml-2 text-gray-400" />
            </Link>
          ))}
        </div>
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-white hover:bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
