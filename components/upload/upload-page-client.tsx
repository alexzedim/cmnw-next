"use client";

import type {
  IAddonScanEntry,
  IAddonScanEntryWithStatus,
  IAddonScanGuild,
} from "@/lib/types";

import { useState, useCallback } from "react";

import { UploadForm } from "./upload-form";
import { UploadTable } from "./upload-table";

import { apiClient } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n/context";
import { Panel } from "@/components/panel";

export function UploadPageClient() {
  const { dict } = useI18n();
  const uploadDict = dict.upload;

  const [entries, setEntries] = useState<IAddonScanEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    characters: IAddonScanEntryWithStatus[];
    guilds: IAddonScanGuild[];
    s3Key: string;
  } | null>(null);

  const handleParsed = useCallback((parsed: IAddonScanEntry[]) => {
    setEntries(parsed);
    setError(null);
    setResult(null);
  }, []);

  const handleSubmit = useCallback(
    async (submitEntries: IAddonScanEntry[]) => {
      setIsSubmitting(true);
      setError(null);
      setResult(null);

      const seen = new Set<string>();
      const dedupedEntries = submitEntries.filter((entry) => {
        const key = `${entry.name.toLowerCase()}@${entry.realm.toLowerCase()}`;

        if (seen.has(key)) return false;
        seen.add(key);

        return true;
      });

      try {
        const response = await apiClient.post<{
          characters: IAddonScanEntryWithStatus[];
          guilds: IAddonScanGuild[];
          s3Key: string;
        }>("/api/osint/upload", { entries: dedupedEntries });

        setResult(response);
      } catch {
        setError(uploadDict.error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [uploadDict.error]
  );

  const formDict = {
    dropzoneLabel: uploadDict.dropzoneLabel,
    fileNameError: uploadDict.fileNameError,
    fileExtensionError: uploadDict.fileExtensionError,
    fileHeaderError: uploadDict.fileHeaderError,
    parseError: uploadDict.parseError,
    submit: uploadDict.submit,
    submitting: uploadDict.submitting,
    entryCount: uploadDict.entryCount,
    noEntries: uploadDict.noEntries,
  };

  const tableDict = {
    name: uploadDict.table.name,
    realm: uploadDict.table.realm,
    class: uploadDict.table.class,
    race: uploadDict.table.race,
    gender: uploadDict.table.gender,
    faction: uploadDict.table.faction,
    level: uploadDict.table.level,
    guild: uploadDict.table.guild,
    guildRank: uploadDict.table.guildRank,
    lastModified: uploadDict.table.lastModified,
    noEntries: uploadDict.noEntries,
    shownCount: uploadDict.shownCount,
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{uploadDict.pageTitle}</h1>
        <p className="text-[var(--text-muted)] mt-2">
          {uploadDict.pageDescription}
        </p>
      </div>

      <Panel>
        <UploadForm
          dict={formDict}
          isSubmitting={isSubmitting}
          onParsed={handleParsed}
          onSubmit={handleSubmit}
        />
      </Panel>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-center">
          {error}
        </div>
      )}

      {result && (
        <Panel>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-[var(--primary)]">
                {uploadDict.result.title}
              </h2>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-foreground/50 uppercase tracking-wider">
                  {uploadDict.result.characters}
                </span>
                <span className="font-mono font-medium">
                  {result.characters.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground/50 uppercase tracking-wider">
                  {uploadDict.result.newCharacters}
                </span>
                <span className="font-mono font-medium text-emerald-500">
                  {result.characters.filter((c) => c.isNew).length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground/50 uppercase tracking-wider">
                  {uploadDict.result.existingCharacters}
                </span>
                <span className="font-mono font-medium text-foreground/70">
                  {result.characters.filter((c) => !c.isNew).length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground/50 uppercase tracking-wider">
                  {uploadDict.result.guilds}
                </span>
                <span className="font-mono font-medium">
                  {result.guilds.length}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-foreground/50 uppercase tracking-wider">
                {uploadDict.result.s3Key}
              </span>
              <code className="font-mono text-sm text-foreground/80 break-all">
                {result.s3Key}
              </code>
            </div>
          </div>
        </Panel>
      )}

      {entries.length > 0 && <UploadTable dict={tableDict} entries={entries} />}
    </div>
  );
}
