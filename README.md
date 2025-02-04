# Firecrawl + Next.js Content Extraction Project

This project combines Firecrawl and NextJS to create a simple content extraction application. It allows users to input URLs and extract the most important information from web pages.

## Prerequisites

- Node.js (version 18.17 or higher)
- A code editor (like Cursor or VS Code)
- A Firecrawl API key (get it from [firecrawl.dev](https://firecrawl.dev))

## Getting Started

### 1. Create a New Project

```bash
npx create-next-app@latest
```

Answer the prompts as follows:
- Project name: `firecrawl-nextjs` (or your preferred name)
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias (@/*): Yes

### 2. Install Dependencies

Navigate to your project directory and install Firecrawl:

```bash
cd firecrawl-nextjs
npm install @mendable/firecrawl-js
```

### 3. Environment Setup

Create a `.env` file in your project root and add your Firecrawl API key:

```env
NEXT_PUBLIC_FIRECRAWL_API_KEY=your_api_key_here
```

### 4. Project Structure

Create these essential files:

```typescript:src/app/firecrawl.ts
import FirecrawlApp from '@mendable/firecrawl-js';

if (!process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY) {
  throw new Error('NEXT_PUBLIC_FIRECRAWL_API_KEY is not defined');
}

const firecrawl = new FirecrawlApp({
  apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY
});

export default firecrawl;
```

Update `src/app/page.tsx` with the provided UI components and extraction logic.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Clean, responsive UI with dark mode support
- Real-time content extraction
- Loading states and error handling
- Results displayed in a scrollable card
- AI-powered content extraction
- Automatic important information detection
- Customizable extraction prompts

## Usage

1. Enter a valid URL (including http:// or https://)
2. Customize the extraction prompt (or use the default)
3. Click "Extract"
4. View the extracted content in the results card
5. The content will be extracted based on your prompt

## Troubleshooting

- **API Key Error**: Verify your `.env` file is properly configured
- **Page Not Updating**: Try restarting the development server
- **Invalid URL**: Ensure URLs include the protocol (http:// or https://)
- **Extraction Failed**: Make sure the URL is accessible and contains readable content

## Learn More

- [Firecrawl Documentation](https://docs.firecrawl.dev)
- [Firecrawl Blog](https://www.firecrawl.dev/blog)
- [Next.js Documentation](https://nextjs.org/docs)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Important: When deploying, remember to add your `NEXT_PUBLIC_FIRECRAWL_API_KEY` to your deployment environment variables.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
