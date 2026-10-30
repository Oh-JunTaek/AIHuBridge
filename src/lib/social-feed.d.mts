export type SocialSource = { id: string; company: string; actor: string; handle: string; channel: string; products: string[] };
export type SocialPost = { id: string; company: string; channel: string; products: string[]; author: string; handle: string; repost: boolean; text: string; date: string; url: string };
export const socialSources: SocialSource[];
export const suppressedPostUris: string[];
export function parseSocialFeed(payload: unknown, source: SocialSource): SocialPost[];
