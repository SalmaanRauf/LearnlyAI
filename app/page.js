'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import Head from 'next/head';

export default function FlashcardSaaS() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <>
      <Head>
        <title>LearnlyAI - Create Flashcards Easily</title>
      </Head>

      {/* Hero Section */}
      <Box
        sx={{ 
          textAlign: 'center', 
          py: 12, 
          background: 'linear-gradient(90deg, #1e1e1e 0%, #363636 100%)' 
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to LearnlyAI
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ mt: 4, mr: 2 }} 
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          sx={{ mt: 4 }}
        >
          Learn More
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(180deg, #121212, #1c1c1c)' }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Effortless Text Input
              </Typography>
              <Typography color="text.secondary">
                Simply enter your text, and let our intuitive software handle the rest. Creating flashcards has never been so effortless.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Intelligent Flashcards
              </Typography>
              <Typography color="text.secondary">
                Powered by AI, our tool expertly distills your text into clear, concise flashcards, perfectly tailored for effective studying.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Anywhere, Anytime Access
              </Typography>
              <Typography color="text.secondary">
                Whether you're on the go or at home, access your flashcards from any device, at any time. Study seamlessly wherever you are.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 8, textAlign: 'center', background: 'linear-gradient(180deg, #181818, #121212)' }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 6 }}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={4}>
                <Typography variant="h5" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  $5 / month
                </Typography>
                <Typography color="text.secondary">
                  Access to basic flashcard features and limited storage.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 4 }} href="/subscribe/basic">
                  Choose Basic
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={4}>
                <Typography variant="h5" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  $10 / month
                </Typography>
                <Typography color="text.secondary">
                  Unlimited flashcards and storage.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 4 }} href="/subscribe/pro">
                  Choose Pro
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
