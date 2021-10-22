import { mapToS3Path } from "./s3-helper";

describe("Check S3 Path mapping", () => {
  // These values are based on actual routes/files. Not all routes necessarily
  // need to be put in this list, but if a new one is found to "break" the
  // regex we're using here, it should be added as a test case.
  const routeLikePaths = [
    "/",
    "/dashboard",
    "/about",
    "/portfolios",
    "/createportfolio",
    "/profile",
    "/sample/style",
  ];

  const assetPaths = [
    "/service-worker.js",
    "/robots.txt",
    "/img/icon-https.svg",
    "/us_flag_small.png",
  ];

  const encodedPaths = [
    {
      path: "/img/greater%20than.988f9120.svg",
      expected: "img/greater than.988f9120.svg",
    },
    {
      path: "/img/less%20than.c8ac0797.svg",
      expected: "img/less than.c8ac0797.svg",
    },
  ];

  it.each(routeLikePaths)(
    "should return index.html for route: %s",
    async (route) => {
      expect(mapToS3Path(route)).toEqual("index.html");
      expect(mapToS3Path(route.slice(1))).toEqual("index.html");
    }
  );
  it.each(assetPaths)(
    "should return the same path, without a slash, for asset: %s",
    async (path) => {
      expect(mapToS3Path(path)).toEqual(path.slice(1));
      expect(mapToS3Path(path.slice(1))).toEqual(path.slice(1));
    }
  );
  it.each(encodedPaths)(
    "should decode URI-encoded path: $path",
    async ({ path, expected }) => {
      expect(mapToS3Path(path)).toEqual(expected);
      expect(mapToS3Path(path.slice(1))).toEqual(expected);
    }
  );
});
