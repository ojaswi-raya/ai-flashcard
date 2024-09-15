import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { db } from "../../firebase"; // Ensure this points to your Firebase setup
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  // Fetch flashcards from Firestore when the component mounts or when the user changes
  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;

      try {
        const docRef = doc(collection(db, "users"), user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setFlashcards(collections);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcards();
  }, [user]);

  // Handle navigation to individual flashcard sets
  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  // Render the flashcards as a grid of cards
  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
