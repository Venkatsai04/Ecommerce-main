import fetch from "node-fetch"; // or global fetch if using node18+
import dotenv from "dotenv";
dotenv.config();

// --- MODEL CONFIGURATION ---
// Note: This model (imagen-3.0-generate-002) is generally a paid service.
const MODEL_IMAGE = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview"; // Try this if 3.0 fails.
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.warn("Missing GOOGLE_API_KEY in env!");
}

// --- New Utility Function to List Models ---
// const listAvailableModels = async () => {
//     console.log("--- Fetching Available Models ---");
//     const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    
//     try {
//         const res = await fetch(listUrl);
//         const data = await res.json();
        
//         if (data.error) {
//             console.error("Error listing models:", data.error.message);
//             return [];
//         }

//         // Filter for models that support the generateContent method
//         const supportedModels = data.models.filter(model => 
//             model.supportedGenerationMethods.includes("generateContent")
//         );

//         console.log("Total models supporting generateContent:", supportedModels.length);

//         // Map and log only the essential info
//         const modelNames = supportedModels.map(model => ({
//             name: model.name,
//             version: model.version,
//             description: model.description,
//             methods: model.supportedGenerationMethods.join(', ')
//         }));

//         console.table(modelNames);
//         return supportedModels;
        
//     } catch (err) {
//         console.error("Network error during ListModels call:", err);
//         return [];
//     }
// };

// await listAvailableModels();

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

export const generateTryOn = async (req, res) => {
    try {
        // Expect JSON: { userImage, garmentImage, selectedSize, selectedScenePrompt, productCategory }
        const { userImage, garmentImage, selectedSize, selectedScenePrompt, productCategory } = req.body;

        if (!userImage || !garmentImage) {
            return res.status(400).json({ success: false, message: "Missing images" });
        }

        // 1) Prepare scene & prompt 
        const fitDescription = selectedSize || "Regular Fit";
        const scenePrompt = selectedScenePrompt || "Studio neutral lighting";

        const systemPrompt = `
You are a professional fashion stylist. Your task is to generate a photorealistic image that seamlessly places the provided person wearing the provided garment.
Rules:
- Preserve the person's face and identity.
- Replace only the existing clothes with the garment image provided.
- Ensure the garment realistically drapes, folds, and fits the person's body shape.
- Match lighting and skin tone to look natural.
- Remove any text, watermarks, or overlays.
- Maintain correct body proportions and avoid any distortions or artifacts.
- The final output MUST be a single PNG image (no text in the output).
Context:
Product category: ${productCategory || "unknown"}
Requested fit: ${fitDescription}
Scene: ${scenePrompt}
`;

        // 2) Call image model
        const imageUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_IMAGE}:generateContent?key=${API_KEY}`;

        const imageBody = {
            contents: [
                {
                    parts: [
                        { text: systemPrompt },
                        // Pass both the user and garment images
                        toInlineData(userImage),
                        toInlineData(garmentImage),
                    ],
                },
            ],
            generationConfig: {
                // --- FIX APPLIED HERE ---
                // The correct configuration for requesting an image output:
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
        
        // Check for Image API error message (e.g., if the garment is too blurry)
        if (imageJson.error) {
            console.error("Gemini Image Error:", imageJson.error);
            return res.status(400).json({ success: false, message: `Image generation failed: ${imageJson.error.message}` });
        }

        // Find the base64 data from the response
        const base64Data = imageJson?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;

        if (!base64Data) {
            console.error("Gemini image response:", JSON.stringify(imageJson).slice(0, 1000));
            // Check for safety filter block
            if (imageJson.candidates?.[0]?.finishReason === 'SAFETY') {
                return res.status(400).json({ success: false, message: "AI failed to generate image due to safety filter block." });
            }
            return res.status(500).json({ success: false, message: "AI failed to generate image (No data returned)" });
        }

        // Return data URL
        const dataUrl = `data:image/png;base64,${base64Data}`;

        return res.status(200).json({ success: true, image: dataUrl });
    } catch (err) {
        console.error("TryOn error:", err);
        // Catch and handle the specific client error from fetchWithBackoff
        if (err.message.includes("Client error 404")) {
            return res.status(500).json({ success: false, message: "Server error: Check if your GEMINI_IMAGE_MODEL is correct and supported." });
        }
        return res.status(500).json({ success: false, message: "Server error" });
    }
};