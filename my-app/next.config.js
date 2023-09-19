// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

module.exports = {
  async rewrites() {
    return [
      {
        source: "/upload",
        destination: "https://upload-wed-photo.dariusramnath.repl.co/upload",
      },
    ];
  },
};
