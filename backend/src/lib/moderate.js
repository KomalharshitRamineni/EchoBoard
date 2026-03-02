const AZURE_API_VERSION = "2023-10-01";
const MODERATION_CATEGORIES = ["Hate", "SelfHarm", "Sexual", "Violence"];

/**
 * Sends text to Azure Content Safety for moderation.
 * Returns flagged status and per-category severity scores.
 */
export async function moderateText(input, { threshold = 2 } = {}) {
  const endpointRaw = process.env.AZURE_CONTENT_SAFETY_ENDPOINT;
  const key = process.env.AZURE_CONTENT_SAFETY_KEY;

  if (!endpointRaw || !key) {
    throw new Error("Missing AZURE_CONTENT_SAFETY_ENDPOINT or AZURE_CONTENT_SAFETY_KEY");
  }

  const endpoint = endpointRaw.replace(/\/+$/, "");
  const url = `${endpoint}/contentsafety/text:analyze?api-version=${AZURE_API_VERSION}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: input,
      categories: MODERATION_CATEGORIES,
      outputType: "FourSeverityLevels",
    }),
  });

  if (!response.ok) {
    const body = await response.json();
    console.error("Azure moderation failed:", response.status, body);
    const err = new Error("Azure Content Safety error");
    err.status = response.status;
    err.details = body;
    throw err;
  }

  const data = await response.json();
  const categoriesAnalysis = data?.categoriesAnalysis ?? [];
  const severities = Object.fromEntries(categoriesAnalysis.map((x) => [x.category, x.severity]));
  const flagged = categoriesAnalysis.some((x) => (x.severity ?? 0) >= threshold);

  return { flagged, severities };
}