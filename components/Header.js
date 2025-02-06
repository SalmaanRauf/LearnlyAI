'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            LearnlyAI
          </Typography>
          <Button color="inherit" onClick={() => router.push('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => router.push('/generate')}>
            Generate
          </Button>
          <Button color="inherit" onClick={() => router.push('/flashcards')}>
            My Flashcards
          </Button>
        </Box>
        <Box>
          <SignedOut>
            <Button color="inherit" onClick={() => router.push('/sign-in')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => router.push('/sign-up')} sx={{ ml: 1 }}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
