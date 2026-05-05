type Timeline = {
  addLabel: (label: string, position?: number | string) => Timeline;
  set: (...args: any[]) => Timeline;
  to: (...args: any[]) => Timeline;
};

type GsapApi = {
  context: (callback: () => void, scope: Element) => { revert: () => void };
  set: (...args: any[]) => unknown;
  timeline: (vars?: any) => Timeline;
  to: (...args: any[]) => unknown;
  utils: {
    selector: (scope: Element) => (selector: string) => Element[];
  };
};

type ScrollTriggerApi = {
  refresh: () => void;
};

type ScrollProgress = {
  progress: number;
};

const DESKTOP_SCROLL_DISTANCE = 4;
const MIN_SCROLL_DISTANCE = 2400;
const INTERIOR_START_PROGRESS = 0.62;
const INTERIOR_INTERACTION_PROGRESS = 0.78;
const INTERIOR_HOLD_PROGRESS = 0.82;
const NAV_SCENE_PROGRESS_PROPERTY = "--site-nav-scene-progress";

function setPhaseFromProgress(root: HTMLElement, progress: number) {
  const isInterior = progress >= INTERIOR_INTERACTION_PROGRESS;

  root.dataset.scrollPhase =
    progress <= 0.02 ? "outside" : isInterior ? "interior" : "active";
}

export function resetRecordStoreScrollState(root: HTMLElement) {
  root.dataset.scrollReady = "false";
  root.dataset.scrollPhase = "outside";

  if (typeof document !== "undefined") {
    document.documentElement.style.removeProperty(NAV_SCENE_PROGRESS_PROPERTY);
  }
}

export function createRecordStoreScrollScene(
  gsap: GsapApi,
  ScrollTrigger: ScrollTriggerApi,
  root: HTMLElement
) {
  const stage = root.querySelector<HTMLElement>("[data-record-store-stage]");
  const poster = root.querySelector<HTMLElement>("[data-record-store-poster]");

  if (!stage || !poster) {
    resetRecordStoreScrollState(root);
    return null;
  }

  let timeline: Timeline | undefined;

  const context = gsap.context(() => {
    const query = gsap.utils.selector(root);
    const sky = query("[data-poster-layer='sky']");
    const sea = query("[data-poster-layer='sea']");
    const backlot = query("[data-poster-layer='backlot']");
    const store = query("[data-poster-layer='store']");
    const road = query("[data-poster-layer='road']");
    const effects = query("[data-poster-layer='effects']");
    const clouds = query(".poster-cloud, .poster-cloud-bank");
    const seaDetails = query(".sea-line, .sea-stripe, .sea-sparkle, .sailboat");
    const interiorObjects = query("[data-interior-object]");
    const room = query("[data-record-store-interior]");
    const dialogLayer = query("[data-record-store-dialog-layer]");
    const exteriorLayers = [...sky, ...sea, ...backlot, ...road];
    const motionLayers = [...exteriorLayers, ...effects, ...room];
    const pageTheme = document.documentElement;

    root.dataset.scrollReady = "true";
    root.dataset.scrollPhase = "outside";

    gsap.set(root, {
      "--rs-dialog-progress": 0,
      "--rs-door-transparency": 0,
      "--rs-exterior-fade": 0,
      "--rs-focus-vignette": 0,
      "--rs-glass-sweep-opacity": 0,
      "--rs-glass-sweep-x": "-190%",
      "--rs-interior-clarity": 0,
      "--rs-room-opacity": 0
    });
    gsap.set(pageTheme, { [NAV_SCENE_PROGRESS_PROPERTY]: 0 });
    gsap.set(store, { transformOrigin: "50% 66%", xPercent: -50 });
    gsap.set(motionLayers, { force3D: true });
    gsap.set(room, { scale: 1, transformOrigin: "50% 58%" });
    gsap.set(interiorObjects, {
      filter: "brightness(0.82) saturate(0.82)",
      transformOrigin: "50% 50%"
    });
    gsap.set(dialogLayer, {
      autoAlpha: 0,
      y: 24
    });

    timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        anticipatePin: 1,
        end: () =>
          `+=${Math.max(
            Math.round(window.innerHeight * DESKTOP_SCROLL_DISTANCE),
            MIN_SCROLL_DISTANCE
          )}`,
        invalidateOnRefresh: true,
        onLeave: () => {
          root.dataset.scrollPhase = "interior";
          gsap.to(pageTheme, {
            [NAV_SCENE_PROGRESS_PROPERTY]: 0,
            duration: 0.18,
            overwrite: "auto"
          });
        },
        onLeaveBack: () => {
          root.dataset.scrollPhase = "outside";
          gsap.set(pageTheme, { [NAV_SCENE_PROGRESS_PROPERTY]: 0 });
        },
        onUpdate: (self: ScrollProgress) => {
          setPhaseFromProgress(root, self.progress);
        },
        pin: poster,
        scrub: 0.72,
        start: "top top",
        trigger: stage
      }
    });

    timeline
      .addLabel("hold", 0)
      .addLabel("sceneNav", 0.04)
      .addLabel("parallax", 0.18)
      .addLabel("door", 0.42)
      .addLabel("interior", INTERIOR_START_PROGRESS)
      .addLabel("interiorHold", INTERIOR_HOLD_PROGRESS)
      .to(pageTheme, { [NAV_SCENE_PROGRESS_PROPERTY]: 1, duration: 0.44 }, "sceneNav")
      .to(clouds, { xPercent: -4, yPercent: -8, duration: 0.24 }, "parallax")
      .to(sky, { scale: 1.035, yPercent: -3, duration: 0.54 }, "parallax")
      .to(sea, { scale: 1.08, xPercent: -2.4, yPercent: 10, duration: 0.54 }, "parallax")
      .to(seaDetails, { xPercent: -9, duration: 0.54 }, "parallax")
      .to(backlot, { scale: 1.08, xPercent: -7, yPercent: 5, duration: 0.54 }, "parallax")
      .to(road, { scale: 1.08, xPercent: 3, yPercent: 10, duration: 0.54 }, "parallax")
      .to(store, { scale: 1.06, yPercent: 0.8, duration: 0.24 }, "parallax")
      .to(store, { ease: "power1.inOut", scale: 1.82, xPercent: -50, yPercent: 0, duration: 0.3 }, "door")
      .to(root, {
        "--rs-door-transparency": 0.58,
        "--rs-focus-vignette": 0.28,
        "--rs-glass-sweep-opacity": 0.96,
        "--rs-glass-sweep-x": "88%",
        "--rs-interior-clarity": 0.42,
        "--rs-room-opacity": 0.34,
        duration: 0.3
      }, "door")
      .to(interiorObjects, {
        filter: "brightness(1.06) saturate(1.1)",
        scale: 1.03,
        stagger: 0.025,
        duration: 0.3
      }, "door+=0.04")
      .to(store, { ease: "power1.out", opacity: 0.0, scale: 2.18, xPercent: -50, yPercent: 0, duration: 0.2 }, "interior")
      .to(exteriorLayers, { opacity: 0.0, duration: 0.2 }, "interior")
      .to(effects, { opacity: 0.92, duration: 0.2 }, "interior")
      .to(room, { scale: 1.04, duration: 0.2 }, "interior")
      .to(root, {
        "--rs-dialog-progress": 1,
        "--rs-door-transparency": 1,
        "--rs-exterior-fade": 0.58,
        "--rs-focus-vignette": 0.52,
        "--rs-glass-sweep-opacity": 0,
        "--rs-glass-sweep-x": "430%",
        "--rs-interior-clarity": 1,
        "--rs-room-opacity": 1,
        duration: 0.2
      }, "interior")
      .to(dialogLayer, { autoAlpha: 1, ease: "power1.out", y: 0, duration: 0.12 }, "interior+=0.08")
      .set(root, { "--rs-dialog-progress": 1 }, "interiorHold")
      .set(root, { "--rs-dialog-progress": 1 }, 1);
  }, root);

  ScrollTrigger.refresh();

  return {
    destroy() {
      context.revert();
      resetRecordStoreScrollState(root);
    },
    refresh() {
      ScrollTrigger.refresh();
    }
  };
}
