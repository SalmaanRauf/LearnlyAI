"use client";

import { useState, useEffect } from "react";
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
  const { userId } = useAuth(); // Obtain the current user's ID from Clerk
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardSetName, setFlashcardSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [flipped, setFlipped] = useState([]);

  // Update the flipped state whenever flashcards change.
  useEffect(() => {
    if (flashcards.length > 0) {
      setFlipped(Array(flashcards.length).fill(false));
    }
  }, [flashcards]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text
      });
      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }
      const data = await response.json();
      setFlashcards(data.flashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const saveFlashcards = async () => {
    const sanitizedSetName = flashcardSetName.trim();
    if (!sanitizedSetName) {
      alert("Please enter a name for your flashcard set.");
      return;
    }
    try {
      // Use the userId from Clerk
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      let collections = userDocSnap.exists() ? userDocSnap.data().flashcards || [] : [];

      if (collections.find((f) => f.name === sanitizedSetName)) {
        alert("Flashcard collection with the same name already exists.");
        return;
      } else {
        collections.push({
          id: crypto.randomUUID(),
          name: sanitizedSetName
        });
        const batch = writeBatch(db);
        batch.set(userDocRef, { flashcards: collections }, { merge: true });

        // Replace the placeholder with the actual userId from Clerk.
        const colRef = collection(db, "users", userId, sanitizedSetName);
        flashcards.forEach((flashcard) => {
          const cardDocRef = doc(colRef);
          batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        alert("Flashcards saved successfully!");
        handleCloseDialog();
        setFlashcardSetName("");
      }
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  const handleCardClick = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  return (
    <>
      <SignedIn>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Generate Flashcards
            </Typography>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
              Generate Flashcards
            </Button>
          </Box>

          {flashcards.length > 0 && (
            <>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Generated Flashcards
                </Typography>
                <Grid container spacing={2}>
                  {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`flashcard-${index}`}>
                      <Card sx={{ perspective: "1000px" }}>
                        <CardActionArea onClick={() => handleCardClick(index)}>
                          <CardContent
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: "200px",
                              transition: "transform 0.6s",
                              transformStyle: "preserve-3d",
                              transform: flipped[index] ? "rotateY(180deg)" : "rotateY(0)"
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              <Typography variant="h5" component="div">
                                {flashcard.front}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                transform: "rotateY(180deg)",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              <Typography variant="h5" component="div">
                                {flashcard.back}
                              </Typography>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
                  Save Flashcards
                </Button>
              </Box>
            </>
          )}

          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Save Flashcard Set</DialogTitle>
            <DialogContent>
              <DialogContentText>Please enter a name for your flashcard set.</DialogContentText>
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
              <Button onClick={saveFlashcards} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
