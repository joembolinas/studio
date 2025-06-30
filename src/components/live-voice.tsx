"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { handleTranscription } from "@/app/actions";

export default function LiveVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          const result = await handleTranscription(base64Audio);
          if (result.success) {
            setTranscript((prev) => prev + result.transcription + " ");
          } else {
            toast({
              variant: "destructive",
              title: "Transcription Error",
              description: result.error,
            });
          }
          setIsTranscribing(false);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to use this feature.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording]);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">LiveVoice</CardTitle>
        <CardDescription>
          Press Start and begin speaking. Your words will be transcribed in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-secondary transition-all duration-300">
          <div
            className={cn(
              "absolute h-full w-full rounded-full",
              isRecording && "animate-pulse bg-accent"
            )}
          />
          <Mic className={cn("h-10 w-10 z-10 text-muted-foreground", isRecording && "text-accent-foreground")} />
        </div>
        <div className="w-full">
          <p className="text-sm font-medium mb-2 text-center">Transcript</p>
          <Textarea
            className="h-48 w-full resize-none text-base"
            placeholder="Your transcribed text will appear here..."
            value={transcript}
            readOnly
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleToggleRecording}
          disabled={isTranscribing}
          size="lg"
          className="w-full max-w-xs text-lg font-semibold"
        >
          {isTranscribing ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : isRecording ? (
            <Square className="mr-2 h-6 w-6" />
          ) : (
            <Mic className="mr-2 h-6 w-6" />
          )}
          {isTranscribing
            ? "Transcribing..."
            : isRecording
            ? "Stop Transcription"
            : "Start Transcription"}
        </Button>
      </CardFooter>
    </Card>
  );
}
