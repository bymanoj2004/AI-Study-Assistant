export async function generateStudyMaterial(input) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input })
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success || !result.data) {
    throw new Error(result?.error || "Unable to generate study material.");
  }

  return result.data;
}
