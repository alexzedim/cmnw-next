"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

import { ENDPOINTS } from "@/constants";
import { NAMING_CONSTANTS } from "@/constants/naming";
import { fontJetBrains } from "@/config/fonts";

interface SearchSuggestion {
  value: string;
  type?: "character" | "guild" | "item";
  label?: string;
}

const buildSearchUrl = (query: string) => {
  const url = new URL("/api/app/search", ENDPOINTS.API);

  url.searchParams.set("searchQuery", query);

  return url.toString();
};

const sanitizeQueryInput = (value: string) => value.replace(/\s+/g, "-");

export const SearchForm = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<SearchSuggestion | null>(null);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      const sanitizedQuery = searchQuery.trim();

      if (sanitizedQuery.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);

        return;
      }

      setIsLoadingSuggestions(true);

      try {
        const response = await fetch(buildSearchUrl(sanitizedQuery));

        if (response.ok) {
          const data = await response.json();
          const suggestions: SearchSuggestion[] = [];

          // Add characters to suggestions
          data.characters?.forEach((char: any) => {
            suggestions.push({
              value: char.guid,
              type: "character",
              label: `${char.name || char.guid}`,
            });
          });

          // Add guilds to suggestions
          data.guilds?.forEach((guild: any) => {
            suggestions.push({
              value: guild.guid,
              type: "guild",
              label: guild.name || guild.guid,
            });
          });

          // Add items to suggestions
          data.items?.forEach((item: any) => {
            suggestions.push({
              value: item.id.toString(),
              type: "item",
              label: item.name,
            });
          });

          setSuggestions(suggestions.slice(0, 10));
          setShowDropdown(suggestions.length > 0);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (query: string = searchQuery) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    // If a suggestion was explicitly chosen earlier, navigate to it
    if (selectedSuggestion) {
      navigateToSuggestion(selectedSuggestion);

      return;
    }

    console.log(trimmedQuery);
    setIsSubmitting(true);
    setShowDropdown(false);

    try {
      const response = await fetch(buildSearchUrl(trimmedQuery));

      if (response.ok) {
        const data = await response.json();

        console.log("Search API Response:", data);

        // Navigate to first result if available
        const firstResult =
          data.characters?.[0] || data.guilds?.[0] || data.items?.[0];

        if (firstResult) {
          const suggestion: SearchSuggestion = {
            value:
              firstResult.guid ||
              firstResult.name ||
              (firstResult.id ? String(firstResult.id) : ""),
            type: data.characters?.[0]
              ? "character"
              : data.guilds?.[0]
                ? "guild"
                : "item",
          };

          navigateToSuggestion(suggestion);
        }
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.value);
    setSelectedSuggestion(suggestion);
    setShowDropdown(false);
    setSelectedIndex(-1);
    navigateToSuggestion(suggestion);
  };

  const navigateToSuggestion = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case "character":
        router.push(`/character/${suggestion.value}`);
        break;
      case "guild":
        router.push(`/guild/${suggestion.value}`);
        break;
      case "item":
        router.push(`/item/${suggestion.value}`);
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }

      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "character":
        return ">";
      case "guild":
        return "#️";
      case "item":
        return "$";
      default:
        return "!";
    }
  };

  return (
    <div className="w-full max-w-3xl relative">
      <div className="flex gap-2 items-end">
        <div className="card-surface max-w-3xl w-full p-4 relative">
          <div className="font-mono text-sm text-muted flex items-center w-full">
            <span className="text-foreground/80">$</span>
            <input
              ref={inputRef}
              autoComplete="off"
              className="bg-transparent ml-2 outline-none text-foreground flex-1"
              placeholder='cmnw search "Thunderfury"'
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(sanitizeQueryInput(e.target.value))
              }
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowDropdown(true);
                }
              }}
              onKeyDown={handleKeyDown}
            />
            {isLoadingSuggestions && (
              <span className="text-foreground/40 text-xs">...</span>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full mt-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.value}-${index}`}
                  className={`w-full text-left px-4 py-2.5 font-mono text-sm transition-colors flex items-center gap-2 ${
                    index === selectedIndex
                      ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "text-[var(--text)] hover:bg-[var(--bg)]"
                  } ${index === 0 ? "rounded-t-lg" : ""} ${
                    index === suggestions.length - 1 ? "rounded-b-lg" : ""
                  }`}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="text-base">
                    {getTypeIcon(suggestion.type)}
                  </span>
                  {suggestion.type === "item" && suggestion.label ? (
                    <>
                      <span className="flex-1">{suggestion.label}</span>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{suggestion.value}</span>
                    </>
                  )}
                  <span
                    className="text-xs uppercase tracking-wider opacity-60"
                    style={{ fontFamily: fontJetBrains.style.fontFamily }}
                  >
                    {suggestion.type === "character"
                      ? NAMING_CONSTANTS.CHARACTER
                      : suggestion.type === "guild"
                        ? NAMING_CONSTANTS.GUILD
                        : NAMING_CONSTANTS.ITEM}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="btn btn-primary min-h-[56px] h-[56px] min-w-[112px]"
          disabled={!mounted || isSubmitting || !searchQuery.trim()}
          type="button"
          onClick={() => handleSearch()}
        >
          {isSubmitting ? "..." : "→"}
        </button>
      </div>
    </div>
  );
};
