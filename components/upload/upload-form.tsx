"use client";

import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import type { IAddonScanEntry } from "@/lib/types";

import { useState, useCallback, useRef } from "react";

import { parseAddonScanEntries, validateLuaHeader } from "./lua-parser";

interface UploadFormProps {
  onParsed: (entries: IAddonScanEntry[]) => void;
  onSubmit: (entries: IAddonScanEntry[]) => Promise<void>;
  isSubmitting: boolean;
  dict: {
    dropzoneLabel: string;
    fileNameError: string;
    fileExtensionError: string;
    fileHeaderError: string;
    parseError: string;
    submit: string;
    submitting: string;
    entryCount: string;
    noEntries: string;
  };
}

type ValidationError =
  | "fileNameError"
  | "fileExtensionError"
  | "fileHeaderError"
  | "parseError"
  | null;

export function UploadForm({
  onParsed,
  onSubmit,
  isSubmitting,
  dict,
}: UploadFormProps) {
  const [error, setError] = useState<ValidationError>(null);
  const [entries, setEntries] = useState<IAddonScanEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndParseFile = useCallback(
    async (file: File) => {
      setError(null);
      setEntries([]);
      onParsed([]);

      const fileName = file.name.toLowerCase();

      if (!fileName.includes("cmnw-osint")) {
        setError("fileNameError");

        return;
      }

      if (!fileName.endsWith(".lua")) {
        setError("fileExtensionError");

        return;
      }

      try {
        const content = await file.text();

        if (!validateLuaHeader(content)) {
          setError("fileHeaderError");

          return;
        }

        const parsed = parseAddonScanEntries(content);

        if (parsed.length === 0) {
          setError("parseError");

          return;
        }

        setEntries(parsed);
        onParsed(parsed);
      } catch {
        setError("parseError");
      }
    },
    [onParsed]
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        validateAndParseFile(file);
      }
    },
    [validateAndParseFile]
  );

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer.files[0];

      if (file) {
        validateAndParseFile(file);
      }
    },
    [validateAndParseFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (entries.length === 0) return;

    await onSubmit(entries);
  }, [entries, onSubmit]);

  const entryCountText =
    entries.length > 0
      ? dict.entryCount.replace("{count}", String(entries.length))
      : null;

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragging
              ? "border-[var(--primary)] bg-[var(--primary)]/10"
              : "border-[var(--border)] hover:border-[var(--primary)]/50"
          }
        `}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={fileInputRef}
          accept=".lua"
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
        <p className="text-[var(--text-muted)]">{dict.dropzoneLabel}</p>
      </div>

      {error && <p className="text-red-500 text-sm">{dict[error]}</p>}

      {entryCountText && !error && (
        <p className="text-green-500 text-sm">{entryCountText}</p>
      )}

      {entries.length > 0 && (
        <button
          className="btn btn-primary w-full"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? dict.submitting : dict.submit}
        </button>
      )}
    </div>
  );
}
