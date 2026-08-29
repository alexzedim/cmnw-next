"use client";

import type { KeyboardEvent } from "react";
import type {
  SearchPlaceholder,
  SearchPlaceholderType,
} from "@/constants/search-placeholders";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { NAMING_CONSTANTS } from "@/constants/naming";
import {
  formatSearchQuery,
  SEARCH_PLACEHOLDERS,
} from "@/constants/search-placeholders";
import { fontJetBrains } from "@/config/fonts";
import { useAnimatedPlaceholder } from "@/hooks/use-animated-placeholder";
import { clientFetch } from "@/lib/api/origins";

interface SearchSuggestion {
  value: string;
  type?: "character" | "guild" | "item" | "realm";
  label?: string;
}

const buildSearchPath = (query: string) => {
  const params = new URLSearchParams({ searchQuery: query });

  return `/api/app/search?${params.toString()}`;
};

const sanitizeQueryInput = (value: string) => value.replace(/\s+/g, "-");

const suggestionText = (suggestion: SearchSuggestion) =>
  sanitizeQueryInput(suggestion.label ?? suggestion.value);

const findGhostCompletion = (
  query: string,
  suggestions: SearchSuggestion[]
) => {
  const normalizedQuery = query.toLowerCase();

  if (normalizedQuery.length < 2) {
    return null;
  }

  for (const suggestion of suggestions) {
    const text = suggestionText(suggestion);

    if (
      text.toLowerCase().startsWith(normalizedQuery) &&
      text.length > query.length
    ) {
      return text.slice(query.length);
    }
  }

  return null;
};

const pickRandomChips = (count: number) => {
  const pool = [...SEARCH_PLACEHOLDERS];

  return Array.from(
    { length: count },
    () => pool.splice(Math.floor(Math.random() * pool.length), 1)[0]
  );
};

const INPUT_FONT_SIZE = "clamp(28px, 4.2vw, 54px)";
const CHIP_COUNT = 5;

const CHIP_TYPE_STYLES: Record<
  SearchPlaceholderType,
  { glyph: string; glyphClassName: string; className: string }
> = {
  character: {
    glyph: ">",
    glyphClassName: "text-[var(--type-character)]",
    className: "border-transparent bg-foreground/10 hover:bg-foreground/20",
  },
  guild: {
    glyph: "#",
    glyphClassName: "text-[var(--type-guild)]",
    className:
      "border-foreground/25 hover:border-foreground/40 hover:bg-foreground/10",
  },
};

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
  const [isHovered, setIsHovered] = useState(false);
  const [chips, setChips] = useState<SearchPlaceholder[]>([]);
  const [isNearOverflow, setIsNearOverflow] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const [viewportTick, setViewportTick] = useState(0);
  const { placeholder: animatedPlaceholder } = useAnimatedPlaceholder(
    searchQuery === "",
    isHovered
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ghostCompletion = isLoadingSuggestions
    ? null
    : findGhostCompletion(searchQuery, suggestions);

  useEffect(() => {
    setChips(pickRandomChips(CHIP_COUNT));
  }, []);

  useEffect(() => {
    const remeasure = () => setViewportTick((tick) => tick + 1);

    window.addEventListener("resize", remeasure);
    document.fonts?.ready.then(remeasure);

    return () => window.removeEventListener("resize", remeasure);
  }, []);

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
        const response = await clientFetch(buildSearchPath(sanitizedQuery));

        if (response.ok) {
          const data = await response.json();
          const suggestions: SearchSuggestion[] = [];

          data.characters?.forEach((char: any) => {
            suggestions.push({
              value: char.guid,
              type: "character",
              label: `${char.name || char.guid}`,
            });
          });

          data.guilds?.forEach((guild: any) => {
            suggestions.push({
              value: guild.guid,
              type: "guild",
              label: guild.name || guild.guid,
            });
          });

          data.items?.forEach((item: any) => {
            suggestions.push({
              value: item.id.toString(),
              type: "item",
              label: item.name,
            });
          });

          data.realms?.forEach((realm: any) => {
            suggestions.push({
              value: realm.slug,
              type: "realm",
              label: realm.name,
            });
          });

          setSuggestions(suggestions.slice(0, 10));
          setShowDropdown(suggestions.length > 0);
        }
      } catch {
        // suggestions are optional — fail silently
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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

  useEffect(() => {
    const input = inputRef.current;
    const row = rowRef.current;

    if (!input || !row || !searchQuery) {
      setTextWidth(0);
      setIsNearOverflow(false);

      return;
    }

    const context = document.createElement("canvas").getContext("2d");
    const { font } = getComputedStyle(input);

    if (!context || !font) {
      return;
    }

    context.font = font;

    const width = context.measureText(searchQuery).width;

    setTextWidth(width);
    setIsNearOverflow(width > row.clientWidth * 0.85);
  }, [searchQuery, viewportTick]);

  const handleSearch = async (query: string = searchQuery) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    if (selectedSuggestion) {
      navigateToSuggestion(selectedSuggestion);

      return;
    }

    setIsSubmitting(true);
    setShowDropdown(false);

    try {
      const response = await clientFetch(buildSearchPath(trimmedQuery));

      if (response.ok) {
        const data = await response.json();

        const firstResult =
          data.characters?.[0] ||
          data.guilds?.[0] ||
          data.items?.[0] ||
          data.realms?.[0];

        if (firstResult) {
          const suggestion: SearchSuggestion = {
            value:
              firstResult.guid ||
              firstResult.slug ||
              firstResult.name ||
              (firstResult.id ? String(firstResult.id) : ""),
            type: data.characters?.[0]
              ? "character"
              : data.guilds?.[0]
                ? "guild"
                : data.items?.[0]
                  ? "item"
                  : "realm",
          };

          navigateToSuggestion(suggestion);
        }
      }
    } catch {
      // search is best-effort — fail silently
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

  const handleChipClick = (chip: SearchPlaceholder) => {
    const query = formatSearchQuery(chip);

    setSearchQuery(query);

    if (selectedSuggestion) {
      setSelectedSuggestion(null);
    }

    handleSearch(query);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedSuggestion(null);
    setSelectedIndex(-1);
    setShowDropdown(false);
    inputRef.current?.focus();
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
      case "realm":
        router.push(`/realm/${suggestion.value}`);
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (showDropdown) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      } else if (searchQuery) {
        handleClear();
      }

      return;
    }

    const caretAtEnd =
      inputRef.current?.selectionStart === inputRef.current?.selectionEnd &&
      inputRef.current?.selectionEnd === searchQuery.length;

    if (
      ghostCompletion &&
      !isNearOverflow &&
      caretAtEnd &&
      (e.key === "ArrowRight" || e.key === "Tab")
    ) {
      e.preventDefault();
      setSearchQuery(searchQuery + ghostCompletion);
      setSelectedIndex(-1);

      return;
    }

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
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "character":
        return ">";
      case "guild":
        return "#\uFE0F";
      case "item":
        return "$";
      case "realm":
        return "@";
      default:
        return "!";
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={rowRef}
        className="relative w-full border-b border-divider pb-3"
        onMouseDown={() => inputRef.current?.focus()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex w-full items-center justify-center">
          <input
            ref={inputRef}
            aria-busy={isSubmitting}
            autoComplete="off"
            className="min-w-0 bg-transparent text-center font-mono leading-[1.15] text-foreground caret-[var(--accent)] outline-none placeholder:text-transparent"
            enterKeyHint="search"
            placeholder={animatedPlaceholder}
            style={{
              fontSize: INPUT_FONT_SIZE,
              width:
                searchQuery === "" || isNearOverflow
                  ? "100%"
                  : `${Math.ceil(textWidth)}px`,
            }}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizeQueryInput(e.target.value))}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowDropdown(true);
              }
            }}
            onKeyDown={handleKeyDown}
          />

          {ghostCompletion && !isNearOverflow && (
            <span
              aria-hidden
              className="whitespace-nowrap font-mono leading-[1.15] text-foreground/50"
              style={{ fontSize: INPUT_FONT_SIZE }}
            >
              {ghostCompletion}
            </span>
          )}
        </div>

        {searchQuery === "" && (
          <p
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-2 font-mono text-foreground/50"
            style={{ fontSize: INPUT_FONT_SIZE }}
          >
            {animatedPlaceholder}
          </p>
        )}

        {searchQuery !== "" && !isNearOverflow && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 px-2 font-mono text-xs text-foreground/40 transition-colors hover:text-foreground"
            type="button"
            onClick={handleClear}
          >
            esc
          </button>
        )}

        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full z-50 mt-3 max-h-[300px] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg dark:shadow-none"
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
                  <span className="flex-1">{suggestion.label}</span>
                ) : suggestion.type === "realm" && suggestion.label ? (
                  <span className="flex-1">{suggestion.label}</span>
                ) : (
                  <span className="flex-1">{suggestion.value}</span>
                )}
                <span
                  className="text-xs uppercase tracking-wider opacity-60"
                  style={{ fontFamily: fontJetBrains.style.fontFamily }}
                >
                  {suggestion.type === "character"
                    ? NAMING_CONSTANTS.CHARACTER
                    : suggestion.type === "guild"
                      ? NAMING_CONSTANTS.GUILD
                      : suggestion.type === "realm"
                        ? NAMING_CONSTANTS.REALM
                        : NAMING_CONSTANTS.ITEM}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {searchQuery === "" && chips.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {chips.map((chip) => {
            const typeStyle = CHIP_TYPE_STYLES[chip.type];

            return (
              <button
                key={formatSearchQuery(chip)}
                className={`flex items-center rounded-full border px-4 py-2 font-mono text-sm text-foreground transition-colors ${typeStyle.className}`}
                title={formatSearchQuery(chip)}
                type="button"
                onClick={() => handleChipClick(chip)}
              >
                <span
                  aria-hidden
                  className={`mr-1.5 ${typeStyle.glyphClassName}`}
                >
                  {typeStyle.glyph}
                </span>
                {chip.name}
                <span>@{chip.realm}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
