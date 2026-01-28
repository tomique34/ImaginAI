import { Box, Stack, TextField, Typography } from "@mui/material";

export default function ProjectEditor() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f5f2", p: 6 }}>
      <Stack spacing={2} sx={{ maxWidth: 960, mx: "auto" }}>
        <Typography variant="h3">Project Editor</Typography>
        <TextField
          placeholder="Enter prompt"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
        />
      </Stack>
    </Box>
  );
}
