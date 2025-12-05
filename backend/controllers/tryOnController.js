import fetch from "node-fetch"; // or global fetch if using node18+
import dotenv from "dotenv";
dotenv.config();

// Models (hidden from client)
const MODEL_IMAGE = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview";
const MODEL_TEXT = process.env.GEMINI_TEXT_MODEL || "gemini-1.5-flash"; // for short text classification
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.warn("Missing GOOGLE_API_KEY in env!");
}

// Helper: simple backoff fetch
const fetchWithBackoff = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      // For client errors, break immediately
      if (res.status >= 400 && res.status < 500) {
        const text = await res.text().catch(() => "");
        throw new Error(`Client error ${res.status}: ${text}`);
      }
      // else retry
      const delay = Math.pow(2, i) * 500;
      await new Promise((r) => setTimeout(r, delay));
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
};

// Convert frontend image object to Gemini inlineData object
const toInlineData = (imgObj) => {
  // imgObj: { full, raw, mime }
  return {
    inlineData: {
      mimeType: imgObj.mime,
      data: imgObj.raw,
    },
  };
};

// Parse/normalize product category to required gender
const requiredGenderForCategory = (category) => {
  if (!category) return null;
  const c = category.toString().toLowerCase();
  if (c.includes("women") || c.includes("female")) return "female";
  if (c.includes("men") || c.includes("male")) return "male";
  if (c.includes("unisex")) return "any";
  // fallback: if subcategory or category ambiguous, return null (allow)
  return null;
};

export const generateTryOn = async (req, res) => {
  try {
    // Expect JSON: { userImage, garmentImage, selectedSize, selectedScenePrompt, productCategory }
    const { userImage, garmentImage, selectedSize, selectedScenePrompt, productCategory } = req.body;

    if (!userImage || !garmentImage) {
      return res.status(400).json({ success: false, message: "Missing images" });
    }

    // 1) Gender validation — use text model with inline image
    // Build request body for text classification
    const textUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_TEXT}:generateContent?key=${API_KEY}`;

    const textBody = {
      contents: [
        {
          parts: [
            {
              text: "Look at the main person in the inline image. Reply with exactly one word: 'Male' or 'Female'.",
            },
            toInlineData(userImage),
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 8, temperature: 0 },
    };

    const textResp = await fetchWithBackoff(textUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(textBody),
    });

    const textJson = await textResp.json().catch(() => ({}));
    const detectedRaw = textJson?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const detected = detectedRaw.toString().trim().toLowerCase();

    // Normalize detected
    let detectedGender = null;
    if (detected.includes("male")) detectedGender = "male";
    if (detected.includes("female")) detectedGender = "female";

    // 2) Enforce product-category-based rule
    const required = requiredGenderForCategory(productCategory); // "male" | "female" | "any" | null
    if (required && required !== "any") {
      if (!detectedGender) {
        // If unable to detect, reject for safety
        return res.status(400).json({ success: false, message: "Unable to detect user gender. Upload a clear frontal photo." });
      }
      if (detectedGender !== required) {
        return res.status(400).json({
          success: false,
          message: `This product requires a ${required === "male" ? "male" : "female"} photo for accurate try-on.`,
        });
      }
    }

    // 3) Prepare scene & prompt (hidden here on backend)
    const fitDescription = selectedSize || "Regular Fit";
    const scenePrompt = selectedScenePrompt || "Studio neutral lighting";

    const systemPrompt = `
You are a professional menswear stylist (or womenswear when productCategory indicates), generate a photorealistic image that places the provided person wearing the provided garment.
Rules:
- Preserve face and identity.
- Replace only the clothes.
- Match lighting and skin tone to look natural.
- Remove text, watermarks, or overlays.
- Maintain correct body proportions and avoid distortions.
- Output must be a single PNG image (no text).
Context:
Product category: ${productCategory || "unknown"}
Requested fit: ${fitDescription}
Scene: ${scenePrompt}
`;

    // 4) Call image model
    const imageUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_IMAGE}:generateContent?key=${API_KEY}`;

    const imageBody = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            toInlineData(userImage),
            toInlineData(garmentImage),
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
        temperature: 0.35,
      },
    };

    const imageResp = await fetchWithBackoff(imageUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imageBody),
    });

    const imageJson = await imageResp.json().catch(() => ({}));

    const base64Data = imageJson?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;

    if (!base64Data) {
      console.error("Gemini image response:", JSON.stringify(imageJson).slice(0, 1000));
      return res.status(500).json({ success: false, message: "AI failed to generate image" });
    }

    // Return data URL
    const dataUrl = `data:image/png;base64,${base64Data}`;

    return res.status(200).json({ success: true, image: dataUrl });
  } catch (err) {
    console.error("TryOn error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
