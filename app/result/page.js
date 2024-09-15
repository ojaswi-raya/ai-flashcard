"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const ResultPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!router || !router.asPath) return;

      const searchParams = new URLSearchParams(router.asPath.split("?")[1]);
      const session_id = searchParams.get("session_id");

      if (!session_id) {
        setError("Session ID not found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/checkout_sessions?session_id=${session_id}`);
        const sessionData = await res.json();

        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error || "Failed to retrieve session.");
        }
      } catch (err) {
        setError("An error occurred while retrieving the session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();

    // Trigger session re-fetch when the page is navigated back to
    const handleRouteChange = () => {
      setSession(null);
      setLoading(true);
      fetchSessionData();
    };

    router.events?.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  // Loading state
  if (loading) {
    return <CircularProgress />;
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  // Ensure `session` is not null before accessing its properties
  if (!session) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Session data not available.</Typography>
      </Container>
    );
  }

  // Main content
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      {session.payment_status === "paid" ? (
        <>
          <Typography variant="h4">Thank you for your purchase!</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Your payment was successful. You should receive a confirmation email shortly.
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment not completed</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              It seems that your payment is still pending or incomplete.
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResultPage;
