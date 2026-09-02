"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  Zap,
  Radio,
  Trophy,
  Flame,
  Pause,
} from "lucide-react";

// Procedural Web Audio Synth
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playShoot() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playExplode(isBoss: boolean = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * (isBoss ? 0.4 : 0.2);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(isBoss ? 400 : 800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      40,
      this.ctx.currentTime + (isBoss ? 0.4 : 0.2)
    );

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isBoss ? 0.3 : 0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.ctx.currentTime + (isBoss ? 0.4 : 0.2)
    );

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playPowerup() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.ctx.currentTime + idx * 0.05 + 0.1
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.1);
    });
  }

  playDamage() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

const sfx = new SoundFX();

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
}

interface Enemy {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  type: "bug" | "404" | "leak" | "loop" | "boss";
  color: string;
  name: string;
  angle: number;
  speed: number;
  rotation: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: "tri" | "overclock" | "nuke" | "shield";
  icon: string;
  color: string;
  radius: number;
  duration: number;
  rotation: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
}

export default function CyberGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // React State for HUD
  const [gameState, setGameState] = useState<
    "idle" | "playing" | "paused" | "gameover"
  >("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [hp, setHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [activePower, setActivePower] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Refs for Game Loop
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const scoreRef = useRef(0);
  const hpRef = useRef(100);
  const waveRef = useRef(1);
  const comboRef = useRef(0);
  const lastHitTimeRef = useRef(0);

  const powerRef = useRef<{ tri: number; overclock: number }>({
    tri: 0,
    overclock: 0,
  });

  // Load high score from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cybersentry_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sfx.enabled = next;
  };

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    hpRef.current = 100;
    waveRef.current = 1;
    comboRef.current = 0;
    powerRef.current = { tri: 0, overclock: 0 };

    setScore(0);
    setHp(100);
    setWave(1);
    setCombo(0);
    setActivePower(null);
    setGameState("playing");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId: number;

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Entities
    let bullets: Bullet[] = [];
    let enemies: Enemy[] = [];
    let particles: Particle[] = [];
    let shockwaves: Shockwave[] = [];
    let powerUps: PowerUp[] = [];
    let floatingTexts: FloatingText[] = [];

    let turretAngle = 0;
    let turretRecoil = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let isMouseDown = false;
    let lastShotTime = 0;
    let lastSpawnTime = 0;
    let screenShake = 0;
    let globalTime = 0;

    const center = () => ({ x: width / 2, y: height / 2 });

    const spawnParticles = (x: number, y: number, color: string, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.5 + 1,
          color,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
        });
      }
    };

    const addShockwave = (x: number, y: number, color: string, maxRadius = 60) => {
      shockwaves.push({ x, y, radius: 4, maxRadius, color, alpha: 0.9 });
    };

    const addFloatingText = (
      x: number,
      y: number,
      text: string,
      color: string
    ) => {
      floatingTexts.push({ x, y, text, color, alpha: 1 });
    };

    const spawnEnemy = () => {
      const c = center();
      const edge = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;

      if (edge === 0) {
        x = Math.random() * width;
        y = -35;
      } else if (edge === 1) {
        x = width + 35;
        y = Math.random() * height;
      } else if (edge === 2) {
        x = Math.random() * width;
        y = height + 35;
      } else {
        x = -35;
        y = Math.random() * height;
      }

      const angle = Math.atan2(c.y - y, c.x - x);
      const rand = Math.random();
      const currentWave = waveRef.current;

      let type: Enemy["type"] = "bug";
      let hp = 1;
      let radius = 14;
      let color = "#10b981"; // Emerald
      let name = "NaniteBug";
      let speed = 1.6 + currentWave * 0.14;

      if (
        currentWave >= 5 &&
        currentWave % 5 === 0 &&
        enemies.filter((e) => e.type === "boss").length === 0
      ) {
        type = "boss";
        hp = 35 + currentWave * 8;
        radius = 36;
        color = "#ef4444"; // Crimson Dreadnought
        name = "RANSOMWARE";
        speed = 0.55;
      } else if (rand > 0.75) {
        type = "leak";
        hp = 3;
        radius = 18;
        color = "#a855f7"; // Amethyst Void
        name = "MemoryLeak";
        speed = 1.05;
      } else if (rand > 0.5) {
        type = "404";
        hp = 2;
        radius = 15;
        color = "#f43f5e"; // Rose Hazard
        name = "404 Hazard";
        speed = 1.35;
      } else if (rand > 0.28) {
        type = "loop";
        hp = 2;
        radius = 15;
        color = "#f59e0b"; // Amber Gyro
        name = "InfiniteLoop";
        speed = 1.7;
      }

      enemies.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius,
        hp,
        maxHp: hp,
        type,
        color,
        name,
        angle,
        speed,
        rotation: 0,
      });
    };

    const triggerNuke = () => {
      sfx.playExplode(true);
      screenShake = 18;
      addShockwave(width / 2, height / 2, "#38bdf8", Math.max(width, height) * 0.7);
      enemies.forEach((e) => {
        spawnParticles(e.x, e.y, e.color, 18);
        scoreRef.current += 100;
      });
      enemies = [];
      addFloatingText(width / 2, height / 2 - 50, "💥 EMP DETONATED!", "#38bdf8");
      setScore(scoreRef.current);
    };

    const shoot = () => {
      const c = center();
      sfx.playShoot();
      turretRecoil = 6;
      const hasTri = powerRef.current.tri > 0;

      const angles = hasTri
        ? [turretAngle - 0.22, turretAngle, turretAngle + 0.22]
        : [turretAngle];

      angles.forEach((ang) => {
        bullets.push({
          x: c.x + Math.cos(ang) * 28,
          y: c.y + Math.sin(ang) * 28,
          vx: Math.cos(ang) * 10,
          vy: Math.sin(ang) * 10,
          color: hasTri ? "#38bdf8" : "#2563eb",
          radius: 3.5,
          life: 80,
        });
      });

      // Recoil plasma spark
      spawnParticles(
        c.x + Math.cos(turretAngle) * 26,
        c.y + Math.sin(turretAngle) * 26,
        "#38bdf8",
        4
      );
    };

    // ==========================================
    // PROCEDURAL VECTOR GRAPHICS RENDER FUNCTIONS
    // ==========================================

    // 1. Sleek Crystalline Turret Chassis
    const drawTurret = (
      cx: number,
      cy: number,
      angle: number,
      recoil: number,
      currentHp: number,
      t: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);

      // Outer Rotating Shield Rings with Hex Brackets
      const shieldRadius = 38;
      ctx.save();
      ctx.rotate(t * 0.6);
      ctx.strokeStyle = `rgba(15, 82, 186, ${0.15 + (currentHp / 100) * 0.4})`;
      ctx.lineWidth = 1.5;

      // 6 Shield Arc Brackets
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        const start = (i * Math.PI) / 3 + 0.12;
        const end = ((i + 1) * Math.PI) / 3 - 0.12;
        ctx.arc(0, 0, shieldRadius, start, end);
        ctx.stroke();
      }
      ctx.restore();

      // Inner Titanium Octagonal Platform
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rad = (i * Math.PI) / 4;
        const px = Math.cos(rad) * 24;
        const py = Math.sin(rad) * 24;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = "#0c1b30";
      ctx.fill();
      ctx.strokeStyle = "#1e3a5f";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Aiming Laser Sight
      if (gameStateRef.current === "playing") {
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(400, 0);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        // Laser Reticle Dot
        ctx.beginPath();
        ctx.arc(200, 0, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        ctx.fill();
        ctx.restore();
      }

      // Rotating Turret Cannon Head with Recoil
      ctx.save();
      ctx.rotate(angle);

      // Twin Plasma Cannon Rails
      const barrelX = 10 - recoil;
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1;

      // Rail 1
      ctx.fillRect(barrelX, -7, 18, 4);
      ctx.strokeRect(barrelX, -7, 18, 4);
      // Rail 2
      ctx.fillRect(barrelX, 3, 18, 4);
      ctx.strokeRect(barrelX, 3, 18, 4);

      // Muzzle Energy Glow Emitters
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 8;
      ctx.fillRect(barrelX + 18, -6, 3, 2);
      ctx.fillRect(barrelX + 18, 4, 3, 2);
      ctx.shadowBlur = 0;

      // Central Swivel Diamond
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(0, -10);
      ctx.lineTo(12, 0);
      ctx.lineTo(0, 10);
      ctx.closePath();
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Pulsing Glowing Central Reactor Core
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbital electron point around reactor
      const electronAngle = t * 4;
      ctx.beginPath();
      ctx.arc(
        Math.cos(electronAngle) * 11,
        Math.sin(electronAngle) * 11,
        1.8,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();
    };

    // 2. Nanite Bug (Emerald Cyber-Arachnid)
    const drawBug = (e: Enemy, t: number) => {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.angle + Math.PI); // Face movement direction

      // Animated 4 cyber-legs
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const side = i < 2 ? 1 : -1;
        const legIdx = i % 2;
        const legAnim = Math.sin(t * 14 + legIdx * Math.PI) * 4;
        const startX = legIdx === 0 ? 3 : -3;
        const startY = side * 6;
        const midX = startX + legAnim;
        const midY = side * 14;
        const tipX = midX - 3;
        const tipY = side * 17;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX, midY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
      }

      // Faceted Emerald Body
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-4, -8);
      ctx.lineTo(6, -6);
      ctx.lineTo(10, 0);
      ctx.lineTo(6, 6);
      ctx.lineTo(-4, 8);
      ctx.closePath();
      ctx.fillStyle = "#064e3b";
      ctx.fill();
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glowing Center Core
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#34d399";
      ctx.fill();

      ctx.restore();
    };

    // 3. 404 Quantum Hazard (Rose Warning Diamond)
    const draw404 = (e: Enemy, t: number) => {
      ctx.save();
      ctx.translate(e.x, e.y);

      // Counter-rotating outer hazard brackets
      ctx.save();
      ctx.rotate(-t * 2.5);
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 1.5;
      const bracketSize = e.radius + 3;
      // Draw 4 corner hazard ticks
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(bracketSize - 4, -bracketSize);
        ctx.lineTo(bracketSize, -bracketSize);
        ctx.lineTo(bracketSize, -bracketSize + 4);
        ctx.stroke();
      }
      ctx.restore();

      // Rotating Central Diamond
      ctx.save();
      ctx.rotate(t * 1.8);
      ctx.beginPath();
      ctx.moveTo(0, -e.radius);
      ctx.lineTo(e.radius, 0);
      ctx.lineTo(0, e.radius);
      ctx.lineTo(-e.radius, 0);
      ctx.closePath();
      ctx.fillStyle = "#4c0519";
      ctx.fill();
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Holographic 404 text inside
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("404", 0, 0);

      ctx.restore();
    };

    // 4. Memory Leak (Amethyst Faceted Gem & Orbiting Shards)
    const drawMemoryLeak = (e: Enemy, t: number) => {
      ctx.save();
      ctx.translate(e.x, e.y);

      // Orbiting 3 violet shards
      for (let i = 0; i < 3; i++) {
        const shardAngle = t * 2.5 + (i * Math.PI * 2) / 3;
        const sx = Math.cos(shardAngle) * (e.radius + 6);
        const sy = Math.sin(shardAngle) * (e.radius + 6);

        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#d8b4fe";
        ctx.fill();
      }

      // Crystalline Hexagonal Gem
      ctx.save();
      ctx.rotate(t * 0.8);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        const px = Math.cos(rad) * e.radius;
        const py = Math.sin(rad) * e.radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = "#3b0764";
      ctx.fill();
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner Crystal Facet lines
      ctx.strokeStyle = "rgba(216, 180, 254, 0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rad) * e.radius, Math.sin(rad) * e.radius);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore();
    };

    // 5. Infinite Loop (Amber Dual-Spinning Mobius Gyro)
    const drawInfiniteLoop = (e: Enemy, t: number) => {
      ctx.save();
      ctx.translate(e.x, e.y);

      ctx.strokeStyle = e.color;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 8;

      // Ring 1
      ctx.save();
      ctx.rotate(t * 3);
      ctx.beginPath();
      ctx.ellipse(0, 0, e.radius, e.radius * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Ring 2 (Perpendicular)
      ctx.save();
      ctx.rotate(-t * 3);
      ctx.beginPath();
      ctx.ellipse(0, 0, e.radius * 0.4, e.radius, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.shadowBlur = 0;

      // Central radiant plasma node
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();

      ctx.restore();
    };

    // 6. Ransomware Boss (Dreadnought Fortress Hex)
    const drawRansomwareBoss = (e: Enemy, t: number) => {
      ctx.save();
      ctx.translate(e.x, e.y);

      // Rotating Outer 6 Armored Shield Plates
      ctx.save();
      ctx.rotate(t * 0.5);
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 6; i++) {
        const angleStart = (i * Math.PI) / 3 + 0.1;
        const angleEnd = ((i + 1) * Math.PI) / 3 - 0.1;
        ctx.beginPath();
        ctx.arc(0, 0, e.radius + 6, angleStart, angleEnd);
        ctx.stroke();
      }
      ctx.restore();

      // Armored Hex Fortress Hull
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        const px = Math.cos(rad) * e.radius;
        const py = Math.sin(rad) * e.radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = "#450a0a";
      ctx.fill();
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pulsing Crimson Nuclear Eye
      const pulse = Math.sin(t * 5) * 2;
      ctx.beginPath();
      ctx.arc(0, 0, 10 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Crosshair Targeting Over Eye
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.moveTo(0, -12);
      ctx.lineTo(0, 12);
      ctx.stroke();

      // Top Floating Boss HP Bar
      const barW = 44;
      const barH = 5;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(-barW / 2, -e.radius - 14, barW, barH);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-barW / 2, -e.radius - 14, barW * (e.hp / e.maxHp), barH);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-barW / 2, -e.radius - 14, barW, barH);

      ctx.restore();
    };

    // 7. Floating Crystalline Power-Up Artifact
    const drawPowerUp = (p: PowerUp, t: number) => {
      ctx.save();
      const floatY = Math.sin(t * 4 + p.x) * 3;
      ctx.translate(p.x, p.y + floatY);

      // Rotating Outer Diamond Aura
      ctx.save();
      ctx.rotate(t * 2);
      ctx.beginPath();
      ctx.moveTo(0, -p.radius);
      ctx.lineTo(p.radius, 0);
      ctx.lineTo(0, p.radius);
      ctx.lineTo(-p.radius, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(10, 25, 47, 0.85)";
      ctx.fill();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Icon Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.icon, 0, 0.5);

      ctx.restore();
    };

    // Event listeners
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      const c = center();
      turretAngle = Math.atan2(mouseY - c.y, mouseX - c.x);
    };

    const onMouseDown = () => {
      if (gameStateRef.current === "playing") {
        isMouseDown = true;
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        const c = center();
        turretAngle = Math.atan2(mouseY - c.y, mouseX - c.x);
      }
    };

    const onTouchStart = () => {
      if (gameStateRef.current === "playing") {
        isMouseDown = true;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameStateRef.current === "playing") {
          shoot();
        }
      } else if (e.key === "p" || e.key === "P") {
        setGameState((prev) =>
          prev === "playing" ? "paused" : prev === "paused" ? "playing" : prev
        );
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onMouseUp);
    window.addEventListener("keydown", onKeyDown);

    // Main Game Loop
    const loop = (now: number) => {
      globalTime += 0.016;

      if (gameStateRef.current === "playing") {
        turretRecoil *= 0.85;

        // Handle Auto / Rapid firing
        const fireRate = powerRef.current.overclock > 0 ? 85 : 175;
        if (isMouseDown && now - lastShotTime > fireRate) {
          shoot();
          lastShotTime = now;
        }

        // Enemy spawning
        const spawnInterval = Math.max(450, 1500 - waveRef.current * 100);
        if (now - lastSpawnTime > spawnInterval) {
          spawnEnemy();
          lastSpawnTime = now;
        }

        // Wave progression
        const targetScoreForWave = waveRef.current * 600;
        if (scoreRef.current >= targetScoreForWave) {
          waveRef.current += 1;
          setWave(waveRef.current);
          addFloatingText(
            width / 2,
            height / 2 - 60,
            `⚡ WAVE ${waveRef.current} INCOMING!`,
            "#38bdf8"
          );
          sfx.playPowerup();
        }

        // Decrement Powerup timers
        if (powerRef.current.tri > 0) powerRef.current.tri -= 0.016;
        if (powerRef.current.overclock > 0)
          powerRef.current.overclock -= 0.016;

        if (powerRef.current.tri <= 0 && powerRef.current.overclock <= 0) {
          setActivePower(null);
        }

        // Combo decay
        if (now - lastHitTimeRef.current > 3000 && comboRef.current > 0) {
          comboRef.current = 0;
          setCombo(0);
        }
      }

      // Render Phase
      ctx.save();

      // Screen Shake
      if (screenShake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * screenShake,
          (Math.random() - 0.5) * screenShake
        );
        screenShake *= 0.88;
        if (screenShake < 0.2) screenShake = 0;
      }

      // Background Cyber Matrix
      ctx.fillStyle = "#07111e";
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid Lines
      ctx.strokeStyle = "rgba(15, 82, 186, 0.07)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const c = center();

      // Draw Center Sentry Turret
      drawTurret(
        c.x,
        c.y,
        turretAngle,
        turretRecoil,
        hpRef.current,
        globalTime
      );

      // Update & Render Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 5;
        sw.alpha -= 0.03;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = sw.alpha;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Update & Render Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (gameStateRef.current === "playing") {
          b.x += b.vx;
          b.y += b.vy;
          b.life -= 1;
        }

        // Elongated Plasma Bolt
        ctx.save();
        const bAngle = Math.atan2(b.vy, b.vx);
        ctx.translate(b.x, b.y);
        ctx.rotate(bAngle);

        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(2, 0, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();

        if (
          b.life <= 0 ||
          b.x < -20 ||
          b.x > width + 20 ||
          b.y < -20 ||
          b.y > height + 20
        ) {
          bullets.splice(i, 1);
        }
      }

      // Update & Render PowerUps
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const p = powerUps[i];
        if (gameStateRef.current === "playing") {
          p.duration -= 0.016;

          // Magnetize to center
          const distToCenter = Math.hypot(c.x - p.x, c.y - p.y);
          if (distToCenter < 46) {
            // Collect powerup!
            sfx.playPowerup();
            addShockwave(p.x, p.y, p.color, 40);
            if (p.type === "tri") {
              powerRef.current.tri = 8;
              setActivePower("⚡ TRI-BEAM ACTIVATED (8s)");
            } else if (p.type === "overclock") {
              powerRef.current.overclock = 6;
              setActivePower("🚀 OVERCLOCK HYPER-FIRE (6s)");
            } else if (p.type === "nuke") {
              triggerNuke();
            } else if (p.type === "shield") {
              hpRef.current = Math.min(100, hpRef.current + 35);
              setHp(hpRef.current);
              addFloatingText(
                c.x,
                c.y - 25,
                "🛡️ SHIELD RECHARGED +35%",
                "#10b981"
              );
            }
            powerUps.splice(i, 1);
            continue;
          }
        }

        drawPowerUp(p, globalTime);

        if (p.duration <= 0) {
          powerUps.splice(i, 1);
        }
      }

      // Update & Render Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];

        if (gameStateRef.current === "playing") {
          // Move towards center core
          const distToCenter = Math.hypot(c.x - e.x, c.y - e.y);
          const moveAngle = Math.atan2(c.y - e.y, c.x - e.x);

          if (e.type === "loop") {
            // Erratic spiral movement
            e.angle += 0.04;
            e.x += Math.cos(moveAngle) * e.speed + Math.cos(e.angle) * 2;
            e.y += Math.sin(moveAngle) * e.speed + Math.sin(e.angle) * 2;
          } else {
            e.x += Math.cos(moveAngle) * e.speed;
            e.y += Math.sin(moveAngle) * e.speed;
          }

          // Check Core Collision (Damage)
          if (distToCenter < 38 + e.radius) {
            sfx.playDamage();
            screenShake = 10;
            spawnParticles(e.x, e.y, e.color, 16);
            addShockwave(c.x, c.y, "#ef4444", 50);
            hpRef.current -= e.type === "boss" ? 40 : 15;
            setHp(Math.max(0, hpRef.current));

            enemies.splice(i, 1);

            if (hpRef.current <= 0) {
              setGameState("gameover");
              if (scoreRef.current > highScore) {
                setHighScore(scoreRef.current);
                localStorage.setItem(
                  "cybersentry_highscore",
                  scoreRef.current.toString()
                );
              }
            }
            continue;
          }

          // Bullet Collision
          for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            const dist = Math.hypot(e.x - b.x, e.y - b.y);

            if (dist < e.radius + b.radius) {
              bullets.splice(j, 1);
              e.hp -= 1;
              spawnParticles(b.x, b.y, b.color, 4);

              if (e.hp <= 0) {
                // Enemy Destroyed
                sfx.playExplode(e.type === "boss");
                spawnParticles(e.x, e.y, e.color, e.type === "boss" ? 32 : 14);
                addShockwave(
                  e.x,
                  e.y,
                  e.color,
                  e.type === "boss" ? 80 : 35
                );

                // Combo calculation
                comboRef.current += 1;
                lastHitTimeRef.current = now;
                setCombo(comboRef.current);

                const pointBase =
                  e.type === "boss"
                    ? 500
                    : e.type === "leak"
                    ? 40
                    : e.type === "404"
                    ? 30
                    : 20;
                const earnedPoints =
                  pointBase *
                  (1 + Math.min(5, Math.floor(comboRef.current / 5)));
                scoreRef.current += earnedPoints;
                setScore(scoreRef.current);

                addFloatingText(e.x, e.y - 12, `+${earnedPoints}`, e.color);

                // Chance of powerup drop (22%)
                if (Math.random() < 0.22) {
                  const pTypes: PowerUp["type"][] = [
                    "tri",
                    "overclock",
                    "nuke",
                    "shield",
                  ];
                  const pType =
                    pTypes[Math.floor(Math.random() * pTypes.length)];
                  const pMeta = {
                    tri: { icon: "3X", color: "#38bdf8" },
                    overclock: { icon: "⚡", color: "#eab308" },
                    nuke: { icon: "💣", color: "#ef4444" },
                    shield: { icon: "🛡️", color: "#10b981" },
                  }[pType];

                  powerUps.push({
                    x: e.x,
                    y: e.y,
                    type: pType,
                    icon: pMeta.icon,
                    color: pMeta.color,
                    radius: 12,
                    duration: 10,
                    rotation: 0,
                  });
                }

                enemies.splice(i, 1);
                break;
              }
            }
          }
        }

        // Render Enemy using specialized procedural vector artwork
        if (e.type === "bug") {
          drawBug(e, globalTime);
        } else if (e.type === "404") {
          draw404(e, globalTime);
        } else if (e.type === "leak") {
          drawMemoryLeak(e, globalTime);
        } else if (e.type === "loop") {
          drawInfiniteLoop(e, globalTime);
        } else if (e.type === "boss") {
          drawRansomwareBoss(e, globalTime);
        }
      }

      // Update & Render Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Update & Render Floating Text
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 0.8;
        ft.alpha -= 0.02;

        if (ft.alpha <= 0) {
          floatingTexts.splice(i, 1);
          continue;
        }

        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.alpha;
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [highScore]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-sapphire-300/40 bg-[#07111e] shadow-2xl">
      {/* Top Glass Arcade Header HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0a192f]/90 border-b border-slate-800/80 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#38bdf8] animate-pulse" />
            <span className="font-bold text-white tracking-wider">
              CYBER_SENTRY // V2.0
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>HI: {highScore}</span>
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="flex items-center gap-4">
          {/* Core Health Bar */}
          <div className="flex items-center gap-2">
            <Shield
              className={`w-4 h-4 ${
                hp < 30 ? "text-red-500 animate-bounce" : "text-[#38bdf8]"
              }`}
            />
            <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-200 ${
                  hp > 50
                    ? "bg-emerald-500"
                    : hp > 25
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${hp}%` }}
              />
            </div>
            <span className="font-bold text-white">{hp}%</span>
          </div>

          {/* Wave & Combo */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/50 text-[#38bdf8] font-bold">
              WAVE {wave}
            </span>
            {combo > 1 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                <Flame className="w-3 h-3" />
                <span>{combo}x</span>
              </span>
            )}
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Active Powerup Banner */}
      {activePower && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold backdrop-blur-md animate-pulse shadow-lg">
          {activePower}
        </div>
      )}

      {/* Main Canvas Arena */}
      <div className="relative w-full h-[470px] cursor-crosshair">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Start Screen Overlay with Visual Enemy Preview Guide */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-[#07111e]/92 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="p-3.5 rounded-3xl bg-blue-500/10 border border-[#0f52ba]/40 mb-3 shadow-xl">
              <Zap className="w-9 h-9 text-[#38bdf8] animate-bounce" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1.5">
              CYBER SENTRY: FIREWALL DEFENSE
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
              Defend your system core against incoming cyber threats. Aim with mouse/touch, collect floating power-up crystals, and survive the onslaught.
            </p>

            {/* Aesthetic Character & Threat Showcase */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg mb-5 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300">Nanite Bug</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-rose-500/30 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
                <span className="text-rose-300">404 Hazard</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-purple-500/30 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-purple-300">Memory Leak</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300">Infinite Loop</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-5 text-[11px] font-mono text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700">🎯 Aim: Mouse / Touch</span>
              <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700">⚡ Fire: Click / Space</span>
              <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700">⏸️ Pause: P key</span>
            </div>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0f52ba] to-[#2563eb] hover:from-blue-600 hover:to-cyan-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-700/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ENGAGE FIREWALL DEFENSE</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-[#07111e]/94 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 mb-3 text-red-400 font-mono text-xs font-bold tracking-widest uppercase animate-pulse">
              SYSTEM INTEGRITY COMPROMISED
            </div>

            <h3 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              CORE BREACHED
            </h3>

            <div className="grid grid-cols-2 gap-4 my-4 p-4 rounded-xl bg-slate-800/70 border border-slate-700 font-mono text-xs min-w-[240px]">
              <div>
                <span className="text-slate-400 block text-[10px]">FINAL SCORE</span>
                <span className="text-xl font-bold text-[#38bdf8]">{score}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">WAVES CLEARED</span>
                <span className="text-xl font-bold text-amber-400">{wave}</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#0f52ba] to-[#2563eb] text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-700/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REBOOT FIREWALL</span>
            </button>
          </div>
        )}

        {/* Pause Overlay */}
        {gameState === "paused" && (
          <div className="absolute inset-0 bg-[#07111e]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <Pause className="w-12 h-12 text-[#38bdf8] mb-3" />
            <h3 className="text-2xl font-bold text-white mb-4">SYSTEM PAUSED</h3>
            <button
              onClick={() => setGameState("playing")}
              className="px-6 py-2.5 rounded-full bg-[#0f52ba] text-white font-bold text-xs shadow-md hover:bg-blue-600 transition-all cursor-pointer"
            >
              RESUME MISSION
            </button>
          </div>
        )}
      </div>

      {/* Bottom Live Score Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0a192f] border-t border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span>SCORE:</span>
          <span className="text-base font-bold text-white">{score}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-500 hidden sm:inline">
            Artifacts: Tri-Beam (3X) · Overclock (⚡) · EMP (💣) · Shield (🛡️)
          </span>
        </div>
      </div>
    </div>
  );
}
