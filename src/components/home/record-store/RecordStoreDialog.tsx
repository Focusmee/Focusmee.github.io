import { useEffect, useState } from "react";

type DialogChoice = {
  id: string;
  title: string;
  href: string;
  detail: string;
};

type Props = {
  rootId: string;
  choices: DialogChoice[];
};

function getCanInteract(root: HTMLElement | null) {
  return root?.dataset.scrollPhase === "interior";
}

export default function RecordStoreDialog({ rootId, choices }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [canInteract, setCanInteract] = useState(false);

  useEffect(() => {
    const root = document.getElementById(rootId);

    if (!root) {
      return;
    }

    const syncPhase = () => {
      const nextCanInteract = getCanInteract(root);

      setCanInteract(nextCanInteract);
      if (!nextCanInteract) {
        setIsOpen(false);
      }
    };

    const observer = new MutationObserver(syncPhase);
    observer.observe(root, {
      attributeFilter: ["data-scroll-phase"],
      attributes: true
    });
    syncPhase();

    return () => {
      observer.disconnect();
    };
  }, [rootId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="record-store-dialog-layer" data-record-store-dialog-layer>
      <button
        className="record-store-dialog-trigger"
        data-record-store-dialog-trigger
        type="button"
        disabled={!canInteract}
        aria-label="Talk to the Seaside Records guide"
        aria-expanded={isOpen}
        aria-controls="record-store-dialog-panel"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="record-store-dialog-trigger__mark" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="record-store-dialog"
          id="record-store-dialog-panel"
          role="dialog"
          aria-label="Seaside Records guide"
        >
          <div className="record-store-dialog__speaker">Seaside Records</div>
          <p className="record-store-dialog__line">
            Welcome in. Which shelf should I open for you?
          </p>
          <div className="record-store-dialog__choices">
            {choices.map((choice) => (
              <a
                className={`record-store-dialog-choice record-store-dialog-choice--${choice.id}`}
                href={choice.href}
                key={choice.id}
              >
                <strong>{choice.title}</strong>
                <span>{choice.detail}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
