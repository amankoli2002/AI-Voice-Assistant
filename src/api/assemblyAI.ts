import { ASSEMBLY_AI_API_KEY } from "../constants";


export const uploadToAssemblyAI = async (uri: string) => {
  const res = await fetch(uri);
  const blob = await res.blob();

  const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      Authorization: `${ASSEMBLY_AI_API_KEY}`,
    },
    body: blob,
  });
  const data = await uploadRes.json();
  return data.upload_url;
};

export const startTranscription = async (audioUrl: string) => {
    const res = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        Authorization: `${ASSEMBLY_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio_url: audioUrl }),
    });

    const data = await res.json();
    return data.id;
};

export const pollTranscriptionStatus = async (transcriptionId: string) => {
    const pollingInterval = 2000;
    const maxAttempts = 12;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const transcriptionData = await checkTranscriptionStatus(transcriptionId);
      if (transcriptionData.status === "completed"){
        return transcriptionData;
      } else if (transcriptionData.status === "failed"){
        throw new Error ("Transcription failed")
      }

      await new Promise((resolve) => setTimeout(resolve, pollingInterval))
      attempts++;
    }
}

export const checkTranscriptionStatus = async (transcriptId: string) => {
    const res = await fetch(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: {
          Authorization: `${ASSEMBLY_AI_API_KEY}`,
        },
      }
    );

    const data = await res.json();
    return data;
  };