import { NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.0-pro-001';
const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  throw new Error('Google AI API key is not configured.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

- Create clear and concise questions for the front of the flashcard.
- Provide accurate and informative answers for the back of the flashcard.
- Ensure that each flashcard focuses on a single concept or piece of information.
- Use simple language to make the flashcards accessible to a wide range of learners.
- Include a variety of question types, such as definitions, examples, comparisons, and applications.
- Avoid overly complex or ambiguous phrasing in both questions and answers.
- When appropriate, use mnemonics or memory aids to help reinforce the information.
- Tailor the difficulty level of the flashcards to the user's specified preferences.
- If given a body of text, extract the most important and relevant information for the flashcards.
- Aim to create a balanced set of flashcards that covers the topic comprehensively.
- Consider the cognitive load of the learner; ensure that each flashcard can be understood quickly.
- Incorporate visual elements if applicable to enhance the learning experience.
- Verify the accuracy of the information provided in each flashcard.
- Only generate 10 flashcards.

Return in the following JSON format:
{
  "flashcards": [
    {
      "front": "str",
      "back": "str"
    }
  ]
}
`;

export async function POST(req) {
  try {
    const data = await req.text();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.8,
      maxOutputTokens: 1024,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt + '\n\n' + data }],
        },
      ],
      generationConfig,
      safetySettings,
    });

    // If result.response.text is a function, call it to obtain the actual text.
    const rawResponseText =
      typeof result.response.text === 'function'
        ? await result.response.text()
        : result.response.text;

    // Clean the response text in case it is wrapped in markdown formatting (e.g. ```json ... ```).
    let responseText = rawResponseText.trim();
    if (responseText.startsWith('```')) {
      // Remove the starting backticks and optional "json" specifier.
      responseText = responseText.replace(/^```(json)?\s*/, '');
      // Remove trailing backticks.
      responseText = responseText.replace(/\s*```$/, '');
    }

    // Parse the cleaned text as JSON.
    const flashcards = JSON.parse(responseText);

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
