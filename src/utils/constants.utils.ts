export const CDN_ENDPOINT = "https://cdn.sammwy.com/cat-synth";

export const getCDNPath = (path: string) => {
  if (path.startsWith("/")) {
    path = path.substring(1);
  }

  return `${CDN_ENDPOINT}/${path}`;
};

export const getCDNPathOrNull = (path: string | null | undefined) => {
  return path ? getCDNPath(path) : path;
};
