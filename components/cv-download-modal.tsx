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
import { FileText, Download, DownloadIcon } from "lucide-react"

const languages = [
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    file: "/assets/cv/hernandez-tomas-es-version.pdf",
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    file: "/assets/cv/hernandez-tomas-eng-version.pdf",
  }
]

export function CVDownloadModal() {
  const [open, setOpen] = useState(false)

  const handleDownload = (file: string) => {
    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement("a")
    link.href = file
    link.download = file.split("/").pop() || "cv.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border border-purple-400 rounded-full hover:border-purple-500 transition-all drop-shadow-sm py-3 px-4 text-sm flex flex-row gap-2 items-center justify-center w-fit bg-transparent hover:bg-transparent">
        <DownloadIcon size={14} />
        Download Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md  bg-gradient-to-bl from-purple-700 via-purple-900 to-purple-950 border-none rounded-xl sm:rounded-xl brightness-95">
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
            <Button
              key={language.code}
              variant="outline"
              className="w-full justify-start h-14 text-lg font-medium border-2 border-purple-500 hover:border-purple-700 hover:bg-purple-800 hover:text-white  transition-all duration-200 bg-transparent"
              onClick={() => handleDownload(language.file)}
            >
              <span className="text-2xl mr-4">{language.flag}</span>
              <span className="flex-1 text-left">{language.name}</span>
              <Download className="w-5 h-5 ml-2 text-gray-400" />
            </Button>
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
