"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import useToast from "react-hook-toast";
import type { Link as LinkType, ProfileData } from "../../../lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Preview() {
  const { toast } = useToast();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
  });

  // In a real app, you would fetch this data from an API
  useEffect(() => {
    // Simulating data fetch
    const savedLinks = localStorage.getItem("links");
    const savedProfile = localStorage.getItem("profileData");

    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }

    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Your profile link has been copied to clipboard",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Link>
          <Button onClick={handleCopyLink}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Link
          </Button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="h-24 w-24 mb-4">
              {profileData.profilePicture ? (
                <AvatarImage
                  src={profileData.profilePicture}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                />
              ) : (
                <AvatarFallback>
                  {profileData.firstName && profileData.lastName
                    ? `${profileData.firstName[0]}${profileData.lastName[0]}`
                    : "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <h1 className="text-2xl font-bold text-center">
              {profileData.firstName} {profileData.lastName}
            </h1>
            {profileData.email && (
              <p className="text-muted-foreground text-center mt-1">
                {profileData.email}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-4 rounded-lg text-white ${getLinkStyle(
                  link.platform
                )}`}
              >
                {getLinkIcon(link.platform)}
                <span className="ml-3">{link.platform}</span>
              </a>
            ))}

            {links.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No links added yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function getLinkStyle(platform: string): string {
  const styles: Record<string, string> = {
    GitHub: "bg-black hover:bg-gray-800",
    Twitter: "bg-blue-400 hover:bg-blue-500",
    LinkedIn: "bg-blue-600 hover:bg-blue-700",
    YouTube: "bg-red-600 hover:bg-red-700",
    Facebook: "bg-blue-800 hover:bg-blue-900",
    Twitch: "bg-purple-600 hover:bg-purple-700",
    DevTo: "bg-black hover:bg-gray-800",
    CodePen: "bg-black hover:bg-gray-800",
    FreeCodeCamp: "bg-green-600 hover:bg-green-700",
    GitLab: "bg-orange-600 hover:bg-orange-700",
    Hashnode: "bg-blue-600 hover:bg-blue-700",
    StackOverflow: "bg-orange-500 hover:bg-orange-600",
    "Frontend Mentor": "bg-cyan-600 hover:bg-cyan-700",
  };

  return styles[platform] || "bg-gray-600 hover:bg-gray-700";
}

function getLinkIcon(platform: string) {
  // In a real app, you would use actual icons for each platform
  return (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white bg-opacity-20">
      {platform[0]}
    </div>
  );
}
