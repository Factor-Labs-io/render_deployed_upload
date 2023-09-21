// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

module.exports = {
  async rewrites() {
    return [
      {
        source: "/upload",
        destination: "https://imageupload.varounhanooman4.repl.co/upload",
      },
    ];
  },
};
