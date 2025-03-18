"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Link } from "../lib/types";
import type { DragEndEvent } from "@dnd-kit/core";
import { Grip, LinkIcon } from "lucide-react";
import useToast from "react-hook-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface LinksFormProps {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

export default function LinksForm({ links, setLinks }: LinksFormProps) {
  const toast = useToast();
  const [errors, setErrors] = useState<Record<number, { url?: string }>>({});
  const [showSaveButton, setShowSaveButton] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Save links to localStorage whenever they change
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  const handleAddLink = () => {
    setLinks([...links, { platform: "GitHub", url: "" }]);
    setShowSaveButton(true);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  const handleLinkChange = (
    index: number,
    field: keyof Link,
    value: string
  ) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);

    // Clear error when user starts typing
    if (field === "url" && errors[index]?.url) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const validateLinks = () => {
    const newErrors: Record<number, { url?: string }> = {};
    let hasErrors = false;

    links.forEach((link, index) => {
      if (!link.url.trim()) {
        newErrors[index] = { url: "Can't be empty" };
        hasErrors = true;
      } else if (!isValidUrl(link.url, link.platform)) {
        newErrors[index] = { url: "Please check the URL" };
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSave = () => {
    if (validateLinks()) {
      toast({
        title: "Changes saved. Your links have been updated successfully",
      });
      window.alert("Link added successfully");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex(
        (link) => `link-${link.url}-${link.platform}` === active.id
      );
      const newIndex = links.findIndex(
        (link) => `link-${link.url}-${link.platform}` === over.id
      );

      const newLinks = [...links];
      const [movedItem] = newLinks.splice(oldIndex, 1);
      newLinks.splice(newIndex, 0, movedItem);

      setLinks(newLinks);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize your links</CardTitle>
        <CardDescription>
          Add/edit/remove links below and then share all your profiles with the
          world!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full mb-6 hover:cursor-pointer"
          onClick={handleAddLink}
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          Add new link
        </Button>

        {links.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="font-medium text-lg mb-2">
              Let&apos;s get you started
            </h3>
            <p className="text-muted-foreground mb-6">
              Use the &quot;Add new link&quot; button to get started. Once you
              have more than one link, you can reorder and edit them.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={links.map((link) => `link-${link.url}-${link.platform}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {links.map((link, index) => (
                  <SortableLink
                    key={`link-${link.url}-${link.platform}-${index}`}
                    id={`link-${link.url}-${link.platform}`}
                    index={index}
                    link={link}
                    error={errors[index]?.url}
                    onChange={handleLinkChange}
                    onRemove={handleRemoveLink}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {showSaveButton && (
          <div className="mt-6 flex justify-end">
            <Button className="hover:cursor-pointer" onClick={handleSave}>
              Save
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SortableLinkProps {
  id: string;
  index: number;
  link: Link;
  error?: string;
  onChange: (index: number, field: keyof Link, value: string) => void;
  onRemove: (index: number) => void;
}

function SortableLink({
  id,
  index,
  link,
  error,
  onChange,
  onRemove,
}: SortableLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 rounded-lg p-4 border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-1 mr-2 text-gray-500 hover:text-gray-700"
          >
            <Grip className="h-5 w-5" />
          </div>
          <span className="font-medium">Link #{index + 1}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
        >
          Remove
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <Select
            value={link.platform}
            onValueChange={(value) => onChange(index, "platform", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GitHub">GitHub</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Twitch">Twitch</SelectItem>
              <SelectItem value="DevTo">Dev.to</SelectItem>
              <SelectItem value="CodePen">CodePen</SelectItem>
              <SelectItem value="FreeCodeCamp">FreeCodeCamp</SelectItem>
              <SelectItem value="GitLab">GitLab</SelectItem>
              <SelectItem value="Hashnode">Hashnode</SelectItem>
              <SelectItem value="StackOverflow">Stack Overflow</SelectItem>
              <SelectItem value="Frontend Mentor">Frontend Mentor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <Input
            value={link.url}
            onChange={(e) => onChange(index, "url", e.target.value)}
            placeholder={`e.g. https://${link.platform
              .toLowerCase()
              .replace(" ", "")}.com/username`}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function isValidUrl(url: string, platform: string): boolean {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.protocol.startsWith("http")) {
      return false;
    }

    // Basic platform-specific validation
    const hostname = parsedUrl.hostname.toLowerCase();
    const platformLower = platform.toLowerCase().replace(" ", "");

    // This is a simplified check - in a real app you'd want more robust validation
    return (
      hostname.includes(platformLower) ||
      (platformLower === "github" && hostname.includes("github.io")) ||
      (platformLower === "devto" && hostname.includes("dev.to"))
    );
  } catch (e) {
    console.error("Invalid URL:", e);
    return false;
  }
}
