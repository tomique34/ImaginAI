import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";

const highlights = [
  "Prompt-based edits",
  "Creative variations",
  "Version history",
];

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at top right, rgba(240, 162, 2, 0.18), transparent 45%), linear-gradient(135deg, rgba(27, 58, 87, 0.08), rgba(247, 245, 242, 1))",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} sx={{ py: { xs: 8, md: 12 } }}>
          <Stack spacing={2} sx={{ maxWidth: 720 }}>
            <Chip
              label="Powered by Nano Banana Pro"
              color="secondary"
              sx={{
                width: "fit-content",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: 42, md: 64 } }}>
              PhotoReimagine.ai
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Transform any photo into cinematic, artistic, or brand-ready visuals
              with fast AI editing and an iterative creative loop.
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" size="large" color="primary">
              Start editing
            </Button>
            <Button variant="outlined" size="large" color="primary">
              See examples
            </Button>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {highlights.map((item) => (
              <Box
                key={item}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  padding: 2.5,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(27, 58, 87, 0.08)",
                  boxShadow: "0 16px 40px rgba(27, 58, 87, 0.08)",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {item}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Built for creators who want speed, control, and a production-ready
                  workflow.
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
