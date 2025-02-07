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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { collection, doc, getDoc, updateDoc, arrayRemove, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FlashcardSets() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

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

  const handleDeleteClick = (set, event) => {
    event.stopPropagation(); // Prevent card click when clicking delete button
    setSetToDelete(set);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSetToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!setToDelete) return;

    try {
      setLoading(true);
      const batch = writeBatch(db);
      
      // Remove the set from user's flashcards array
      const userDocRef = doc(db, 'users', userId);
      batch.update(userDocRef, {
        flashcards: arrayRemove(setToDelete)
      });

      // Delete all documents in the set's collection
      const setCollectionRef = collection(db, 'users', userId, setToDelete.name);
      const cardsSnapshot = await getDocs(setCollectionRef);
      cardsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Update local state
      setSets(sets.filter(set => set.id !== setToDelete.id));
      
      setDeleteDialogOpen(false);
      setSetToDelete(null);
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
      alert('Failed to delete flashcard set');
    } finally {
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
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ pt: '80px', pb: '40px' }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ 
            textAlign: 'center', 
            mb: 4, 
            fontFamily: '"Playfair Display", serif',
            fontWeight: 'bold'
          }}
        >
          My Flashcard Sets
        </Typography>
        <Grid container spacing={4}>
          {sets.map((set, index) => (
            <Grid item xs={12} sm={6} md={4} key={set.id || index}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, position: 'relative' }}>
                <CardActionArea onClick={() => router.push(`/flashcards/study/${set.id}`)}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      component="div"
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 500
                      }}
                    >
                      {set.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8,
                    color: '#FFD700',
                    '&:hover': { 
                      backgroundColor: '#FFD700',
                      color: 'white'
                    }
                  }}
                  onClick={(e) => handleDeleteClick(set, e)}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Flashcard Set</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{setToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
