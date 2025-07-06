"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, MessageSquare, Lightbulb, Users, ArrowRight } from "lucide-react"

interface PrivateRepoModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    title: string
    description: string
    tags: string[]
  } | null
}

export default function PrivateRepoModal({ isOpen, onClose, project }: PrivateRepoModalProps) {
  if (!project) return null

  const handleDiscussProject = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <Lock className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">Private Repository</DialogTitle>
              <DialogDescription className="text-gray-300">{project.title}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                {tag}
              </Badge>
            ))}
          </div>

          {/* What I Can Share */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              What I Can Discuss
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Project concepts and innovative ideas</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Market solutions and industry applications</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Technical approaches and methodologies</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>How to build similar solutions for your needs</span>
              </li>
            </ul>
          </div>

          {/* Custom Solutions */}
          <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Custom Solutions Available
            </h4>
            <p className="text-sm text-gray-300">
              I can create similar AI solutions tailored to your specific requirements and modify them according to your
              business needs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleDiscussProject} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
              <MessageSquare className="mr-2 h-4 w-4" />
              Discuss Project Ideas
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
