import { useEffect } from "react";
import {
  createRecordStoreScrollScene,
  resetRecordStoreScrollState
} from "./recordStoreAnimation";
import {
  RECORD_STORE_ENTRY_CLOSE_EVENT,
  RECORD_STORE_ENTRY_OPEN_EVENT
} from "../retro-computer/retroComputerEvents";

type Props = {
  rootId: string;
};

const DESKTOP_QUERY = "(min-width: 981px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function RecordStoreScrollController({ rootId }: Props) {
  useEffect(() => {
    const root = document.getElementById(rootId);

    if (!root) {
      return;
    }

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    let scene: ReturnType<typeof createRecordStoreScrollScene> = null;
    let runId = 0;
    let isMounted = true;
    const canUseScrollScene = () =>
      !root.dataset.entryState || root.dataset.entryState === "open";

    const destroyScene = () => {
      scene?.destroy();
      scene = null;
      resetRecordStoreScrollState(root);
    };

    const setupScene = async () => {
      const currentRun = runId + 1;
      runId = currentRun;
      destroyScene();

      if (!desktop.matches || reducedMotion.matches) {
        return;
      }

      if (!canUseScrollScene()) {
        return;
      }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);

      if (!isMounted || currentRun !== runId) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      scene = createRecordStoreScrollScene(gsap, ScrollTrigger, root);
    };

    const handleMediaChange = () => {
      void setupScene();
    };

    const handleEntryOpen = () => {
      window.requestAnimationFrame(() => {
        void setupScene();
      });
    };

    const handleEntryClose = () => {
      destroyScene();
    };

    const handleBeforeSwap = () => {
      destroyScene();
    };

    desktop.addEventListener("change", handleMediaChange);
    reducedMotion.addEventListener("change", handleMediaChange);
    root.addEventListener(RECORD_STORE_ENTRY_OPEN_EVENT, handleEntryOpen);
    root.addEventListener(RECORD_STORE_ENTRY_CLOSE_EVENT, handleEntryClose);
    document.addEventListener("astro:before-swap", handleBeforeSwap);

    void setupScene();

    return () => {
      isMounted = false;
      runId += 1;
      desktop.removeEventListener("change", handleMediaChange);
      reducedMotion.removeEventListener("change", handleMediaChange);
      root.removeEventListener(RECORD_STORE_ENTRY_OPEN_EVENT, handleEntryOpen);
      root.removeEventListener(RECORD_STORE_ENTRY_CLOSE_EVENT, handleEntryClose);
      document.removeEventListener("astro:before-swap", handleBeforeSwap);
      destroyScene();
    };
  }, [rootId]);

  return null;
}
