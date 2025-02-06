"use client";

import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from "@mui/material";
import { SignedIn, useAuth } from "@clerk/nextjs";
import {
  doc,
  collection,
  writeBatch,
  updateDoc,
  arrayUnion,
  getDoc
} from "firebase/firestore";
import { db } from "../../firebase";

export default function Generate() {
  const { userId } = useAuth();
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardSetName, setFlashcardSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateFlashcards = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text
      });
      const data = await response.json();
      // Expecting { flashcards: [ { front, back }, ... ] }
      const generated = data.flashcards.map((card, index) => ({
        id: index,
        ...card
      }));
      setFlashcards(generated);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const saveFlashcards = async () => {
    if (!userId) return;
    if (!flashcardSetName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }
    if (flashcards.length === 0) {
      alert("No flashcards to save.");
      return;
    }

    const setId = "set-" + Date.now();
    const userDocRef = doc(db, "users", userId);
    const batch = writeBatch(db);

    // Update the user's flashcard sets array using arrayUnion.
    batch.update(userDocRef, {
      flashcards: arrayUnion({
        id: setId,
        name: flashcardSetName,
        createdAt: new Date().toISOString()
      })
    });

    // Create a document in a subcollection (named after the set) for each flashcard.
    flashcards.forEach((card) => {
      const cardRef = doc(collection(db, "users", userId, flashcardSetName));
      batch.set(cardRef, card);
    });

    try {
      await batch.commit();
      alert("Flashcards saved successfully!");
      // Clear flashcards and set name after save
      setFlashcards([]);
      setFlashcardSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("Failed to save flashcards.");
    }
    handleCloseDialog();
  };

  return (
    <SignedIn>
      <Container maxWidth="md" sx={{ pt: "80px", pb: "40px" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontFamily: '"Playfair Display", serif' }}
          >
            Generate Your Flashcards
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Enter your content below and let our AI create flashcards for you.
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Enter Text"
            multiline
            minRows={4}
            fullWidth
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ backgroundColor: "background.paper", borderRadius: 2 }}
          />
        </Box>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerateFlashcards}
            sx={{ mr: 2 }}
          >
            Generate Flashcards
          </Button>
        </Box>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {flashcards.length > 0 && (
          <>
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Your Flashcards
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {flashcards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {card.front}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.back}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
                Save Flashcards
              </Button>
            </Box>
          </>
        )}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcard Set</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={flashcardSetName}
              onChange={(e) => setFlashcardSetName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveFlashcards} color="secondary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </SignedIn>
  );
}
