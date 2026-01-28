import { Box, Stack, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f5f2", p: 6 }}>
      <Stack spacing={2} sx={{ maxWidth: 960, mx: "auto" }}>
        <Typography variant="h3">Dashboard</Typography>
        <Typography variant="body1">Credits: 3</Typography>
      </Stack>
    </Box>
  );
}
