'use client';

import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
} from '@mui/material';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function FlashcardSets() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlashcardSets = async () => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const flashcardSets = userData.flashcards || [];
        setSets(flashcardSets);
      } else {
        setSets([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    } else if (isLoaded && isSignedIn) {
      fetchFlashcardSets();
    }
  }, [isLoaded, isSignedIn, router, userId, fetchFlashcardSets]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ pt: '80px', pb: '40px' }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: 'center', mb: 4, fontFamily: '"Playfair Display", serif' }}
        >
          My Flashcard Sets
        </Typography>
        <Grid container spacing={4}>
          {sets.map((set, index) => (
            <Grid item xs={12} sm={6} md={4} key={set.id || index}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardActionArea onClick={() => router.push(`/flashcards/study/${set.id}`)}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {set.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
