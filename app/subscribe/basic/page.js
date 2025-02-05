"use client";

import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function BasicPlan() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ pt: 10 }}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Basic Plan - Free for Now!
        </Typography>
        <Typography variant="body1" gutterBottom>
          The Basic plan is free for now while we build additional features and subscription options.
        </Typography>
        <Button variant="contained" sx={{ mt: 4 }} onClick={() => router.push('/')}>
          Return Home
        </Button>
      </Box>
    </Container>
  );
}