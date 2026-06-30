const nodewhisper = require("nodejs-whisper");

    /**
     * Convert audio file to text
     * @param {String} audioPath
     * @returns {String}
     */
    async function convertSpeechToText(audioPath) {
        try {

            const transcript = await nodewhisper(audioPath, {
                modelName: "base",          // tiny, base, small, medium, large
                autoDownloadModelName: "base",
                removeWavFileAfterTranscription: false,

                withCuda: false,
                whisperOptions: {
                    outputInText: true,
                    outputInVtt: false,
                    outputInSrt: false,
                    outputInCsv: false,
                    translateToEnglish: false,
                    language: "en",
                    wordTimestamps: false
                }
            });

            return transcript.trim();

        } catch (error) {
            console.error("Speech-to-Text Error:", error);
            throw new Error("Unable to convert speech to text.");
        }
    }

    /**
     * Dummy speaker identification
     * (Can be replaced with real diarization later)
     */
    async function identifySpeaker(transcript) {

        return [
            {
                speaker: "Speaker 1",
                text: transcript
            }
        ];
    }



module.exports = {
    convertSpeechToText,
    identifySpeaker
};