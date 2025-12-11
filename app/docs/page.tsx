"use client";

import { title, subtitle } from "@/components/primitives";

export default function DocsPage() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <div>
          <h1 className={title()}>Documentation</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Learn how to use CMNW tools and features
          </p>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            <p className="text-muted">
              CMNW provides a simple search interface to look up World of
              Warcraft characters, guilds, commodities, and more across EU
              realms.
            </p>
            <div>
              <h3 className="text-lg font-semibold mb-2">Character Search</h3>
              <p className="text-muted mb-2">Search for any character by name and realm:</p>
              <code className="code-chip mb-2 inline-block">CharacterName@RealmName</code>
              <p className="text-xs text-muted">Example: Arthas@Silvermoon</p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Guild Search</h3>
              <p className="text-muted mb-2">Find guild information and rosters:</p>
              <code className="code-chip mb-2 inline-block">GuildName@RealmName</code>
              <p className="text-xs text-muted">Example: Method@Tarren Mill</p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Commodity Search</h3>
              <p className="text-muted mb-2">Track commodity prices and availability:</p>
              <code className="code-chip mb-2 inline-block">CommodityName@RealmName</code>
              <p className="text-xs text-muted">Example: Soul Dust@Draenor</p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Gold Prices</h3>
              <p className="text-muted mb-2">View current gold prices for a specific realm:</p>
              <code className="code-chip mb-2 inline-block">@RealmName</code>
              <p className="text-xs text-muted">Example: @Kazzak</p>
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="text-2xl font-semibold">API & Data Source</h2>
            <p className="text-muted mt-2">
              All data is retrieved from official Blizzard APIs and updated
              regularly. The backend is built with NestJS and provides a RESTful
              API for accessing the data.
            </p>
          </div>

          <div className="card-surface p-6">
            <h2 className="text-2xl font-semibold">Contributing</h2>
            <p className="text-muted mt-2">
              CMNW is open source! Visit our GitHub repository to contribute,
              report issues, or request new features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
