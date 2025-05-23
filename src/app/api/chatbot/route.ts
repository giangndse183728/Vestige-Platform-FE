import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

// Define error interface
interface ErrorWithMessage {
  message: string;
}

// Type guard for ErrorWithMessage
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

// Extract error message helper
function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) return error.message;
  return 'Unknown error occurred';
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.OPENROUTER_API_KEY || '';
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: message
            }
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            'X-Title': 'AI Chatbot',
          }
        }
      );
      
      // Return the response
      return NextResponse.json({ 
        response: response.data.choices[0].message 
      });
    } catch (error: unknown) {
      console.error('OpenRouter API error:', error);
      
      // Handle authentication errors specifically
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          return NextResponse.json({ 
            response: { 
              content: "Authentication failed with OpenRouter. Please check that you're using a valid API key.",
              role: "assistant"
            } 
          }, { status: 200 });
        }
      }
      
      return NextResponse.json({ 
        response: { 
          content: `Error with AI service: ${getErrorMessage(error)}`,
          role: "assistant"
        } 
      }, { status: 200 });
    }
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: `Failed to process request: ${getErrorMessage(error)}` },
      { status: 500 }
    );
  }
}