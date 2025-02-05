import { NextResponse } from "next/server";
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.0-pro-001';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ 
      text: response.text() 
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

Create clear and concise questions for the front of the flashcard.
Provide accurate and informative answers for the back of the flashcard.
Ensure that each flashcard focuses on a single concept or piece of information.
Use simple language to make the flashcards accessible to a wide range of learners.
Include a variety of question types, such as definitions, examples, comparisons, and applications.
Avoid overly complex or ambiguous phrasing in both questions and answers.
When appropriate, use mnemonics or memory aids to help reinforce the information.
Tailor the difficulty level of the flashcards to the user's specified preferences.
If given a body of text, extract the most important and relevant information for the flashcards.
Aim to create a balanced set of flashcards that covers the topic comprehensively.
Consider the cognitive load of the learner; ensure that each flashcard can be understood quickly.
Incorporate visual elements if applicable to enhance the learning experience.
Verify the accuracy of the information provided in each flashcard.
Only generate 10 flashcards.

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

const genAI = new GoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,  // Ensure your environment variable is set correctly
});

const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
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

export async function POST(req) {
    try {
        const data = await req.text();

        // Combine system prompt with user input
        const userMessage = `${systemPrompt}\n\nUser Input:\n${data}`;

        // Start a new chat session with the model
        const chat = await genAI
            .getGenerativeModel({ model: MODEL_NAME })  // Replace 'YOUR_MODEL_NAME' with the actual model name
            .startChat({
                generationConfig,
                safetySettings,
            });

        // Send the user message to the chat instance
        const result = await chat.sendMessage(userMessage);

        // Parse the response to extract flashcards
        const flashcards = JSON.parse(result.response.text());

        // Return the flashcards as a JSON response
        return NextResponse.json(flashcards);
    } catch (error) {
        // Handle errors (e.g., API request failures)
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}
