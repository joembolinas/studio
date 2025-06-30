# **App Name**: LiveVoice

## Core Features:

- Live Transcription Display: Display the audio transcription in real-time inside a text area as the user speaks.
- Start/Stop Transcription: Start and stop audio transcription by pressing a button in the web UI.
- Listening Indicator: Visually show that the microphone is actively listening.
- Audio Capture: Capture audio via the browser's microphone.
- Real-time Communication: Establish a persistent WebSocket connection to the backend for real-time communication.
- Audio Transcription: Transcribe the audio stream using faster-whisper, capable of using either English or Tagalog languages. The faster-whisper tool hints at Tagalog being present along with English.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to represent clarity and real-time communication.
- Background color: A light, desaturated blue (#E5F5FA) to ensure comfortable readability.
- Accent color: A warm orange (#F2994A) to highlight interactive elements and the status indicator.
- Body and headline font: 'Inter', a sans-serif font, providing a modern and readable text for the live transcript.
- Simple, clear icons to indicate recording status and button functionality.
- Clean, single-page layout with a prominent text area and clear controls to ensure ease of use.
- Subtle animations on the status indicator to provide clear feedback when the application is actively transcribing.