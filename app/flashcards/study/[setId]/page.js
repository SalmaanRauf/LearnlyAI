"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Button
} from "@mui/material";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export default function StudySet({ params }) {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    } else if (isLoaded && isSignedIn) {
      fetchFlashcards();
    }
  }, [isLoaded, isSignedIn]);

  const fetchFlashcards = async () => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        // Look up the flashcard set by id (from route params)
        const flashcardSet = userData.flashcards.find(
          (set) => set.id === params.setid
        );
        if (!flashcardSet || !flashcardSet.name?.trim()) {
          console.error("Flashcard set not found or invalid");
          setLoading(false);
          return;
        }
        const setName = flashcardSet.name.trim();
        const cardsRef = collection(db, "users", userId, setName);
        const cardsSnapshot = await getDocs(cardsRef);
        const cards = cardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setFlashcards(cards);
        setFlipped(new Array(cards.length).fill(false));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", pt: 4 }}>
      {/* Optional Back button.
          If you feel this looks too much like a header, either remove it or restyle it. */}
      <Container maxWidth="md">
        <Button
          onClick={() => router.push("/flashcards")}
          variant="contained"
          sx={{ mb: 2 }}
        >
          Back to Sets
        </Button>
        <Grid container spacing={2}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={flashcard.id || `card-${index}`}>
              <Card sx={{ perspective: "1000px" }}>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "200px",
                      transition: "transform 0.6s",
                      transformStyle: "preserve-3d",
                      transform: flipped[index]
                        ? "rotateY(180deg)"
                        : "rotateY(0)"
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
      </Container>
    </Box>
  );
}