"use client";

import { title, subtitle } from "@/components/primitives";

export default function AboutPage() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <div>
          <h1 className={title()}>About CMNW</h1>
          <p className={subtitle({ class: "mt-4" })}>
            World of Warcraft community tools and resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-surface p-6">
            <p className="text-lg font-semibold">Our Mission</p>
            <p className="text-muted mt-2">
              Commonwealth (CMNW) provides powerful tools for World of Warcraft
              players to search and analyze characters, guilds, commodities, and
              more across EU realms.
            </p>
          </div>

          <div className="card-surface p-6">
            <p className="text-lg font-semibold">Features</p>
            <ul className="list-disc list-inside text-muted space-y-2 mt-2">
              <li>Character search and profiles</li>
              <li>Guild information and rosters</li>
              <li>Commodity and gold price tracking</li>
              <li>Hash-based data lookup</li>
            </ul>
          </div>

          <div className="card-surface p-6">
            <p className="text-lg font-semibold">Technology</p>
            <p className="text-muted mt-2">
              Built with modern technologies including Next.js 16, React 19,
              TypeScript, and token-driven design for a fast and responsive
              experience.
            </p>
          </div>

          <div className="card-surface p-6">
            <p className="text-lg font-semibold">Community</p>
            <p className="text-muted mt-2">
              Join our growing community of WoW players and contributors. Check
              out our GitHub repository to contribute or report issues.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
