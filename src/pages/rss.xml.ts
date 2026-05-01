import rss from "@astrojs/rss";
import { siteConfig } from "../data/site";
import { withBase } from "../utils/links";
import { getPublishedLogs } from "../utils/posts";

export async function GET(context: { site?: URL }) {
  const posts = await getPublishedLogs();

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site?.toString() || "https://example.github.io",
    items: posts.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.pubDate,
      description: entry.data.description,
      link: withBase(`/logs/${entry.id}`)
    })),
    customData: `<language>${siteConfig.locale}</language>`
  });
}
