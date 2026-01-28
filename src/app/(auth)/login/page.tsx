"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { createBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleSignIn = async () => {
    if (process.env.NEXT_PUBLIC_AUTH_MODE === "mock") {
      window.location.assign("/dashboard");
      return;
    }

    const supabase = createBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f5f2", p: 6 }}>
      <Stack spacing={3} sx={{ maxWidth: 480, mx: "auto", pt: 10 }}>
        <Typography variant="h3">Welcome back</Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to continue editing and managing your credits.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSignIn}
        >
          Continue with Google
        </Button>
      </Stack>
    </Box>
  );
}
