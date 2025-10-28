"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ImageIcon,
  Download,
  Upload,
} from "lucide-react";

interface FileUpload {
  id: string;
  name: string;
  type: "medical" | "photo" | "document";
  size: string;
  uploadedBy: string;
  timestamp: string;
  url: string;
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
];

export default function FileUploads() {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <FileText className="w-4 h-4 text-destructive" />;
      case "photo":
        return <ImageIcon className="w-4 h-4 text-primary" />;
      case "document":
        return <FileText className="w-4 h-4 text-chart-2" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };


  return (
    <Card className="bg-card border-border h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Recent Uploads
          </CardTitle>
          <Button  className="text-sm py-0 cursor-pointer ">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className=" flex-1 overflow-y-auto scrollbar-thin divide-y divide-border ">
          {recentUploads.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3  transition-colors"
            >
              <div className="shrink-0">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {file.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="mt-4 pt-4 border-t border-border">
          <Button className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload New File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
