type KieJobInput = { prompt: string; imageUrl: string };

export function buildKieRequest(input: KieJobInput) {
  return {
    prompt: input.prompt,
    image_url: input.imageUrl,
  };
}

export async function startKieJob(input: KieJobInput) {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) {
    throw new Error("KIE_API_KEY_MISSING");
  }

  const res = await fetch("https://api.kie.ai/market/google/pro-image-to-image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildKieRequest(input)),
  });

  if (!res.ok) {
    throw new Error("KIE_REQUEST_FAILED");
  }

  return res.json();
}
