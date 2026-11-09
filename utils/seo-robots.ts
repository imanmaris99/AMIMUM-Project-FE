export type RobotsMetadata = {
  index: boolean;
  follow: boolean;
};

export function getRobotsMetadata(siteUrl: string): RobotsMetadata {
  const hostname = new URL(siteUrl).hostname.toLowerCase();
  const isStagingHost = hostname.startsWith('staging.') || hostname.includes('-staging.');

  return {
    index: !isStagingHost,
    follow: !isStagingHost,
  };
}
