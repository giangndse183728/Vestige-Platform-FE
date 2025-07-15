import { ChatCompletionRequest, ChatResponse } from './types';
import axios from 'axios';

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const response = await axios.post('/api/chatbot', 
      { message } as ChatCompletionRequest,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}; 