export type SocialSource = { id: string; company: string; actor: string; handle: string; channel: string; products: string[] };
export type SocialPost = {
  id: string;
  company: string;
  channel: string;
  products: string[];
  author: string;
  handle: string;
  repost: boolean;
  text: string;
  date: string;
  url: string;
  platform: string;
  mediaType?: string;
  thumbnail?: string | null;
};
export type MastodonSource = { id:string; company:string; accountId:string; actor:string; handle:string; channel:string; products:string[]; origin:string; profile:string };
export type OfficialChannel = {
  id: string;
  company: string;
  name: string;
  handle: string;
  platform: string;
  url: string;
  role: string;
  note: string;
};

export const socialSources: SocialSource[];
export const mastodonSources: MastodonSource[];
export const majorChannels: OfficialChannel[];
export const suppressedPostUris: string[];
export function parseSocialFeed(payload: unknown, source: SocialSource): SocialPost[];
export function parseMastodonFeed(payload: unknown, source: MastodonSource, toText: (html:string) => string): SocialPost[];
export function recentSocialPosts(posts: SocialPost[], now?: number): SocialPost[];
