export const RETRO_SCREEN_TEXTURE_WIDTH = 640;
export const RETRO_SCREEN_TEXTURE_HEIGHT = 472;

type ScreenState = {
  elapsed: number;
  isEntering: boolean;
  transitionProgress: number;
};

type UvPoint = {
  x: number;
  y: number;
};

const PRESS_START_RECT = {
  height: 52,
  width: 246,
  x: (RETRO_SCREEN_TEXTURE_WIDTH - 246) / 2,
  y: RETRO_SCREEN_TEXTURE_HEIGHT - 78
};

export const PRESS_START_UV_REGION = {
  maxX: (PRESS_START_RECT.x + PRESS_START_RECT.width) / RETRO_SCREEN_TEXTURE_WIDTH,
  maxY: (RETRO_SCREEN_TEXTURE_HEIGHT - PRESS_START_RECT.y) / RETRO_SCREEN_TEXTURE_HEIGHT,
  minX: PRESS_START_RECT.x / RETRO_SCREEN_TEXTURE_WIDTH,
  minY:
    (RETRO_SCREEN_TEXTURE_HEIGHT - PRESS_START_RECT.y - PRESS_START_RECT.height) /
    RETRO_SCREEN_TEXTURE_HEIGHT
};

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const right = x + width;
  const bottom = y + height;

  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(right - radius, y);
  context.quadraticCurveTo(right, y, right, y + radius);
  context.lineTo(right, bottom - radius);
  context.quadraticCurveTo(right, bottom, right - radius, bottom);
  context.lineTo(x + radius, bottom);
  context.quadraticCurveTo(x, bottom, x, bottom - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient
) {
  drawRoundedRect(context, x, y, width, height, radius);
  context.fillStyle = fillStyle;
  context.fill();
}

function strokeRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: string,
  lineWidth: number
) {
  drawRoundedRect(context, x, y, width, height, radius);
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.stroke();
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function noise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

function drawSun(context: CanvasRenderingContext2D) {
  const x = 500;
  const y = 92;
  const radius = 42;
  const gradient = context.createLinearGradient(x, y - radius, x, y + radius);

  gradient.addColorStop(0, "#fff083");
  gradient.addColorStop(1, "#ff5f8f");

  context.save();
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.clip();
  context.fillStyle = gradient;
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2);

  context.fillStyle = "rgba(255, 95, 143, 0.52)";
  for (let stripeY = y - radius + 15; stripeY < y + radius; stripeY += 22) {
    context.fillRect(x - radius, stripeY, radius * 2, 7);
  }
  context.restore();
}

function drawStore(context: CanvasRenderingContext2D) {
  const x = 190;
  const y = 220;
  const width = 260;
  const height = 148;
  const bodyGradient = context.createLinearGradient(x, y, x, y + height);

  bodyGradient.addColorStop(0, "#fffdf8");
  bodyGradient.addColorStop(1, "#fff4e7");
  context.fillStyle = "rgba(0, 24, 88, 0.22)";
  context.fillRect(x + 7, y + height + 5, width - 14, 10);
  context.fillStyle = bodyGradient;
  context.fillRect(x, y, width, height);

  context.fillStyle = "#ff5f8f";
  context.fillRect(x + 24, y + 18, width - 48, 5);
  context.fillRect(x + 24, y + 63, width - 48, 5);

  context.fillStyle = "#0647b6";
  context.font = "900 19px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("SEASIDE RECORDS", x + width / 2, y + 43);

  for (let stripeX = x; stripeX < x + width; stripeX += 31) {
    context.fillStyle = "#fffdf8";
    context.fillRect(stripeX, y + 82, 16, 26);
    context.fillStyle = "#ff5f8f";
    context.fillRect(stripeX + 16, y + 82, 15, 26);
  }

  const doorGradient = context.createLinearGradient(x, y + 106, x, y + height);
  doorGradient.addColorStop(0, "rgba(0, 104, 223, 0.82)");
  doorGradient.addColorStop(1, "rgba(0, 20, 82, 0.94)");
  context.fillStyle = doorGradient;
  context.fillRect(x + 112, y + 104, 58, 44);
  context.strokeStyle = "rgba(255, 255, 255, 0.52)";
  context.lineWidth = 5;
  context.strokeRect(x + 112, y + 104, 58, 44);

  context.fillStyle = "#ff5f8f";
  context.fillRect(x + 24, y + 118, 72, 34);
  context.fillStyle = "rgba(163, 28, 76, 0.24)";
  context.fillRect(x + 24, y + 144, 72, 8);
}

function drawScanlines(context: CanvasRenderingContext2D) {
  context.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let y = 0; y < RETRO_SCREEN_TEXTURE_HEIGHT; y += 8) {
    context.fillRect(0, y, RETRO_SCREEN_TEXTURE_WIDTH, 2);
  }
}

function drawGlare(context: CanvasRenderingContext2D) {
  const gradient = context.createLinearGradient(370, 0, 520, 255);

  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.44, "rgba(255, 255, 255, 0.28)");
  gradient.addColorStop(0.58, "rgba(255, 255, 255, 0)");

  context.save();
  context.translate(420, 122);
  context.rotate((7 * Math.PI) / 180);
  context.fillStyle = gradient;
  context.fillRect(-72, -150, 170, 320);
  context.restore();
}

function drawPrompt(context: CanvasRenderingContext2D, state: ScreenState) {
  const promptOpacity = 1 - clamp01(state.transitionProgress * 1.7);

  if (promptOpacity <= 0.02) {
    return;
  }

  const blinkOpacity = state.isEntering
    ? 0.92
    : Math.floor((state.elapsed % 1.1) / 0.55) === 0
      ? 1
      : 0.58;

  context.save();
  context.globalAlpha = blinkOpacity * promptOpacity;
  fillRoundedRect(
    context,
    PRESS_START_RECT.x,
    PRESS_START_RECT.y,
    PRESS_START_RECT.width,
    PRESS_START_RECT.height,
    999,
    "rgba(0, 20, 82, 0.72)"
  );
  strokeRoundedRect(
    context,
    PRESS_START_RECT.x,
    PRESS_START_RECT.y,
    PRESS_START_RECT.width,
    PRESS_START_RECT.height,
    999,
    "rgba(255, 255, 255, 0.58)",
    2
  );

  context.fillStyle = "#fffdf8";
  context.font = "900 24px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(
    state.isEntering ? "LOADING" : "PRESS START",
    RETRO_SCREEN_TEXTURE_WIDTH / 2,
    PRESS_START_RECT.y + PRESS_START_RECT.height / 2 + 1
  );
  context.restore();
}

function drawGlitchTransition(context: CanvasRenderingContext2D, state: ScreenState) {
  const progress = clamp01(state.transitionProgress);

  if (progress <= 0) {
    return;
  }

  const easedProgress = easeOutCubic(progress);
  const shake = Math.sin(state.elapsed * 72) * (2 + easedProgress * 11);
  const seed = Math.floor(state.elapsed * 24) + progress * 73;
  const intensity = Math.min(1, 0.18 + easedProgress * 1.18);

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.12 + intensity * 0.18;
  context.drawImage(context.canvas, -8 - shake, 0);
  context.globalAlpha = 0.1 + intensity * 0.16;
  context.drawImage(context.canvas, 7 + shake * 0.65, 0);
  context.restore();

  context.save();
  context.globalCompositeOperation = "screen";
  context.fillStyle = `rgba(255, 42, 109, ${0.12 + intensity * 0.28})`;
  context.fillRect(0, 0, RETRO_SCREEN_TEXTURE_WIDTH, RETRO_SCREEN_TEXTURE_HEIGHT);
  context.fillStyle = `rgba(0, 245, 255, ${0.1 + intensity * 0.24})`;
  context.fillRect(
    Math.sin(state.elapsed * 48) * 18,
    0,
    RETRO_SCREEN_TEXTURE_WIDTH,
    RETRO_SCREEN_TEXTURE_HEIGHT
  );
  context.restore();

  context.save();
  context.globalAlpha = 0.24 + intensity * 0.48;

  for (let index = 0; index < 18; index += 1) {
    const sliceSeed = seed + index * 13;
    const y = Math.floor(noise(sliceSeed) * RETRO_SCREEN_TEXTURE_HEIGHT);
    const height = 2 + Math.floor(noise(sliceSeed + 7) * (5 + intensity * 24));
    const shift = Math.round((noise(sliceSeed + 17) - 0.5) * (26 + intensity * 82));

    context.drawImage(
      context.canvas,
      0,
      y,
      RETRO_SCREEN_TEXTURE_WIDTH,
      height,
      shift,
      y,
      RETRO_SCREEN_TEXTURE_WIDTH,
      height
    );

    context.fillStyle = index % 2 === 0
      ? `rgba(255, 42, 109, ${0.1 + intensity * 0.28})`
      : `rgba(0, 245, 255, ${0.1 + intensity * 0.24})`;
    context.fillRect(shift, y, RETRO_SCREEN_TEXTURE_WIDTH, Math.max(1, height - 1));
  }

  context.restore();

  context.save();
  context.globalCompositeOperation = "screen";
  context.lineWidth = 2;

  for (let index = 0; index < 8; index += 1) {
    const y = Math.floor((index / 8) * RETRO_SCREEN_TEXTURE_HEIGHT + noise(seed + index) * 16);

    context.strokeStyle = index % 2 === 0
      ? `rgba(255, 253, 248, ${0.16 + intensity * 0.36})`
      : `rgba(127, 243, 208, ${0.12 + intensity * 0.32})`;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(RETRO_SCREEN_TEXTURE_WIDTH, y + Math.sin(seed + index) * 5);
    context.stroke();
  }

  context.restore();

  context.save();
  context.globalAlpha = 0.18 + intensity * 0.18;
  context.fillStyle = "rgba(0, 6, 34, 0.62)";

  for (let y = Math.floor(noise(seed) * 6); y < RETRO_SCREEN_TEXTURE_HEIGHT; y += 11) {
    context.fillRect(0, y, RETRO_SCREEN_TEXTURE_WIDTH, 3);
  }

  context.restore();

  context.save();
  context.globalAlpha = Math.min(1, easedProgress * 1.2);
  context.fillStyle = "#fffdf8";
  context.font = "900 18px Arial, sans-serif";
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.fillText("SIGNAL // SEASIDE.REC", 32 + shake, 42);
  context.fillStyle = "#ff2a6d";
  context.fillText("SYNC", RETRO_SCREEN_TEXTURE_WIDTH - 104 - shake, 42);
  context.restore();

  if (progress > 0.68) {
    const snapProgress = clamp01((progress - 0.68) / 0.32);
    const snapPulse = Math.floor(state.elapsed * 32) % 2 === 0 ? 1 : 0.34;

    context.save();
    context.globalCompositeOperation = "screen";
    context.globalAlpha = snapPulse * (0.16 + snapProgress * 0.56);
    context.fillStyle = "#fffdf8";
    context.fillRect(0, 0, RETRO_SCREEN_TEXTURE_WIDTH, RETRO_SCREEN_TEXTURE_HEIGHT);

    context.globalAlpha = 0.22 + snapProgress * 0.42;
    context.fillStyle = "#00f5ff";
    context.fillRect(
      0,
      RETRO_SCREEN_TEXTURE_HEIGHT * (0.5 - snapProgress * 0.5),
      RETRO_SCREEN_TEXTURE_WIDTH,
      4 + snapProgress * RETRO_SCREEN_TEXTURE_HEIGHT
    );
    context.restore();
  }
}

export function drawRetroComputerScreen(
  canvas: HTMLCanvasElement,
  state: ScreenState
) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const skyGradient = context.createLinearGradient(0, 0, 0, 310);
  skyGradient.addColorStop(0, "#001a78");
  skyGradient.addColorStop(0.66, "#0068df");
  skyGradient.addColorStop(1, "#16d8e6");

  context.clearRect(0, 0, RETRO_SCREEN_TEXTURE_WIDTH, RETRO_SCREEN_TEXTURE_HEIGHT);
  context.fillStyle = "#004fc6";
  context.fillRect(0, 0, RETRO_SCREEN_TEXTURE_WIDTH, RETRO_SCREEN_TEXTURE_HEIGHT);
  context.fillStyle = skyGradient;
  context.fillRect(0, 0, RETRO_SCREEN_TEXTURE_WIDTH, 314);

  context.fillStyle = "rgba(255, 255, 255, 0.82)";
  context.fillRect(-40, 288, RETRO_SCREEN_TEXTURE_WIDTH + 80, 4);
  context.fillStyle = "rgba(255, 255, 255, 0.56)";
  context.fillRect(92, 256, 420, 4);

  drawSun(context);
  drawStore(context);

  context.fillStyle = "#ff5f8f";
  context.shadowColor = "rgba(255, 95, 143, 0.7)";
  context.shadowBlur = 18;
  context.beginPath();
  context.arc(538, 28, 8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ffd92f";
  context.beginPath();
  context.arc(562, 28, 8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#7ff3d0";
  context.beginPath();
  context.arc(586, 28, 8, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;

  drawPrompt(context, state);
  drawGlitchTransition(context, state);
  drawGlare(context);
  drawScanlines(context);

  context.strokeStyle = "rgba(2, 18, 72, 0.76)";
  context.lineWidth = 12;
  context.strokeRect(6, 6, RETRO_SCREEN_TEXTURE_WIDTH - 12, RETRO_SCREEN_TEXTURE_HEIGHT - 12);
}

export function isPressStartUvHit(uv: UvPoint | null | undefined) {
  if (!uv) {
    return false;
  }

  return (
    uv.x >= PRESS_START_UV_REGION.minX &&
    uv.x <= PRESS_START_UV_REGION.maxX &&
    uv.y >= PRESS_START_UV_REGION.minY &&
    uv.y <= PRESS_START_UV_REGION.maxY
  );
}
