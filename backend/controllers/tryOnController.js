import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

export const generateTryOn = async (req, res) => {
  try {
    const { userImage, garmentImage, scenePrompt, size, fitDescription } = req.body;

    if (!userImage || !garmentImage)
      return res.status(400).json({ success: false, message: "Missing images" });

    const apiKey = process.env.GOOGLE_API_KEY;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Act as a high-end menswear stylist.
                  GOAL: Generate a photorealistic image of the Man wearing the Outfit.
                  SIZE: ${size} (${fitDescription})
                  SCENE: ${scenePrompt}
                  Replace outfit realistically.
                  Preserve face and body shape.
                  Improve lighting to match scene.
                  Remove backgrounds and unwanted artifacts.
                  Do NOT add any text.` 
            },
            { inlineData: userImage },
            { inlineData: garmentImage }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
        temperature: 0.4
      }
    };

    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const json = await result.json();

    const base64 = json?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

    if (!base64)
      return res.status(500).json({ success: false, message: "AI Failed to generate output" });

    return res.status(200).json({
      success: true,
      image: `data:image/png;base64,${base64}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
