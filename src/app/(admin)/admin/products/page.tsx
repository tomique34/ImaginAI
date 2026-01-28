import { Box, Stack, Typography } from "@mui/material";

export default function AdminProducts() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f5f2", p: 6 }}>
      <Stack spacing={2} sx={{ maxWidth: 960, mx: "auto" }}>
        <Typography variant="h3">Products</Typography>
        <Typography variant="body2">Manage credit packages here.</Typography>
      </Stack>
    </Box>
  );
}
