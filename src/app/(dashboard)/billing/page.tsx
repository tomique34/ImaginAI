"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

const packages = [
  {
    name: "Starter",
    credits: 30,
    productId: process.env.NEXT_PUBLIC_POLAR_STARTER_ID,
  },
  {
    name: "Pro",
    credits: 100,
    productId: process.env.NEXT_PUBLIC_POLAR_PRO_ID,
  },
  {
    name: "Power",
    credits: 200,
    productId: process.env.NEXT_PUBLIC_POLAR_POWER_ID,
  },
];

export default function Billing() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCheckout = async (productId?: string) => {
    if (!productId) return;

    setLoadingId(productId);
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      setLoadingId(null);
      return;
    }

    const payload = await response.json();
    if (payload?.checkoutUrl) {
      window.location.assign(payload.checkoutUrl);
    } else {
      setLoadingId(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f5f2", p: 6 }}>
      <Stack spacing={2} sx={{ maxWidth: 960, mx: "auto" }}>
        <Typography variant="h3">Billing</Typography>
        {packages.map((item) => (
          <Box
            key={item.name}
            sx={{
              borderRadius: 3,
              padding: 2.5,
              backgroundColor: "#fff",
              border: "1px solid rgba(27, 58, 87, 0.08)",
            }}
          >
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2">{item.credits} credits</Typography>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              size="small"
              disabled={!item.productId || loadingId === item.productId}
              onClick={() => handleCheckout(item.productId)}
            >
              Buy credits
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
