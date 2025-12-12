"use client";

import { useState } from "react";

export const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async () => {
    console.log(searchQuery);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/osint/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Search API Response:", data);
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="flex gap-2 items-end">
        <div className="card-surface max-w-3xl w-full p-4">
          <div className="font-mono text-sm text-muted flex items-center w-full">
            <span className="text-foreground/80">$</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent ml-2 outline-none text-foreground flex-1"
              placeholder='cmnw search "Thunderfury"'
            />
          </div>
        </div>

        <button
          className="btn btn-primary min-h-[56px] h-[56px] min-w-[112px]"
          disabled={isSubmitting || !searchQuery.trim()}
          onClick={handleSearch}
          type="button"
        >
          {isSubmitting ? "..." : "→"}
        </button>
      </div>
    </div>
  );
};
