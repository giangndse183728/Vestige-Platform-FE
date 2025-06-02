import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['media:thumbnail', 'thumbnail'],
      ['content:encoded', 'content'],
      ['enclosure', 'enclosure'],
      ['image', 'image'],
      ['description', 'description'],
    ],
  },
});

const FEEDS = [
  { url: 'https://hypebeast.com/feed', source: 'Hypebeast' },
  { url: 'https://www.gq.com/feed/rss', source: 'GQ' },
];

function extractImageFromDescription(description: string): string | null {
  if (!description) return null;
  
  // Look for img tag with src attribute
  const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  
  return null;
}

export async function GET() {
  try {
    const feedData = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const parsed = await parser.parseURL(feed.url);

          const items = parsed.items.map((item) => {
            let image: string | null = null;

            if (feed.source === 'GQ') {
              // GQ uses media:thumbnail with url attribute
              if (item.thumbnail?.$?.url) {
                image = item.thumbnail.$.url;
              }
            } else if (feed.source === 'Hypebeast') {
              // Try to get image from description first (most reliable for Hypebeast)
              if (item.description) {
                image = extractImageFromDescription(item.description);
              }
              // Fallback to media:content
              if (!image && item.media?.$?.url) {
                image = item.media.$.url;
              }
              // Fallback to enclosure
              if (!image && item.enclosure?.url) {
                image = item.enclosure.url;
              }
            }

            // Fallback to image field if no other image found
            if (!image && item.image) {
              image = item.image;
            }

            // Ensure image URL is absolute
            if (image && !image.startsWith('http')) {
              if (feed.source === 'Hypebeast') {
                image = `https://hypebeast.com${image}`;
              } else if (feed.source === 'GQ') {
                image = `https://www.gq.com${image}`;
              }
            }

            return {
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              description: item.contentSnippet || item.content,
              image,
              source: feed.source,
            };
          });

          return {
            source: feed.source,
            items,
          };
        } catch (err) {
          console.error(`Error fetching ${feed.source}:`, err);
          return {
            source: feed.source,
            items: [],
            error: true,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: feedData,
    });
  } catch (err) {
    console.error('Feed fetch error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
