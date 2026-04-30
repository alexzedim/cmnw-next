"use client";

import type { IAddonScanEntry } from "@/lib/types";

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
  const [success, setSuccess] = useState(false);

  const handleParsed = useCallback((parsed: IAddonScanEntry[]) => {
    setEntries(parsed);
    setError(null);
    setSuccess(false);
  }, []);

  const handleSubmit = useCallback(
    async (submitEntries: IAddonScanEntry[]) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      try {
        await apiClient.post("/api/osint/upload", { entries: submitEntries });
        setSuccess(true);
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

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-center">
          {uploadDict.success}
        </div>
      )}

      {entries.length > 0 && <UploadTable dict={tableDict} entries={entries} />}
    </div>
  );
}
