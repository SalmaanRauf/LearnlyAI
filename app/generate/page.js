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
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { doc, collection, writeBatch, getDoc } from "firebase/firestore";
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
    // Simulate an API call with a timeout (replace with your own logic)
    setTimeout(() => {
      const sentences = text.split(".").filter(sentence => sentence.trim());
      const generated = sentences.map((sentence, index) => ({
        id: index,
        front: sentence.trim(),
        back: "Answer for " + sentence.trim()
      }));
      setFlashcards(generated);
      setLoading(false);
    }, 1000);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const saveFlashcards = async () => {
    // Save flashcards logic (e.g., using Firebase) goes here.
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
