'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardActionArea,
} from '@mui/material'
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'  // Adjusted the path to correctly reference the Firebase config

export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [flipped, setFlipped] = useState([])

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data.flashcards)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    try {
      const batch = writeBatch(db)
      const userDocRef = doc(collection(db, 'users'), 'user.id')  // replace 'user.id' with actual user ID
      const userDocSnap = await getDoc(userDocRef)

      let collections = userDocSnap.exists() ? userDocSnap.data().flashcards || [] : []
      
      if (collections.find(f => f.name === setName)) {
        alert('Flashcard collection with the same name already exists.')
        return
      } else {
        collections.push({ name: setName })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }

      const colRef = collection(userDocRef, setName)
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef)
        batch.set(cardDocRef, flashcard)
      })

      await batch.commit()

      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setSetName('')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  const handleCardClick = (index) => {
    const newFlipped = [...flipped]
    newFlipped[index] = !newFlipped[index]
    setFlipped(newFlipped)
  }

  return (
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
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
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ perspective: '1000px' }}>
                    <CardActionArea
                      onClick={() => {
                        handleCardClick(index)
                      }}
                    >
                      <CardContent
                        sx={{
                          div: {
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            backfaceVisibility: 'hidden',
                          }}
                        >
                          <Typography variant="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            transform: 'rotateY(180deg)',
                            backfaceVisibility: 'hidden',
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

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
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
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
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
  )
}
