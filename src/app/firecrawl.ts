import FirecrawlApp from '@mendable/firecrawl-js';

if (!process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY) {
  throw new Error('NEXT_PUBLIC_FIRECRAWL_API_KEY is not defined');
}

const firecrawl = new FirecrawlApp({
  apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY
});

export default firecrawl;
