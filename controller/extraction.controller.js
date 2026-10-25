
import Extraction from "../model/extraction.model.js";
import { extractWithNvidia } from "../utils/ai.utils.js";

export const extractContent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required."
            });
        }

        // Convert uploaded image to Base64
        const base64 = req.file.buffer.toString("base64");

        // Construct a valid image data URI without newlines
        const imageData = `data:${req.file.mimetype};base64,${base64}`;

        const prompt = `
Analyze this image and extract visible information.

If it contains a resume, extract:
- Name
- Email
- Phone
- Skills
- Education
- Experience
- Projects

If it contains a LinkedIn recruitment post, extract:
- Recruiter email, if visible
- Recruiter or author name
- Company
- Job role
- Required skills
- Post content

Return valid JSON. Use null for missing information.
Do not invent or guess information.
`;

        const extractContentWithAi = await extractWithNvidia(
            prompt,
            imageData
        );

        if (
            typeof extractContentWithAi !== "string" ||
            !extractContentWithAi.trim()
        ) {
            throw new Error("AI returned an empty or invalid response.");
        }

        let parsedData;

        try {
            // Support JSON wrapped in Markdown code fences
            const cleanedContent = extractContentWithAi
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/\s*```$/, "")
                .trim();

            // Extract the JSON object if additional text is present
            const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
            const toParse = jsonMatch
                ? jsonMatch[0]
                : cleanedContent;

            parsedData = JSON.parse(toParse);
        } catch (error) {
            console.error("Error while parsing AI response:", error.message);

            parsedData = {
                rawContent: extractContentWithAi
            };
        }

        const savedExtraction = await Extraction.create({
            data: parsedData,
            rawContent: extractContentWithAi,
            createdBy: req.user._id
        });

        return res.status(200).json({
            success: true,
            msg: "Extraction successful.",
            savedExtraction
        });

    } catch (error) {
        console.error("Extraction Error:", error.message);

        return res.status(500).json({
            success: false,
            msg: "Content extraction failed.",
            error: error.message
        });
    }
};
