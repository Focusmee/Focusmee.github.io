type Props = {
  isEntering: boolean;
  onEnter: () => void;
};

export default function RetroComputerScreenPreview({ isEntering, onEnter }: Props) {
  return (
    <button
      className="retro-screen-preview"
      type="button"
      aria-label="Enter Seaside Records"
      onClick={onEnter}
    >
      <span className="retro-screen-preview__scanlines" aria-hidden="true" />
      <span className="retro-screen-preview__glare" aria-hidden="true" />
      <span className="retro-screen-preview__status" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="retro-screen-preview__sky" aria-hidden="true">
        <span className="retro-screen-preview__sun" />
        <span className="retro-screen-preview__wave retro-screen-preview__wave--one" />
        <span className="retro-screen-preview__wave retro-screen-preview__wave--two" />
      </span>
      <span className="retro-screen-preview__store" aria-hidden="true">
        <span className="retro-screen-preview__sign">Seaside Records</span>
        <span className="retro-screen-preview__awning" />
        <span className="retro-screen-preview__door" />
        <span className="retro-screen-preview__bin" />
      </span>
      <span className="retro-screen-preview__prompt">
        {isEntering ? "Loading" : "Press Start"}
      </span>
    </button>
  );
}

