import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import RetroComputerScene from "./RetroComputerScene";
import {
  RECORD_STORE_ENTRY_CLOSE_EVENT,
  RECORD_STORE_ENTRY_OPEN_EVENT,
  type RecordStoreEntryState
} from "./retroComputerEvents";

type Props = {
  rootId: string;
};

const ENTER_TRANSITION_MS = 1500;

function getAssetUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";

  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export default function RetroComputerEntrance({ rootId }: Props) {
  const [entryState, setEntryState] = useState<RecordStoreEntryState>("intro");
  const timeoutRef = useRef<number | null>(null);
  const modelUrl = useMemo(() => getAssetUrl("models/retro_computer.glb"), []);
  const isEntering = entryState === "entering";

  useEffect(() => {
    const root = document.getElementById(rootId);

    if (!root) {
      return;
    }

    root.dataset.entryState = entryState;
    root.style.setProperty("--retro-entry-duration", `${ENTER_TRANSITION_MS}ms`);

    if (entryState === "open") {
      root.dispatchEvent(new CustomEvent(RECORD_STORE_ENTRY_OPEN_EVENT));
    }
  }, [entryState, rootId]);

  useEffect(() => {
    if (entryState !== "entering") {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setEntryState("open");
    }, ENTER_TRANSITION_MS);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [entryState]);

  const handleEnter = useCallback(() => {
    const root = document.getElementById(rootId);

    if (entryState !== "intro" || !root) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = root.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      behavior: reducedMotion ? "auto" : "smooth",
      top
    });
    setEntryState(reducedMotion ? "open" : "entering");
  }, [entryState, rootId]);

  const handleReturn = useCallback(() => {
    const root = document.getElementById(rootId);

    if (!root) {
      return;
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    root.dispatchEvent(new CustomEvent(RECORD_STORE_ENTRY_CLOSE_EVENT));
    setEntryState("intro");
    window.scrollTo({
      behavior: "auto",
      top: root.getBoundingClientRect().top + window.scrollY
    });
  }, [rootId]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    const closeTrigger = root?.querySelector<HTMLButtonElement>(
      "[data-record-store-close-trigger]"
    );

    if (!closeTrigger) {
      return;
    }

    closeTrigger.addEventListener("click", handleReturn);

    return () => {
      closeTrigger.removeEventListener("click", handleReturn);
    };
  }, [handleReturn, rootId]);

  if (entryState === "open") {
    return null;
  }

  return (
    <section
      className={`retro-computer-entry retro-computer-entry--${entryState}`}
      aria-label="Seaside Records terminal"
      style={{ "--retro-entry-duration": `${ENTER_TRANSITION_MS}ms` } as CSSProperties}
    >
      <div className="retro-computer-entry__panel" aria-hidden="true">
        <span>Seaside OS</span>
        <strong>Summer Archive</strong>
      </div>
      <div className="retro-computer-entry__scene">
        <RetroComputerScene
          isEntering={isEntering}
          modelUrl={modelUrl}
          onEnter={handleEnter}
          transitionDurationMs={ENTER_TRANSITION_MS}
        />
      </div>
      <button
        className="retro-computer-entry__start"
        type="button"
        onClick={handleEnter}
        disabled={isEntering}
      >
        {isEntering ? "Loading" : "Press Start"}
      </button>
    </section>
  );
}
