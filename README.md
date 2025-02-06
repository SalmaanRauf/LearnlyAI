# LearnlyAI - Flashcard Generator

Welcome to **LearnlyAI**, a cutting-edge SaaS application designed to transform your study sessions by converting your text into smart, concise flashcards. This project leverages the power of Next.js, Firebase, and AI to provide an intuitive and seamless experience for users.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technical Overview](#technical-overview)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with LearnlyAI, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/learnlyai.git
   cd learnlyai
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Effortless Text Input:** Simply enter your text, and let our intuitive software handle the rest. Creating flashcards has never been so effortless.
- **Intelligent Flashcards:** Powered by AI, our tool expertly distills your text into clear, concise flashcards, perfectly tailored for effective studying.
- **Anywhere, Anytime Access:** Access your flashcards from any device, at any time. Study seamlessly wherever you are.
- **Subscription Plans:** Choose between Basic and Pro plans to suit your needs, with the Pro plan currently free as I develop additional features.

## Technical Overview

### Frontend

- **Framework:** Built with [Next.js](https://nextjs.org/), a React framework for production.
- **Styling:** Utilizes Material-UI for a modern and responsive design.
- **Authentication:** Integrated with Clerk for user authentication and management.

### Backend

- **Database:** Uses Firebase Firestore for storing user data and flashcards.
- **AI Integration:** Leverages Google Generative AI for creating flashcards from user input.
- **Payment Processing:** Integrated with Stripe for handling subscription payments.

### Code Structure

- **Pages:** The application is structured with Next.js pages for different functionalities like generating flashcards, viewing flashcard sets, and subscription management.
- **Components:** Reusable components are used throughout the application to maintain consistency and modularity.

### Key Files

- **`app/page.js`:** Main landing page with a hero section and feature highlights.
- **`app/generate/page.js`:** Page for generating flashcards from user input.
- **`app/api/generate/route.js`:** API route for handling flashcard generation requests.
- **`firebase.js`:** Firebase configuration and initialization.
- **`theme.js`:** Custom Material-UI theme configuration.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/), from the creators of Next.js. Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

We welcome contributions from the community! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---
Thanks For Checking Out My App!
