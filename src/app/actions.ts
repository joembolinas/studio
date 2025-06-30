
'use server';

import { transcribeAudio } from '@/ai/flows/transcribe-audio';

export async function handleTranscription(audioDataUri: string) {
  try {
    if (!audioDataUri || typeof audioDataUri !== 'string') {
        return { success: false, error: 'Invalid audio data URI.' };
    }
    
    const result = await transcribeAudio({ audioDataUri });
    
    if (result && result.transcription) {
        return { success: true, transcription: result.transcription };
    } else {
        return { success: false, error: 'Transcription failed to produce a result.' };
    }

  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unknown error occurred during transcription.';
    return { success: false, error };
  }
}
