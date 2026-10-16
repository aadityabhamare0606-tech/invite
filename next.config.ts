import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async headers() {
    const oneDay = "public, max-age=86400, stale-while-revalidate=604800";
    /* Demo documents are edited in place under a stable filename, so a browser
       that reuses a stored copy keeps showing stale markup. no-store makes the
       storefront always load the latest demo source. */
    const revalidateDemo = "no-store, max-age=0, must-revalidate";

    return [
      {
        /* Baseline for everything under /demos. This covers the hand-written
           demos that ship root-level index.html + styles.css + script.js, which
           are edited by hand and have no content hash in the filename. Caching
           those for a day means design edits never reach the browser.

           Declared FIRST so the content-hashed build output below can opt back
           into a long cache — when two rules match the same path and set the
           same header key, the last one wins. */
        source: "/demos/:path*",
        headers: [{ key: "Cache-Control", value: revalidateDemo }],
      },
      {
        /* Hand-edited demo source (html/css/js/map) intentionally has no rule
           here — it inherits the revalidating /demos/:path* baseline above, so
           design edits show up on the next load.

           Only replaceable binary payloads keep the long TTL below: they are
           never hand-edited during a design pass, and re-fetching them on every
           visit would cost real bandwidth (audio, fonts, images). */
        source: "/demos/:path*.woff2",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        source: "/demos/:path*.mp3",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        source: "/demos/:path*.mp4",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        source: "/demos/:path*.svg",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        source: "/demos/:path*.png",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        source: "/demos/:path*.jpg",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        /* Same reasoning as the .avif rule below, for the same reason: X-Content-Type-Options
           is nosniff, so a host that mislabels .webp would leave the image undecodable
           rather than merely mistyped. Declared explicitly instead of relying on the
           host's mime table. */
        source: "/demos/:path*.webp",
        headers: [
          { key: "Content-Type", value: "image/webp" },
          { key: "Cache-Control", value: oneDay },
        ],
      },
      {
        /* Some hosts map .avif to text/plain, which nosniff then blocks from
           decoding. Declare the real type and cache it like other images. */
        source: "/:path*.avif",
        headers: [
          { key: "Content-Type", value: "image/avif" },
          { key: "Cache-Control", value: oneDay },
        ],
      },
      {
        /* Storefront assets use stable filenames, so keep the TTL bounded. */
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        /* Demo files may be replaced without a filename change. */
        source: "/demos/:path*/assets/:file*",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        /* Hashed framework chunks are safe to retain for a year. */
        source: "/demos/:path*/_next/static/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        /* Root-level static artwork, including logos and fallback SVGs. */
        source: "/:file*.svg",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        source: "/:path*",
        headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
      },
    ];
  },
};

export default nextConfig;
