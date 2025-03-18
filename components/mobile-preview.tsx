import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Link, ProfileData } from "../lib/types";

interface MobilePreviewProps {
  links: Link[];
  profileData: ProfileData;
}

export default function MobilePreview({
  links,
  profileData,
}: MobilePreviewProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4">
        <h3 className="font-medium">Preview</h3>
      </div>

      <div className="w-[270px] h-[580px] bg-white rounded-[30px] border-8 border-gray-900 overflow-hidden shadow-xl relative">
        {/* Phone notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-5 bg-gray-900 rounded-b-lg z-10"></div>

        {/* Phone content */}
        <div className="h-full overflow-y-auto bg-gray-50 pt-12 px-4">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-20 w-20 mb-4">
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
            <h2 className="text-lg font-bold text-center">
              {profileData.firstName || "First"}{" "}
              {profileData.lastName || "Last"}
            </h2>
            {profileData.email && (
              <p className="text-sm text-muted-foreground text-center mt-1">
                {profileData.email}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-3 rounded-lg text-white ${getLinkStyle(
                  link.platform
                )}`}
              >
                {getLinkIcon(link.platform)}
                <span className="ml-3 text-sm">{link.platform}</span>
              </a>
            ))}

            {links.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No links added yet
              </div>
            )}
          </div>
        </div>
      </div>
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
    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white bg-opacity-20">
      {platform[0]}
    </div>
  );
}
