import { Mic, Square, WandSparkles } from "lucide-react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Select } from "../common/Select";
import { Loader } from "../common/Loader";
import { languageOptions } from "../../lib/constants";
import type { ParsedVoiceCommand } from "../../types/shopping";

interface VoiceCommandPanelProps {
  selectedLanguage: string;
  transcript: string;
  command: ParsedVoiceCommand | null;
  isListening: boolean;
  isSupported: boolean;
  voiceLoading: boolean;
  onLanguageChange: (value: string) => void;
  onStart: () => void;
  onStop: () => void;
}

export const VoiceCommandPanel = ({
  selectedLanguage,
  transcript,
  command,
  isListening,
  isSupported,
  voiceLoading,
  onLanguageChange,
  onStart,
  onStop
}: VoiceCommandPanelProps) => (
  <Card className="space-y-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Voice Command Center</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Speak naturally, we’ll structure the intent.</h2>
      </div>
      <div className="w-40">
        <Select value={selectedLanguage} onChange={(event) => onLanguageChange(event.target.value)}>
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>

    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[24px] border border-dashed border-brand-teal/30 bg-brand-teal/5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Live transcript</p>
            <p className="text-xs text-slate-500">Try: “Add 2 Amul milk packets under dairy”</p>
          </div>
          {isListening ? (
            <Button variant="secondary" onClick={onStop}>
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button variant="primary" onClick={onStart} disabled={!isSupported || voiceLoading}>
              <Mic className="mr-2 h-4 w-4" />
              Start Listening
            </Button>
          )}
        </div>
        <div className="mt-4 min-h-28 rounded-3xl bg-white p-4 text-sm text-brand-ink">
          {transcript || "Your recognized speech will appear here."}
        </div>
        {!isSupported && <p className="mt-3 text-xs text-red-500">Web Speech API is not supported in this browser.</p>}
      </div>

      <div className="rounded-[24px] bg-brand-gold/15 p-5">
        <div className="flex items-center gap-2">
          <WandSparkles className="h-5 w-5 text-brand-coral" />
          <p className="text-sm font-semibold">Gemini structured response</p>
        </div>
        <div className="mt-4 rounded-3xl bg-white p-4 text-sm">
          {voiceLoading ? (
            <Loader label="Interpreting your command..." />
          ) : command ? (
            <pre className="whitespace-pre-wrap font-body text-xs leading-6 text-brand-ink">
              {JSON.stringify(command, null, 2)}
            </pre>
          ) : (
            "Parsed JSON will be shown here after Gemini processes the voice input."
          )}
        </div>
      </div>
    </div>
  </Card>
);
