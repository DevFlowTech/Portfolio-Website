"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Gauge,
  Trophy,
  Flame,
  HelpCircle,
} from "lucide-react";

// Web Audio Engine for Real-Time Engine Revs & Tire Screeches
class DriftAudio {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private screechSource: AudioBufferSourceNode | null = null;
  private screechGain: GainNode | null = null;
  public enabled: boolean = true;
  private isRunning: boolean = false;

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

  startEngine() {
    if (!this.enabled || this.isRunning) return;
    this.init();
    if (!this.ctx) return;

    try {
      // 1. Engine Oscillator
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineOsc.type = "sawtooth";
      this.engineOsc.frequency.setValueAtTime(65, this.ctx.currentTime);
      this.engineGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();

      // 2. Continuous Looping Tire Screech White Noise Buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.screechSource = this.ctx.createBufferSource();
      this.screechSource.buffer = buffer;
      this.screechSource.loop = true;

      const screechFilter = this.ctx.createBiquadFilter();
      screechFilter.type = "bandpass";
      screechFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      screechFilter.Q.setValueAtTime(3, this.ctx.currentTime);

      this.screechGain = this.ctx.createGain();
      this.screechGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.screechSource.connect(screechFilter);
      screechFilter.connect(this.screechGain);
      this.screechGain.connect(this.ctx.destination);
      this.screechSource.start();

      this.isRunning = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  updateAudio(speedRatio: number, isDrifting: boolean, driftIntensity: number) {
    if (!this.enabled || !this.ctx) return;

    if (!this.isRunning && (speedRatio > 0.05 || isDrifting)) {
      this.startEngine();
    }

    // Modulate Engine Pitch & Volume
    if (this.engineOsc && this.engineGain) {
      const targetFreq = 55 + Math.abs(speedRatio) * 160;
      this.engineOsc.frequency.setTargetAtTime(
        targetFreq,
        this.ctx.currentTime,
        0.05,
      );
      const targetGain = 0.03 + Math.abs(speedRatio) * 0.05;
      this.engineGain.gain.setTargetAtTime(
        targetGain,
        this.ctx.currentTime,
        0.05,
      );
    }

    // Modulate Tire Screech Intensity
    if (this.screechGain) {
      const targetScreechGain =
        isDrifting && Math.abs(speedRatio) > 0.25
          ? Math.min(0.12, driftIntensity * 0.12)
          : 0;
      this.screechGain.gain.setTargetAtTime(
        targetScreechGain,
        this.ctx.currentTime,
        0.04,
      );
    }
  }

  playNitro() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  stopAll() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
      } catch {}
      this.engineOsc = null;
    }
    if (this.screechSource) {
      try {
        this.screechSource.stop();
      } catch {}
      this.screechSource = null;
    }
    this.isRunning = false;
  }
}

const audio = new DriftAudio();

interface TireSmoke {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface SkidMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
}

export default function DriftGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // React State for HUD
  const [speedKmh, setSpeedKmh] = useState(0);
  const [driftScore, setDriftScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isDriftingState, setIsDriftingState] = useState(false);
  const [nitroFuel, setNitroFuel] = useState(100);
  const [bankedAlert, setBankedAlert] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  // Input states (supporting keyboard and touch)
  const keysRef = useRef<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    handbrake: boolean;
    nitro: boolean;
  }>({
    up: false,
    down: false,
    left: false,
    right: false,
    handbrake: false,
    nitro: false,
  });

  // Load high score
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("apexdrift_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audio.enabled = next;
    if (!next) audio.stopAll();
  };

  const resetCar = useCallback(() => {
    setDriftScore(0);
    setMultiplier(1);
    setIsDriftingState(false);
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

    // ==========================================
    // VEHICLE PHYSICS MODEL
    // ==========================================
    const car = {
      x: width / 2,
      y: height / 2 + 100,
      angle: -Math.PI / 2, // Facing Up
      speed: 0,
      maxSpeed: 7.5,
      maxReverse: -3.0,
      acceleration: 0.16,
      deceleration: 0.08,
      turnSpeed: 0.052,
      driftFriction: 0.94, // Lateral grip
      tractionGrip: 0.88,
      width: 24,
      length: 44,
      color: "#0f52ba", // Sapphire Blue Body
      prevLeftTire: { x: 0, y: 0 },
      prevRightTire: { x: 0, y: 0 },
    };

    let vx = 0;
    let vy = 0;
    let nitro = 100;
    let currentDriftPoints = 0;
    let currentMultiplier = 1;
    let driftDuration = 0;
    let lastBankTime = 0;

    let particles: TireSmoke[] = [];
    let skidMarks: SkidMark[] = [];

    // ==========================================
    // TARMAC TRACK DEFINITION
    // ==========================================
    const trackInnerRadiusX = () => width * 0.28;
    const trackInnerRadiusY = () => height * 0.26;
    const trackOuterRadiusX = () => width * 0.44;
    const trackOuterRadiusY = () => height * 0.42;

    // Key handlers
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) keysRef.current.up = true;
      if (["ArrowDown", "KeyS"].includes(e.code)) keysRef.current.down = true;
      if (["ArrowLeft", "KeyA"].includes(e.code)) keysRef.current.left = true;
      if (["ArrowRight", "KeyD"].includes(e.code)) keysRef.current.right = true;
      if (e.code === "Space") {
        e.preventDefault();
        keysRef.current.handbrake = true;
      }
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        keysRef.current.nitro = true;
        audio.playNitro();
      }
      if (e.code === "KeyR") {
        car.x = width / 2;
        car.y = height / 2 + 100;
        car.angle = -Math.PI / 2;
        car.speed = 0;
        vx = 0;
        vy = 0;
        skidMarks = [];
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) keysRef.current.up = false;
      if (["ArrowDown", "KeyS"].includes(e.code)) keysRef.current.down = false;
      if (["ArrowLeft", "KeyA"].includes(e.code)) keysRef.current.left = false;
      if (["ArrowRight", "KeyD"].includes(e.code))
        keysRef.current.right = false;
      if (e.code === "Space") keysRef.current.handbrake = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight")
        keysRef.current.nitro = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // ==========================================
    // MAIN DRIFT SIMULATION LOOP
    // ==========================================
    const loop = () => {
      const keys = keysRef.current;
      const isNitro = keys.nitro && nitro > 2 && keys.up;

      // 1. Throttle / Acceleration & Nitro
      const topSpeed = isNitro ? car.maxSpeed * 1.45 : car.maxSpeed;
      const accelRate = isNitro ? car.acceleration * 1.8 : car.acceleration;

      if (isNitro) {
        nitro = Math.max(0, nitro - 0.6);
        setNitroFuel(Math.round(nitro));
      } else if (nitro < 100) {
        nitro = Math.min(100, nitro + 0.12);
        setNitroFuel(Math.round(nitro));
      }

      if (keys.up) {
        if (car.speed < topSpeed) car.speed += accelRate;
      } else if (keys.down) {
        if (car.speed > car.maxReverse) car.speed -= car.acceleration * 0.9;
      } else {
        // Natural friction coasting
        if (car.speed > 0)
          car.speed = Math.max(0, car.speed - car.deceleration);
        else if (car.speed < 0)
          car.speed = Math.min(0, car.speed + car.deceleration);
      }

      // 2. Steering & Handbrake Slip
      const effectiveTurn = car.turnSpeed * (keys.handbrake ? 1.45 : 1.0);
      if (Math.abs(car.speed) > 0.2) {
        const dir = car.speed > 0 ? 1 : -1;
        if (keys.left) car.angle -= effectiveTurn * dir;
        if (keys.right) car.angle += effectiveTurn * dir;
      }

      // 3. Velocity Vectors & Drift Angle Calculation
      const forwardX = Math.cos(car.angle) * car.speed;
      const forwardY = Math.sin(car.angle) * car.speed;

      // Blend between forward direction and current momentum (Traction vs Slip)
      const grip = keys.handbrake ? 0.88 : car.tractionGrip;
      vx = vx * grip + forwardX * (1 - grip);
      vy = vy * grip + forwardY * (1 - grip);

      car.x += vx;
      car.y += vy;

      // Calculate Drift Slip Angle
      const currentVelAngle = Math.atan2(vy, vx);
      let angleDiff = Math.abs(car.angle - currentVelAngle);
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      angleDiff = Math.abs(angleDiff);

      const actualSpeed = Math.hypot(vx, vy);
      const isDrifting =
        (angleDiff > 0.35 || keys.handbrake) && actualSpeed > 2.2;
      const driftIntensity = Math.min(1, (angleDiff * actualSpeed) / 4.5);

      setIsDriftingState(isDrifting);
      setSpeedKmh(Math.round(actualSpeed * 22));

      // Audio update
      audio.updateAudio(actualSpeed / car.maxSpeed, isDrifting, driftIntensity);

      // 4. Rear Wheel Positions (for smoke and skid marks)
      const rearAxleDist = car.length * 0.35;
      const trackWidth = car.width * 0.42;

      const rearCenterX = car.x - Math.cos(car.angle) * rearAxleDist;
      const rearCenterY = car.y - Math.sin(car.angle) * rearAxleDist;

      const leftTireX =
        rearCenterX + Math.cos(car.angle - Math.PI / 2) * trackWidth;
      const leftTireY =
        rearCenterY + Math.sin(car.angle - Math.PI / 2) * trackWidth;

      const rightTireX =
        rearCenterX + Math.cos(car.angle + Math.PI / 2) * trackWidth;
      const rightTireY =
        rearCenterY + Math.sin(car.angle + Math.PI / 2) * trackWidth;

      // 5. Generate Tire Smoke & Skid Marks
      if (isDrifting) {
        driftDuration += 0.016;

        // Points & Multipliers
        const addedPoints = Math.round(actualSpeed * angleDiff * 4.5);
        currentDriftPoints += addedPoints;

        if (driftDuration > 1.2 && currentMultiplier < 5) {
          currentMultiplier = Math.min(5, Math.floor(driftDuration / 1.0) + 1);
        }

        setDriftScore(currentDriftPoints * currentMultiplier);
        setMultiplier(currentMultiplier);

        // Smoke particles
        for (let i = 0; i < 2; i++) {
          const tX = i === 0 ? leftTireX : rightTireX;
          const tY = i === 0 ? leftTireY : rightTireY;

          particles.push({
            x: tX + (Math.random() - 0.5) * 4,
            y: tY + (Math.random() - 0.5) * 4,
            vx: -vx * 0.15 + (Math.random() - 0.5) * 1.5,
            vy: -vy * 0.15 + (Math.random() - 0.5) * 1.5,
            radius: Math.random() * 5 + 4,
            alpha: 0.55,
            color: "rgba(220, 235, 255, 0.4)",
          });
        }

        // Skid marks
        if (car.prevLeftTire.x !== 0) {
          skidMarks.push({
            x1: car.prevLeftTire.x,
            y1: car.prevLeftTire.y,
            x2: leftTireX,
            y2: leftTireY,
            alpha: Math.min(0.4, driftIntensity * 0.4),
          });
          skidMarks.push({
            x1: car.prevRightTire.x,
            y1: car.prevRightTire.y,
            x2: rightTireX,
            y2: rightTireY,
            alpha: Math.min(0.4, driftIntensity * 0.4),
          });
          if (skidMarks.length > 500) skidMarks.splice(0, 2);
        }
      } else {
        // Bank Drift Points on Clean Recovery!
        if (currentDriftPoints > 0) {
          const earned = currentDriftPoints * currentMultiplier;
          setTotalScore((prev) => {
            const next = prev + earned;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem("apexdrift_highscore", next.toString());
            }
            return next;
          });

          setBankedAlert(`+${earned} PTS BANKED!`);
          setTimeout(() => setBankedAlert(null), 1800);

          currentDriftPoints = 0;
          currentMultiplier = 1;
          driftDuration = 0;
          setDriftScore(0);
          setMultiplier(1);
        }
      }

      // Nitro exhaust flames
      if (isNitro) {
        for (let i = 0; i < 2; i++) {
          const exhaustX = car.x - Math.cos(car.angle) * (car.length * 0.55);
          const exhaustY = car.y - Math.sin(car.angle) * (car.length * 0.55);
          particles.push({
            x: exhaustX,
            y: exhaustY,
            vx: -Math.cos(car.angle) * 5 + (Math.random() - 0.5) * 2,
            vy: -Math.sin(car.angle) * 5 + (Math.random() - 0.5) * 2,
            radius: Math.random() * 4 + 2,
            alpha: 0.8,
            color: Math.random() > 0.5 ? "#38bdf8" : "#2563eb",
          });
        }
      }

      car.prevLeftTire = { x: leftTireX, y: leftTireY };
      car.prevRightTire = { x: rightTireX, y: rightTireY };

      // 6. Track Wall / Barrier Collision Physics
      const cx = width / 2;
      const cy = height / 2;
      const distToCenter = Math.hypot(car.x - cx, car.y - cy);

      // Outer boundary bounce
      const maxDist = Math.min(width, height) * 0.46;
      const minDist = Math.min(width, height) * 0.16;

      if (distToCenter > maxDist) {
        const wallAngle = Math.atan2(car.y - cy, car.x - cx);
        car.x = cx + Math.cos(wallAngle) * maxDist;
        car.y = cy + Math.sin(wallAngle) * maxDist;
        vx *= -0.4;
        vy *= -0.4;
        car.speed *= 0.4;
        if (currentDriftPoints > 0) {
          // Crash penalty
          setBankedAlert("💥 WALL HIT! DRIFT LOST");
          setTimeout(() => setBankedAlert(null), 1200);
          currentDriftPoints = 0;
          setDriftScore(0);
        }
      } else if (distToCenter < minDist) {
        const wallAngle = Math.atan2(car.y - cy, car.x - cx);
        car.x = cx + Math.cos(wallAngle) * minDist;
        car.y = cy + Math.sin(wallAngle) * minDist;
        vx *= -0.4;
        vy *= -0.4;
        car.speed *= 0.4;
      }

      // ==========================================
      // RENDER PHASE
      // ==========================================
      ctx.clearRect(0, 0, width, height);

      // Dark Asphalt Floor
      ctx.fillStyle = "#0c1322";
      ctx.fillRect(0, 0, width, height);

      // Cyber Track Circuit Lines
      ctx.save();
      ctx.translate(cx, cy);

      // Outer Barrier Ring (Neon Sapphire)
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        trackOuterRadiusX(),
        trackOuterRadiusY(),
        0,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = "rgba(15, 82, 186, 0.35)";
      ctx.lineWidth = 14;
      ctx.stroke();

      // Outer Curbing (Red & White Stripes)
      ctx.setLineDash([16, 16]);
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner Island Barrier
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        trackInnerRadiusX(),
        trackInnerRadiusY(),
        0,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "#070c18";
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      ctx.lineWidth = 8;
      ctx.stroke();

      // Center Finish / Apex Marker
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 82, 186, 0.1)";
      ctx.fill();
      ctx.strokeStyle = "rgba(15, 82, 186, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // Draw Persistent Rubber Skid Marks
      ctx.lineWidth = 3.5;
      for (let i = 0; i < skidMarks.length; i++) {
        const sm = skidMarks[i];
        ctx.beginPath();
        ctx.moveTo(sm.x1, sm.y1);
        ctx.lineTo(sm.x2, sm.y2);
        ctx.strokeStyle = `rgba(5, 10, 20, ${sm.alpha})`;
        ctx.stroke();
      }

      // Draw Headlights Beam
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);

      const lightGrad = ctx.createRadialGradient(28, 0, 10, 160, 0, 140);
      lightGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      lightGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.18)");
      lightGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

      ctx.beginPath();
      ctx.moveTo(20, -7);
      ctx.lineTo(190, -70);
      ctx.lineTo(190, 70);
      ctx.lineTo(20, 7);
      ctx.closePath();
      ctx.fillStyle = lightGrad;
      ctx.fill();

      // Draw Detailed JDM / Cyber Sports Car
      // 1. Car Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(
        -car.length * 0.5 + 2,
        -car.width * 0.5 + 3,
        car.length,
        car.width,
      );

      // 2. Wheels
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-car.length * 0.35, -car.width * 0.5 - 2, 9, 4); // Front Left
      ctx.fillRect(-car.length * 0.35, car.width * 0.5 - 2, 9, 4); // Front Right
      ctx.fillRect(car.length * 0.2, -car.width * 0.5 - 2, 9, 4); // Rear Left
      ctx.fillRect(car.length * 0.2, car.width * 0.5 - 2, 9, 4); // Rear Right

      // 3. Aerodynamic Sports Body
      ctx.beginPath();
      ctx.roundRect(
        -car.length * 0.5,
        -car.width * 0.5,
        car.length,
        car.width,
        [6, 12, 12, 6],
      );
      const bodyGrad = ctx.createLinearGradient(-20, 0, 20, 0);
      bodyGrad.addColorStop(0, "#0a192f");
      bodyGrad.addColorStop(0.5, "#0f52ba");
      bodyGrad.addColorStop(1, "#2563eb");
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 4. Tinted Windshield & Cockpit
      ctx.fillStyle = "#050b14";
      ctx.beginPath();
      ctx.roundRect(
        -car.length * 0.15,
        -car.width * 0.36,
        car.length * 0.45,
        car.width * 0.72,
        3,
      );
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 5. Rear Carbon Spoiler Wing
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-car.length * 0.48, -car.width * 0.45, 4, car.width * 0.9);
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(-car.length * 0.48, -car.width * 0.45, 4, car.width * 0.9);

      // 6. Glowing Headlights & Taillights
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 8;
      ctx.fillRect(car.length * 0.46, -car.width * 0.42, 3, 4); // Left Light
      ctx.fillRect(car.length * 0.46, car.width * 0.42 - 4, 3, 4); // Right Light

      // Red Taillights
      ctx.fillStyle = isDrifting || keys.down ? "#ef4444" : "#991b1b";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = isDrifting ? 12 : 4;
      ctx.fillRect(-car.length * 0.5, -car.width * 0.4, 2, 4);
      ctx.fillRect(-car.length * 0.5, car.width * 0.4 - 4, 2, 4);
      ctx.shadowBlur = 0;

      ctx.restore();

      // Update & Render Smoke Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += 0.35;
        p.alpha -= 0.02;

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

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(animationFrameId);
      audio.stopAll();
    };
  }, [highScore]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-sapphire-300/40 bg-[#07111e] shadow-2xl">
      {/* Top Glass Arcade Header HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0a192f]/90 border-b border-slate-800/80 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#38bdf8] animate-pulse" />
            <span className="font-bold text-white tracking-wider">
              APEX_DRIFT // CIRCUIT LAB
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BEST: {highScore}</span>
          </div>
        </div>

        {/* Live Drift Metrics */}
        <div className="flex items-center gap-4">
          {/* Speedometer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200">
            <Gauge className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="font-bold text-white">{speedKmh}</span>
            <span className="text-[10px] text-slate-400">KM/H</span>
          </div>

          {/* Nitro Gauge */}
          <div className="flex items-center gap-1.5">
            <Zap
              className={`w-3.5 h-3.5 ${nitroFuel > 20 ? "text-[#38bdf8]" : "text-slate-600"}`}
            />
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-100"
                style={{ width: `${nitroFuel}%` }}
              />
            </div>
          </div>

          {/* Sound & Controls */}
          <div className="flex items-center gap-1.5">
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

            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Controls help"
            >
              <HelpCircle className="w-4 h-4 text-[#38bdf8]" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Drift Score & Multiplier HUD */}
      {isDriftingState && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="px-5 py-1.5 rounded-full bg-blue-600/30 border border-cyan-400/60 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md animate-bounce shadow-xl flex items-center gap-2">
            <span>DRIFTING</span>
            <span className="text-white text-sm">+{driftScore}</span>
            {multiplier > 1 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[10px] font-extrabold">
                {multiplier}X
              </span>
            )}
          </div>
        </div>
      )}

      {/* Banked Points Alert */}
      {bankedAlert && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold backdrop-blur-md shadow-lg animate-pulse pointer-events-none">
          {bankedAlert}
        </div>
      )}

      {/* Controls Help Overlay */}
      {showHelp && (
        <div className="absolute inset-0 bg-[#07111e]/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">HOW TO DRIFT</h3>
          <div className="grid grid-cols-2 gap-3 max-w-sm text-left text-xs font-mono text-slate-300 mb-6">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[#38bdf8] block font-bold">W / ↑</span>
              <span>Accelerate Gas</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[#38bdf8] block font-bold">S / ↓</span>
              <span>Brake / Reverse</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[#38bdf8] block font-bold">
                A & D / ← →
              </span>
              <span>Steer Left / Right</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-400 font-bold">
              <span className="text-amber-300 block font-bold">SPACEBAR</span>
              <span>HANDBRAKE (E-Brake Drift)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-cyan-400 font-bold col-span-2">
              <span className="text-cyan-300 block font-bold">SHIFT KEY</span>
              <span>NITRO BOOST (NOS Flames)</span>
            </div>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="px-6 py-2 rounded-full bg-[#0f52ba] text-white font-bold text-xs hover:bg-blue-600 transition-all cursor-pointer"
          >
            GOT IT, LET&apos;S RACE
          </button>
        </div>
      )}

      {/* Main Drift Canvas Arena */}
      <div className="relative w-full h-[470px]">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* On-Screen Mobile Touch Controls */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-auto sm:hidden">
          {/* Steering Arrows */}
          <div className="flex gap-2">
            <button
              onTouchStart={() => (keysRef.current.left = true)}
              onTouchEnd={() => (keysRef.current.left = false)}
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 active:bg-[#0f52ba] text-white font-bold flex items-center justify-center text-lg select-none"
            >
              ◀
            </button>
            <button
              onTouchStart={() => (keysRef.current.right = true)}
              onTouchEnd={() => (keysRef.current.right = false)}
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 active:bg-[#0f52ba] text-white font-bold flex items-center justify-center text-lg select-none"
            >
              ▶
            </button>
          </div>

          {/* Gas & Handbrake */}
          <div className="flex gap-2">
            <button
              onTouchStart={() => (keysRef.current.handbrake = true)}
              onTouchEnd={() => (keysRef.current.handbrake = false)}
              onMouseDown={() => (keysRef.current.handbrake = true)}
              onMouseUp={() => (keysRef.current.handbrake = false)}
              className="w-12 h-12 rounded-2xl bg-amber-600/70 border border-amber-400 active:bg-amber-500 text-white font-bold flex items-center justify-center text-xs select-none"
            >
              DRIFT
            </button>
            <button
              onTouchStart={() => (keysRef.current.up = true)}
              onTouchEnd={() => (keysRef.current.up = false)}
              onMouseDown={() => (keysRef.current.up = true)}
              onMouseUp={() => (keysRef.current.up = false)}
              className="w-12 h-12 rounded-2xl bg-blue-600/80 border border-cyan-400 active:bg-blue-500 text-white font-bold flex items-center justify-center text-sm select-none"
            >
              GAS
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Live Score Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0a192f] border-t border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span>BANKED SCORE:</span>
          <span className="text-base font-bold text-white">{totalScore}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-500 hidden sm:inline">
            Controls: WASD / Arrows to Drive · Space for Handbrake Slide · Shift
            for Nitro · R to Reset
          </span>
        </div>
      </div>
    </div>
  );
}
