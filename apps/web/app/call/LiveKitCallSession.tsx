"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useLocalParticipant,
  useRoomContext
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { Mic, MicOff } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { fontBody } from "../components/landing/PageShell";

type LiveKitCallSessionProps = {
  token: string;
  serverUrl: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  children?: ReactNode;
};

function ConnectionBridge({
  onConnected,
  onDisconnected
}: {
  onConnected?: () => void;
  onDisconnected?: () => void;
}) {
  const state = useConnectionState();

  useEffect(() => {
    if (state === ConnectionState.Connected) {
      onConnected?.();
    }
    if (state === ConnectionState.Disconnected) {
      onDisconnected?.();
    }
  }, [state, onConnected, onDisconnected]);

  return null;
}

export function useDisconnectRoom() {
  const room = useRoomContext();
  return () => room.disconnect();
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
    >
      <RoomAudioRenderer />
      <ConnectionBridge onConnected={onConnected} onDisconnected={onDisconnected} />
      {children}
    </LiveKitRoom>
  );
}
