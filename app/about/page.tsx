"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { title, subtitle } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      <div className="max-w-4xl">
        <h1 className={title()}>About CMNW</h1>
        <p className={subtitle({ class: "mt-4" })}>
          World of Warcraft community tools and resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Our Mission</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-600">
              Commonwealth (CMNW) provides powerful tools for World of Warcraft
              players to search and analyze characters, guilds, commodities, and
              more across EU realms.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Features</p>
            </div>
          </CardHeader>
          <CardBody>
            <ul className="list-disc list-inside text-default-600 space-y-2">
              <li>Character search and profiles</li>
              <li>Guild information and rosters</li>
              <li>Commodity and gold price tracking</li>
              <li>Hash-based data lookup</li>
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Technology</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-600">
              Built with modern technologies including Next.js 16, React 19,
              TypeScript, and HeroUI components for a fast and responsive
              experience.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Community</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-default-600">
              Join our growing community of WoW players and contributors. Check
              out our GitHub repository to contribute or report issues.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
