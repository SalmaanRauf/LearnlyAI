import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ textAlign: 'center', mt: 8 }}
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
