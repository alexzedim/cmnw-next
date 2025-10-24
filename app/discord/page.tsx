"use client";

import { Button } from "@heroui/button";
import { title } from "@/components/primitives";

export default function DiscordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 py-8 md:py-10">
      <div className="text-center max-w-2xl">
        <h1 className={title({ size: "lg" })}>
          REVEAL SHADOWS IN SHADOWLANDS
        </h1>
        <p className="text-default-600 mt-4">
          Join our Discord community and invite our bot to your server
        </p>
      </div>

      <Button
        as="a"
        href="https://discord.com/oauth2/authorize?client_id=318324033940750337&scope=bot"
        target="_blank"
        rel="noopener noreferrer"
        color="secondary"
        variant="bordered"
        size="lg"
        className="min-w-[300px]"
      >
        {'>'} Invite Link
      </Button>
    </div>
  );
}
