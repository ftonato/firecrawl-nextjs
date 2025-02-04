'use client';

import {FormEvent, useState, useEffect} from 'react';
import Image from 'next/image';
import FirecrawlApp from '@mendable/firecrawl-js';

export default function Home() {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('Extract the most important information from the page');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showApiInput, setShowApiInput] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('firecrawl_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsFirstVisit(false);
    } else {
      // Show welcome message after a brief delay
      setTimeout(() => setShowWelcome(true), 500);
    }
  }, []);

  const extract = async () => {
    if (!apiKey) {
      setShowApiInput(true);
      throw new Error('Please set your Firecrawl API key first');
    }

    try {
      const firecrawl = new FirecrawlApp({
        apiKey: apiKey,
      });

      const response = await firecrawl.extract([url], {
        prompt,
      });

      if (!response.success) {
        throw new Error(`Failed to extract: ${response.error}`);
      }

      return response;
    } catch (error) {
      // Handle network errors or other API errors
      if (error instanceof Error) {
        if (error.message.includes('401') || 
            error.message.toLowerCase().includes('unauthorized') ||
            error.message.toLowerCase().includes('invalid api key')) {
          setShowApiInput(true);
          throw new Error('Invalid or expired API key. Please check your Firecrawl API key or get a new one from firecrawl.dev');
        }
      }
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null); // Clear previous results

    try {
      const response = await extract();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult(`Error: ${errorMessage}`);
      
      // If it's an API key error, show the error in red
      if (errorMessage.toLowerCase().includes('api key')) {
        setResult(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySave = () => {
    localStorage.setItem('firecrawl_api_key', apiKey);
    setShowApiInput(false);
    setIsFirstVisit(false);
    setShowWelcome(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-8'>
      <main className='max-w-4xl mx-auto flex flex-col gap-8 items-center relative'>
        <h1 className='text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3 mt-12'>
          Firecrawl + Next.js
          <span role='img' aria-label='fire'>🔥</span>
        </h1>

        {/* Welcome Message Overlay */}
        {showWelcome && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='max-w-md w-full mx-4 animate-scale-up'>
              <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-orange-500 relative'>
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-1 rounded-full text-sm font-medium'>
                  Welcome to Firecrawl! 👋
                </div>
                <div className='mt-4 text-center'>
                  <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                    Let's get you started
                  </h2>
                  <p className='text-gray-600 dark:text-gray-300 mb-6'>
                    To use Firecrawl's extraction capabilities, you'll need to set up your API key first. 
                    You can get one for free at{' '}
                    <a
                      href='https://firecrawl.dev'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-orange-500 hover:underline font-medium'
                    >
                      firecrawl.dev
                    </a>
                  </p>
                  <button
                    onClick={() => setShowApiInput(true)}
                    className='w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 group'
                  >
                    <Image
                      src='/key.svg'
                      alt='Key icon'
                      width={20}
                      height={20}
                      className='text-white group-hover:scale-110 transition-transform'
                    />
                    Set up your API Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 transition-all duration-300 ${
          isFirstVisit ? 'opacity-50 pointer-events-none' : ''
        }`}>
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

        {/* API Key Modal */}
        {showApiInput && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in z-50'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full animate-slide-up'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-2 bg-orange-100 dark:bg-orange-900 rounded-lg'>
                  <Image aria-hidden src='/key.svg' alt='Key icon' width={24} height={24} className='text-orange-500' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Set Your API Key</h3>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>
                Enter your Firecrawl API key below. You can get one from{' '}
                <a
                  href='https://firecrawl.dev'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-orange-500 hover:underline'
                >
                  firecrawl.dev
                </a>
              </p>
              <input
                type='text'
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder='fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent'
              />
              <div className='flex justify-end gap-2'>
                <button
                  onClick={() => {
                    setShowApiInput(false);
                    if (!apiKey) setShowWelcome(true);
                  }}
                  className='px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  Cancel
                </button>
                <button
                  onClick={handleApiKeySave}
                  disabled={!apiKey}
                  className='px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Save
                </button>
              </div>
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
        <button
          onClick={() => setShowApiInput(true)}
          className={`flex items-center gap-2 hover:underline hover:underline-offset-4 ${
            !apiKey ? 'animate-bounce text-orange-500 font-medium' : ''
          }`}
        >
          <Image
            aria-hidden
            src='/key.svg'
            alt='Key icon'
            width={16}
            height={16}
            className={!apiKey ? 'text-orange-500' : ''}
          />
          {apiKey ? 'Change API Key' : 'Set API Key'}
        </button>
      </footer>
    </div>
  );
}
