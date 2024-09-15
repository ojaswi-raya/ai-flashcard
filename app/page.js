'use client';

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { getStripe } from "./utils/get-stripe";

export default function HomePage() {
  // Function to handle Stripe checkout for the Pro plan
  const handleSubmit = async () => {
    try {
      const checkoutSession = await fetch("/checkout_sessions", {
        method: "POST",
        headers: { origin: "http://localhost:3000" },
      });
      const checkoutSessionJson = await checkoutSession.json();

      const stripe = await getStripe(); // Make sure to define this function elsewhere
      console.log("got here", stripe)
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error("Error during checkout: ", error);
    }
  };

  return (
    <div>
      {/* Header and Navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
          href="/generate"
        >
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Create Flashcards
            </Typography>
            <Typography variant="body1">
              Easily create flashcards from your notes and organize them into
              sets.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Study Mode
            </Typography>
            <Typography variant="body1">
              Practice with a study mode designed to help you retain
              information.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Sync Across Devices
            </Typography>
            <Typography variant="body1">
              Access your flashcards on any device, at any time.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Share with Others
            </Typography>
            <Typography variant="body1">
              Share your flashcard sets with friends and collaborate.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ border: "1px solid gray", padding: 3 }}>
              <Typography variant="h5" gutterBottom>
                Free Plan
              </Typography>
              <Typography variant="body1" gutterBottom>
                Access to basic features including flashcard creation and study
                mode.
              </Typography>
              <Button variant="outlined" color="primary">
                Get Started for Free
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ border: "1px solid gray", padding: 3 }}>
              <Typography variant="h5" gutterBottom>
                Pro Plan
              </Typography>
              <Typography variant="body1" gutterBottom>
                Unlock all features, including syncing across devices and
                priority support.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Upgrade to Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
