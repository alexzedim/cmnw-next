const withFonts = require('next-fonts');
const withImages = require('next-images')

module.exports = withImages(withFonts({
  images: {
    domains: ['imgur.com', 'i.imgur.com'],
  },
  webpack(config, options) {
    return config;
  }
}));
