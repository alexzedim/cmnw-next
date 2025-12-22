"use client";

interface HashAccountTitleProps {
  hashType: string;
  hashQuery: string;
  characterCount: number;
}

export const HashAccountTitle = ({
  hashType,
  hashQuery,
  characterCount,
}: HashAccountTitleProps) => {
  const displayHash = `${hashType}@${hashQuery}`.toUpperCase();

  // Determine match quality based on character count
  const isGoodMatch = characterCount <= 65;
  const matchQuality = isGoodMatch
    ? { text: "Good Match", color: "text-green-500", bgColor: "bg-green-500/10" }
    : {
        text: "Hash Too Common",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      };

  return (
    <div className="card-surface p-6 lg:p-8 rounded-xl mb-6">
      {/* Account Badge */}
      <div className="mb-5 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
          <div className="size-1.5 rounded-full bg-orange-500" />
          <p>Characters Account Detective</p>
        </div>
      </div>

      {/* Header Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-3">
        Account Characters
      </h1>

      {/* Hash Info */}
      <div className="mb-3 flex items-baseline gap-2 text-sm lg:text-base">
        <span className="text-foreground/50">Hash:</span>
        <span className="font-mono font-medium text-foreground/80 tracking-wider">
          {displayHash}
        </span>
      </div>

      {/* Character Count */}
      <div className="flex items-baseline gap-2 text-sm lg:text-base text-foreground/70">
        <span className="text-foreground/50">Found:</span>
        <span className="font-medium">
          {characterCount} character{characterCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Match Quality */}
      <div className={`mt-4 px-4 py-3 rounded-lg ${matchQuality.bgColor}`}>
        <div className={`text-sm font-medium ${matchQuality.color}`}>
          {matchQuality.text}
        </div>
        <div className="text-xs text-foreground/60 mt-1">
          {isGoodMatch
            ? `This account has ${characterCount} character${characterCount !== 1 ? "s" : ""}`
            : `This hash value is shared by ${characterCount} characters from different accounts`}
        </div>
      </div>
    </div>
  );
};
