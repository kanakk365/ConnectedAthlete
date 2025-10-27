"use client"

import Contacts from "./contacts"
import FileUploads from "./file-uploads"
import AdBanner from "./ad-banner"

export default function DashboardSection() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 h-full">
      <div className="lg:col-span-1">
        <Contacts />
      </div>
      <div className="lg:col-span-1">
        <FileUploads />
      </div>
      <div className="lg:col-span-1">
        <AdBanner />
      </div>
    </div>
  )
}
