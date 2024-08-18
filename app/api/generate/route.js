import { NextResponse } from "next/server";
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from '@google/generative-ai';


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
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,  // Use environment variable for security
});

const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

export async function POST(req) {
    try {
        const data = await req.text();

        // Combine system prompt with user input
        const userMessage = `${systemPrompt}\n\nUser Input:\n${data}`;

        // Call the Google Generative AI API
        const completion = await genAI.generateText({
            prompt: userMessage,
            temperature: generationConfig.temperature,
            topK: generationConfig.topK,
            topP: generationConfig.topP,
            maxOutputTokens: generationConfig.maxOutputTokens,
        });

        // Parse the response from Google Generative AI API
        const flashcards = JSON.parse(completion.candidates[0].output);

        // Return the flashcards as a JSON response
        return NextResponse.json(flashcards);
    } catch (error) {
        // Handle errors (e.g., API request failures)
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}
