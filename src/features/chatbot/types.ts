export interface ChatResponse {
    response: {
      content: string;
      role: string;
    };
  }
  
  export interface ChatCompletionRequest {
    message: string;
  } 

  export interface Message {
    role: 'user' | 'assistant';
    content: string;
  }