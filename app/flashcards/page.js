'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
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
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserButton } from '@clerk/nextjs';

export default function FlashcardSets() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    } else if (isLoaded && isSignedIn) {
      fetchFlashcardSets();
    }
  }, [isLoaded, isSignedIn]);

  const fetchFlashcardSets = async () => {
    try {
      const userDocRef = doc(collection(db, 'users'), userId);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0f0f0f', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#222' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            LearnlyAI
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => router.push('/generate')}
            sx={{ color: 'white', mr: 2 }}
          >
            Create New
          </Button>
          <UserButton />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
          My Flashcard Sets
        </Typography>
        <Grid container spacing={2}>
          {sets.map((set) => (
            <Grid item xs={12} sm={6} md={4} key={set.id}>
              <Card>
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