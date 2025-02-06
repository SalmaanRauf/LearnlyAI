'use client';

import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LearnMore() {
  const router = useRouter();
  
  return (
    <Container maxWidth="md" sx={{ pt: 10, minHeight: 'calc(100vh - 64px)' }}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          About LearnlyAI
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ textAlign: 'center', maxWidth: 600 }}
        >
          LearnlyAI is designed to transform your study sessions by converting
          your text into smart, concise flashcards. Our intuitive tool helps you
          capture essential concepts quickly and efficiently. Whether you&apos;re
          preparing for an exam or looking for a better way to organize your notes,
          LearnlyAI offers a smooth and engaging experience tailored to your needs.
        </Typography>
        <Button variant="contained" sx={{ mt: 4 }} onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}