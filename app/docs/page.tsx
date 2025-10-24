"use client";

import { Card, CardBody, CardHeader, Divider, Code } from "@heroui/react";
import { title, subtitle } from "@/components/primitives";

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      <div className="max-w-4xl">
        <h1 className={title()}>Documentation</h1>
        <p className={subtitle({ class: "mt-4" })}>
          Learn how to use CMNW tools and features
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Getting Started</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <p className="text-default-600">
              CMNW provides a simple search interface to look up World of
              Warcraft characters, guilds, commodities, and more across EU
              realms.
            </p>
            <Divider />
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Character Search
              </h3>
              <p className="text-default-600 mb-2">
                Search for any character by name and realm:
              </p>
              <Code className="mb-2">CharacterName@RealmName</Code>
              <p className="text-small text-default-500">
                Example: Arthas@Silvermoon
              </p>
            </div>
            <Divider />
            <div>
              <h3 className="text-lg font-semibold mb-2">Guild Search</h3>
              <p className="text-default-600 mb-2">
                Find guild information and rosters:
              </p>
              <Code className="mb-2">GuildName@RealmName</Code>
              <p className="text-small text-default-500">
                Example: Method@Tarren Mill
              </p>
            </div>
            <Divider />
            <div>
              <h3 className="text-lg font-semibold mb-2">Commodity Search</h3>
              <p className="text-default-600 mb-2">
                Track commodity prices and availability:
              </p>
              <Code className="mb-2">CommodityName@RealmName</Code>
              <p className="text-small text-default-500">
                Example: Soul Dust@Draenor
              </p>
            </div>
            <Divider />
            <div>
              <h3 className="text-lg font-semibold mb-2">Gold Prices</h3>
              <p className="text-default-600 mb-2">
                View current gold prices for a specific realm:
              </p>
              <Code className="mb-2">@RealmName</Code>
              <p className="text-small text-default-500">
                Example: @Kazzak
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">API & Data Source</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <p className="text-default-600">
              All data is retrieved from official Blizzard APIs and updated
              regularly. The backend is built with NestJS and provides a RESTful
              API for accessing the data.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Contributing</h2>
          </CardHeader>
          <CardBody className="gap-4">
            <p className="text-default-600">
              CMNW is open source! Visit our GitHub repository to contribute,
              report issues, or request new features.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
