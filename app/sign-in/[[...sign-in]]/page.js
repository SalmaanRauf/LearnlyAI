import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <Box sx={{ bgcolor: '#0f0f0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <AppBar position="static" sx={{ bgcolor: '#222', width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            LearnlyAI
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ textAlign: 'center', mt: 8, color: 'white' }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign In
          </Typography>
          <Box sx={{ width: '100%', mt: 2 }}>
            <SignIn />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
