import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import 'dotenv/config';

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

const uploadResult = async() => await fileManager.uploadFile(
    './src/tree.webp',
    {
      mimeType: "image/jpeg",
    },
);
// View the response.
// console.log(
//     `Uploaded file ${uploadResult().then(res => res.file.displayName)}`,
// );

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const result = async ()=> {
  const result = await uploadResult();
  return await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: "Respond with the category that best describes the image: school, forest, swimming pool",
          },
          {
            fileData: {
              fileUri: result.file.uri,
              mimeType: result.file.mimeType,
            },
          },
        ],
      }
    ],
    generationConfig: {
      temperature: 0.0,
    }
  });
}