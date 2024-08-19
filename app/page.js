import { AppBar, Toolbar, Typography, Button, Box, Grid, Container, Paper } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Head from 'next/head';

export default function FlashcardSaaS() {
  return (
    <>
      <Head>
        <title>LearnlyAI - Create Flashcards Easily</title>
      </Head>
      
      <AppBar position="static" sx={{ bgcolor: '#222' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            LearnlyAI
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ color: 'white' }}>Login</Button>
            <Button color="inherit" href="/sign-up" sx={{ color: 'white', ml: 1 }}>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 12, bgcolor: '#0f0f0f', color: 'white' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to LearnlyAI
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="secondary" sx={{ mt: 4, mr: 2, borderRadius: '50px', px: 4 }} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="secondary" sx={{ mt: 4, borderRadius: '50px', px: 4, color: 'white', borderColor: 'white' }}>
          Learn More
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#1c1c1c', py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 6 }}>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Effortless Text Input</Typography>
              <Typography sx={{ color: 'grey.400' }}>
                Simply enter your text, and let our intuitive software handle the rest. Creating flashcards has never been so effortless.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Intelligent Flashcards</Typography>
              <Typography sx={{ color: 'grey.400' }}>
                Powered by AI, our tool expertly distills your text into clear, concise flashcards, perfectly tailored for effective studying.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Anywhere, Anytime Access</Typography>
              <Typography sx={{ color: 'grey.400' }}>
                Whether you're on the go or at home, access your flashcards from any device, at any time. Study seamlessly wherever you are.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: '#121212', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', mb: 6 }}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: 3 }}>
                <Typography variant="h5" sx={{ color: 'white' }} gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" sx={{ color: 'grey.300' }} gutterBottom>
                  $5 / month
                </Typography>
                <Typography sx={{ color: 'grey.400' }}>
                  Access to basic flashcard features and limited storage.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 4, borderRadius: '50px', px: 4 }} href="/subscribe/basic">
                  Choose Basic
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: 3 }}>
                <Typography variant="h5" sx={{ color: 'white' }} gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h6" sx={{ color: 'grey.300' }} gutterBottom>
                  $10 / month
                </Typography>
                <Typography sx={{ color: 'grey.400' }}>
                  Unlimited flashcards and storage.
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 4, borderRadius: '50px', px: 4 }} href="/subscribe/pro">
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
