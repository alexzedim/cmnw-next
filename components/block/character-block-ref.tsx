import NextLink from "next/link";

interface CharacterBlockRefProps {
  hashBlock: { hashValue: string; isConfirmed: boolean };
}

export const CharacterBlockRef = ({ hashBlock }: CharacterBlockRefProps) => {
  const displayHash = hashBlock.hashValue.toUpperCase();

  return (
    <NextLink
      className="card-surface p-4 rounded-xl block hover:shadow-lg dark:hover:shadow-none transition-shadow"
      href={`/block/${hashBlock.hashValue}`}
    >
      <div className="text-xs uppercase tracking-wider opacity-50 mb-2">
        Block
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-lg font-semibold font-mono">{displayHash}</span>
        {hashBlock.isConfirmed ? (
          <span className="chip text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            ✓ confirmed
          </span>
        ) : (
          <span className="chip text-xs opacity-40">unconfirmed</span>
        )}
      </div>
    </NextLink>
  );
};
