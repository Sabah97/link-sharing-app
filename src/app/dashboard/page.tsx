"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LinkIcon, User, Eye, Share2 } from "lucide-react";
import LinksForm from "../../../components/link-form";
import ProfileForm from "../../../components/profile-form";
import MobilePreview from "../../../components/mobile-preview";
import type { Link as LinkType } from "../../../lib/types";
import type { ProfileData } from "../../../lib/types";
import useToast from "react-hook-toast";

export default function Dashboard() {
  const toast = useToast();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
  });
  const [activeTab, setActiveTab] = useState("links");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/profile/${profileData.firstName}-${profileData.lastName}`.toLowerCase()
    );
    toast({
      title: "Link copied!",
      // message: "Your profile link has been copied to clipboard",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">ShareAble</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open(`/preview`, "_blank")}
              className="hidden hover:cursor-pointer sm:flex"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="hidden sm:flex hover:cursor-pointer"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="links"
                className="flex items-center hover:cursor-pointer"
              >
                <LinkIcon className="mr-2 h-4 w-4  " />
                Links
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex items-center  hover:cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Profile Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="links" className="mt-6">
              <LinksForm links={links} setLinks={setLinks} />
            </TabsContent>
            <TabsContent value="profile" className="mt-6">
              <ProfileForm
                profileData={profileData}
                setProfileData={setProfileData}
              />
            </TabsContent>
          </Tabs>
          <div className="hidden lg:block">
            <MobilePreview links={links} profileData={profileData} />
          </div>
        </div>
      </main>
    </div>
  );
}
