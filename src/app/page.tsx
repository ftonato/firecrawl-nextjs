'use client';

import {FormEvent, useState} from 'react';
import Image from 'next/image';
import firecrawl from './firecrawl';

export default function Home() {
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('Extract the most important information from the page');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const extract = async () => {
    const response = await firecrawl.extract([url], {
      prompt,
    });

    if (!response.success) {
      throw new Error(`Failed to extract: ${response.error}`);
    }

    return response;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await extract();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-8'>
      <main className='max-w-4xl mx-auto flex flex-col gap-8 items-center'>
        <h1 className='text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3 mt-12'>
          Firecrawl + NextJS
          <span role='img' aria-label='fire'>
            🔥
          </span>
        </h1>

        <div className='w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='url' className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                Enter URL to extract
              </label>
              <input
                type='url'
                id='url'
                value={url}
                onChange={e => setUrl(e.target.value)}
                autoComplete='off'
                placeholder='https://example.com'
                className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition'
                required
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='prompt' className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                Extraction Prompt
              </label>
              <textarea
                id='prompt'
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder='What information would you like to extract?'
                className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition min-h-[100px] resize-y'
                required
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {isLoading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Extract'
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className='w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-4'>
            <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>Results</h2>
            <div className='max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
              <pre className='text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap'>
                {result}
              </pre>
            </div>
          </div>
        )}
      </main>
      <footer className='row-start-3 mt-2 flex gap-6 flex-wrap items-center justify-center'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://www.firecrawl.dev/blog'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image aria-hidden src='/file.svg' alt='File icon' width={16} height={16} />
          Learn
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://docs.firecrawl.dev'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image aria-hidden src='/window.svg' alt='Window icon' width={16} height={16} />
          Docs
        </a>
      </footer>
    </div>
  );
}
