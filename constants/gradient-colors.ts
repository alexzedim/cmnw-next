// Simplified background gradients (CSS strings) for faction and item quality backgrounds
// Used by generateFactionBackground and generateItemBackground utility functions
export const gradientColors = [
  // Alliance colors (0-4)
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Alliance purple 1
  "linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)", // Alliance purple 2
  "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)", // Alliance blue 1
  "linear-gradient(135deg, #2e3192 0%, #1bffff 100%)", // Alliance blue 2
  "linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)", // Alliance blue 3

  // Horde colors (5-9)
  "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)", // Horde red 1
  "linear-gradient(135deg, #c31432 0%, #240b36 100%)", // Horde dark red
  "linear-gradient(135deg, #f12711 0%, #f5af19 100%)", // Horde orange
  "linear-gradient(135deg, #d31027 0%, #ea384d 100%)", // Horde crimson
  "linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)", // Horde scarlet

  // Item quality colors (10-17)
  "linear-gradient(135deg, #9d9d9d 0%, #757575 100%)", // Poor (grey)
  "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)", // Common (white)
  "linear-gradient(135deg, #1eff00 0%, #00b712 100%)", // Uncommon (green)
  "linear-gradient(135deg, #0070dd 0%, #1890ff 100%)", // Rare (blue)
  "linear-gradient(135deg, #a335ee 0%, #c969ff 100%)", // Epic (purple)
  "linear-gradient(135deg, #ff8000 0%, #ffa500 100%)", // Legendary (orange)
  "linear-gradient(135deg, #e6cc80 0%, #d4af37 100%)", // Artifact/Gold (gold)
  "linear-gradient(135deg, #00ccff 0%, #1e90ff 100%)", // Heirloom/WoW Token (cyan)
];
