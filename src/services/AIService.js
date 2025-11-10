// src/services/aiService.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Send message to AI and return response
 * @param {string} message
 * @param {string} conversationId
 * @returns {string} AI response
 */
export const sendMessageToAI = async (message, conversationId) => {
  try {
    // Using GPT-3.5 turbo as an example
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7
    });

    const aiMessage = response.choices[0]?.message?.content || 'Sorry, I could not respond.';
    return aiMessage;

  } catch (error) {
    console.error('AI Service Error:', error);
    return 'AI service error. Please try again.';
  }
};
