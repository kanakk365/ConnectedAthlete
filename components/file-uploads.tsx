"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Download, Eye, Upload, Clock } from "lucide-react"

interface FileUpload {
  id: string
  name: string
  type: "medical" | "photo" | "document"
  size: string
  uploadedBy: string
  timestamp: string
  url: string
}

const recentUploads: FileUpload[] = [
  {
    id: "1",
    name: "Blood_Test_Results_Jan2024.pdf",
    type: "medical",
    size: "2.4 MB",
    uploadedBy: "Dr. Sarah Wilson",
    timestamp: "2 hours ago",
    url: "#",
  },
  {
    id: "2",
    name: "Training_Session_Photos.zip",
    type: "photo",
    size: "15.8 MB",
    uploadedBy: "Coach Martinez",
    timestamp: "5 hours ago",
    url: "#",
  },
  {
    id: "3",
    name: "Nutrition_Plan_Updated.pdf",
    type: "document",
    size: "1.2 MB",
    uploadedBy: "Nutritionist Jane",
    timestamp: "1 day ago",
    url: "#",
  },
  {
    id: "4",
    name: "MRI_Scan_Results.pdf",
    type: "medical",
    size: "8.5 MB",
    uploadedBy: "Dr. Sarah Wilson",
    timestamp: "2 days ago",
    url: "#",
  },
]

export default function FileUploads() {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <FileText className="w-4 h-4 text-red-500" />
      case "photo":
        return <ImageIcon className="w-4 h-4 text-blue-500" />
      case "document":
        return <FileText className="w-4 h-4 text-green-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "medical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "photo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "document":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            Recent Uploads
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentUploads.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#1F1F23] hover:bg-gray-100 dark:hover:bg-[#2A2A2E] transition-colors"
            >
              <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(file.type)}`}>{file.type}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>by {file.uploadedBy}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {file.timestamp}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#1F1F23]">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload New File
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
