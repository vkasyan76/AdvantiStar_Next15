"use client";

import { useRef, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { useSearchParam } from "@/hooks/use-search-param";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  const [search, setSearch] = useSearchParam();

  const [value, setValue] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    setSearch("");
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // add Search param to the url
    setSearch(value);
    inputRef.current?.blur();
  };

  return (
    <div className="flex-1 flex items-center justify-center ">
      <form onSubmit={handleSubmit} className="relative max-w-[720px] w-full">
        <Input
          value={value}
          onChange={handleChange}
          ref={inputRef}
          placeholder="Search"
          className="md:text-base placeholder:text-neutral-800 px-14 w-full border-none focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)] bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          //   -translate-y-1/2: Shifts the element upward by half of its own height.
          className="absolute left-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full"
        >
          <SearchIcon />
        </Button>
        {value && (
          <Button
            onClick={handleClear}
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full"
          >
            <XIcon />
          </Button>
        )}
      </form>
    </div>
  );
};

// focus-visible: This pseudo-class ensures the shadow only applies when the input field gains focus through keyboard navigation (not mouse click).
// Breaking Down the Shadow Value
// The shadow value consists of two shadows applied simultaneously:

// 0 1px 1px 0 rgba(65,69,73,0.3):

// 0: No horizontal offset.
// 1px: Vertical offset of 1 pixel (shadow appears slightly below the element).
// 1px: Blur radius (softening of the shadow).
// 0: Spread radius (no expansion of the shadow).
// rgba(65,69,73,0.3): Shadow color with transparency (30% opacity).
// 0 1px 3px 1px rgba(65,69,73,0.15):

// 0: No horizontal offset.
// 1px: Vertical offset of 1 pixel.
// 3px: Blur radius of 3 pixels (slightly softer shadow).
// 1px: Spread radius of 1 pixel (expanding the shadow).
// rgba(65,69,73,0.15): Shadow color with 15% opacity.
