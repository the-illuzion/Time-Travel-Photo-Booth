import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Helper to strip the data:image/xyz;base64, prefix if present
const cleanBase64 = (base64Data: string): string => {
  if (base64Data.includes(',')) {
    return base64Data.split(',')[1];
  }
  return base64Data;
};

const getMimeType = (base64Data: string): string => {
    if (base64Data.startsWith('data:')) {
        return base64Data.split(';')[0].split(':')[1];
    }
    return 'image/jpeg'; // Default
}

/**
 * Time Travel / Transformation Logic
 * Uses gemini-2.5-flash-image (Nano Banana) to edit/regenerate the image.
 */
export const generateTimeTravelImage = async (
  base64Image: string,
  eraPrompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Transform this person into the following style/era: ${eraPrompt}. 
  Keep the person's facial features recognizable but change their outfit, hair style, and background to match the era perfectly. 
  Photorealistic, high quality, cinematic lighting.`;

  const mimeType = getMimeType(base64Image);
  const cleanData = cleanBase64(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Time Travel Error:", error);
    throw error;
  }
};

/**
 * Magic Editor Logic
 * Uses gemini-2.5-flash-image for text-based editing.
 */
export const editImageWithPrompt = async (
  base64Image: string,
  userPrompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const mimeType = getMimeType(base64Image);
  const cleanData = cleanBase64(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No edited image generated");
  } catch (error) {
    console.error("Magic Edit Error:", error);
    throw error;
  }
};

/**
 * Image Analysis Logic
 * Uses gemini-3-pro-preview for deep understanding.
 */
export const analyzeImage = async (
  base64Image: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const mimeType = getMimeType(base64Image);
  const cleanData = cleanBase64(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image in detail. Describe the subject, the setting, the lighting, and any historical or cultural context if applicable. Provide the output in Markdown.",
          },
        ],
      },
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
