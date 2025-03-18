"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileData } from "../lib/types";
import useToast from "react-hook-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface ProfileFormProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

export default function ProfileForm({
  profileData,
  setProfileData,
}: ProfileFormProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  }>({});

  useEffect(() => {
    // Save profile data to localStorage whenever it changes
    localStorage.setItem("profileData", JSON.stringify(profileData));
  }, [profileData]);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData({ ...profileData, [field]: value });

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For this demo, we'll use a local URL
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({
          ...profileData,
          profilePicture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
    } = {};
    let hasErrors = false;

    if (!profileData.firstName.trim()) {
      newErrors.firstName = "Can't be empty";
      hasErrors = true;
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Can't be empty";
      hasErrors = true;
    }

    if (profileData.email && !isValidEmail(profileData.email)) {
      newErrors.email = "Please check the email format";
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSave = () => {
    if (validateForm()) {
      toast({
        title: "Changes saved",
        // description: "Your profile has been updated successfully",
      });
      window.alert("Profile details saved");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>
          Add your details to create a personal touch to your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-medium">Profile picture</h3>
              <p className="text-sm text-muted-foreground">
                Recommended: 300x300px JPG, PNG, or GIF.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer group"
                onClick={handleProfilePictureClick}
              >
                <Avatar className="h-16 w-16">
                  {profileData.profilePicture ? (
                    <AvatarImage
                      src={profileData.profilePicture}
                      alt="Profile"
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-200">
                      <Camera className="h-6 w-6 text-gray-500" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleProfilePictureClick}
                className="hover:cursor-pointer"
              >
                Change Image
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name*</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name*</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end ">
            <Button className="hover:cursor-pointer" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
