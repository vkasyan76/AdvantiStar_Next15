"use client";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { templates } from "@/constants/templates";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export const TemplatesGallery = () => {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const [isCreating, setIsCreating] = useState(false);

  const onTemplateClick = async (title: string, initialContent: string) => {
    setIsCreating(true);
    create({ title, initialContent })
      .catch(() => toast.error("Something went wrong"))
      .then((documentId) => {
        toast.success("Document created");
        router.push(`/documents/${documentId}`);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  // const isCreating = false;
  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
        <h3 className="font-medium">Start a new document</h3>
        <Carousel>
          {/* -ml-4 compensates for padding/margin on child items, ensuring the first item aligns properly with the parent container's edge. */}
          <CarouselContent className="-ml-4">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
              >
                {/* Container div for each template */}
                <div
                  className={cn(
                    "aspect-[3/4] flex flex-col gap-y-2.5", // Maintain 3:4 aspect ratio, flex layout, spacing between children
                    isCreating && "pointer-events-none opacity-50" // Disable interactions and reduce opacity when creating
                  )}
                >
                  {/* Button wrapping the template image */}
                  <button
                    disabled={isCreating} // Disable button when `isCreating` is true
                    // TODO: Add proper initial content
                    onClick={() => {
                      onTemplateClick(template.label, "");
                    }}
                    style={{
                      backgroundImage: `url(${template.imageUrl})`, // Set button background using template's image URL
                      backgroundSize: "cover", // Ensure the image covers the button
                      backgroundPosition: "center", // Center the image
                      backgroundRepeat: "no-repeat", // Prevent image repetition
                    }}
                    className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 
                 transition flex flex-col items-center justify-center gap-y-4 bg-white"
                  />
                  {/* Display the label for the template */}
                  <p className="text-sm font-medium truncate">
                    {template.label}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
