"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useRemoteParticipants,
  useRoomContext
} from "@livekit/components-react";
import { DisconnectReason } from "livekit-client";
import { Mic, MicOff } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { fontBody } from "../components/landing/PageShell";

type LiveKitCallSessionProps = {
  token: string;
  serverUrl: string;
  onConnected?: () => void;
  onDisconnected?: (reason?: DisconnectReason) => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
};

export function useDisconnectRoom() {
  const room = useRoomContext();
  return () => room.disconnect();
}

/**
 * Reports how many remote participants are in the room, so the page can show
 * a "waiting for the other person" state instead of treating a solo join as
 * a failure. Must be rendered inside LiveKitCallSession.
 */
export function RemotePresenceBridge({
  onChange
}: {
  onChange: (count: number) => void;
}) {
  const remoteParticipants = useRemoteParticipants();

  useEffect(() => {
    onChange(remoteParticipants.length);
  }, [remoteParticipants.length, onChange]);

  return null;
}

export function MuteToggle() {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  return (
    <button
      type="button"
      onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
      className="inline-flex items-center"
      style={{
        gap: 8,
        borderRadius: 9999,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.9)",
        color: "#111111",
        fontFamily: fontBody,
        fontSize: 14,
        fontWeight: 500,
        padding: "13px 22px",
        cursor: "pointer"
      }}
    >
      {isMicrophoneEnabled ? <Mic size={16} /> : <MicOff size={16} />}
      {isMicrophoneEnabled ? "Mute" : "Unmute"}
    </button>
  );
}

export function LiveKitCallSession({
  token,
  serverUrl,
  onConnected,
  onDisconnected,
  onError,
  children
}: LiveKitCallSessionProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect
      audio
      video={false}
      options={{ adaptiveStream: true, dynacast: true }}
      onConnected={onConnected}
      onDisconnected={(reason) => {
        // Surface the LiveKit disconnect reason for diagnostics.
        console.info(
          "[call] room disconnected:",
          reason !== undefined ? DisconnectReason[reason] ?? reason : "unknown"
        );
        onDisconnected?.(reason);
      }}
      onError={(error) => {
        console.error("[call] room error:", error);
        onError?.(error);
      }}
    >
      <RoomAudioRenderer />
      {children}
    </LiveKitRoom>
  );
}
