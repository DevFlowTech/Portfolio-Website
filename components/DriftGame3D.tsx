"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Volume2,
  VolumeX,
  Zap,
  Gauge,
  Trophy,
  Flame,
  HelpCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";

// ==========================================
// REALISTIC PROCEDURAL AUDIO ENGINE
// ==========================================
class RealisticDriftAudio {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private screechSource: AudioBufferSourceNode | null = null;
  private screechGain: GainNode | null = null;
  public enabled: boolean = true;
  private isRunning: boolean = false;
  private revLimiterTime: number = 0;

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

  start() {
    if (!this.enabled || this.isRunning) return;
    this.init();
    if (!this.ctx) return;

    try {
      // 1. Primary Engine Oscillator
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineOsc.type = "sawtooth";
      this.engineOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
      this.engineGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      // Lowpass filter for deep throaty combustion tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();

      // 2. Sub-bass rumble for exhaust weight
      this.subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      this.subOsc.type = "triangle";
      this.subOsc.frequency.setValueAtTime(32, this.ctx.currentTime);
      subGain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      this.subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      this.subOsc.start();

      // 3. Continuous Looping Tire Screech White Noise Buffer
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
      screechFilter.frequency.setValueAtTime(1450, this.ctx.currentTime);
      screechFilter.Q.setValueAtTime(3.8, this.ctx.currentTime);

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

  update(rpm: number, isDrifting: boolean, driftIntensity: number, isRevLimiter: boolean) {
    if (!this.enabled || !this.ctx) return;

    if (!this.isRunning) {
      this.start();
    }

    const now = this.ctx.currentTime;

    // Engine Pitch & Rev Limiter Stutter
    if (this.engineOsc && this.engineGain) {
      let freq = 45 + (rpm / 7500) * 190;
      let gain = 0.035 + (rpm / 7500) * 0.055;

      if (isRevLimiter) {
        if (now - this.revLimiterTime > 0.07) {
          this.revLimiterTime = now;
        }
        if (now - this.revLimiterTime < 0.035) {
          gain *= 0.2;
          freq -= 15;
        }
      }

      this.engineOsc.frequency.setTargetAtTime(freq, now, 0.03);
      this.engineGain.gain.setTargetAtTime(gain, now, 0.03);
    }

    if (this.subOsc) {
      const subFreq = 28 + (rpm / 7500) * 35;
      this.subOsc.frequency.setTargetAtTime(subFreq, now, 0.04);
    }

    // Tire Screech Volume and Frequency scaling with slip intensity
    if (this.screechGain) {
      const targetGain = isDrifting ? Math.min(0.14, driftIntensity * 0.14) : 0;
      this.screechGain.gain.setTargetAtTime(targetGain, now, 0.04);
    }
  }

  playNitro() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  stopAll() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
      } catch {}
      this.engineOsc = null;
    }
    if (this.subOsc) {
      try {
        this.subOsc.stop();
      } catch {}
      this.subOsc = null;
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

const audio = new RealisticDriftAudio();

// Procedural Realistic Asphalt Texture
function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#151922";
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro grain
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 26;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain + 3));
  }
  ctx.putImageData(imgData, 0, 0);

  // Painted Road Dividing Markings
  ctx.strokeStyle = "rgba(234, 179, 8, 0.45)";
  ctx.lineWidth = 12;
  ctx.setLineDash([70, 45]);
  ctx.beginPath();
  ctx.moveTo(512, 0);
  ctx.lineTo(512, 1024);
  ctx.stroke();
  ctx.setLineDash([]);

  // White lane borders
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(120, 0);
  ctx.lineTo(120, 1024);
  ctx.moveTo(904, 0);
  ctx.lineTo(904, 1024);
  ctx.stroke();

  // Dark oil / rubber stains
  ctx.fillStyle = "rgba(8, 10, 14, 0.3)";
  for (let j = 0; j < 10; j++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    ctx.beginPath();
    ctx.ellipse(rx, ry, Math.random() * 90 + 30, Math.random() * 24 + 8, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(14, 14);
  return texture;
}

export default function DriftGame3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // HUD State
  const [speedKmh, setSpeedKmh] = useState(0);
  const [rpm, setRpm] = useState(1000);
  const [gear, setGear] = useState(1);
  const [driftScore, setDriftScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isDrifting, setIsDrifting] = useState(false);
  const [nitroFuel, setNitroFuel] = useState(100);
  const [bankedAlert, setBankedAlert] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Input State Refs
  const keysRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    handbrake: false,
    nitro: false,
  });

  // Load High Score
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("apexdrift3d_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audio.enabled = next;
    if (!next) audio.stopAll();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080c14");
    scene.fog = new THREE.FogExp2("#080c14", 0.0065);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 7, -14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.45);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x93c5fd, 0.85);
    moonLight.position.set(70, 120, 60);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 10;
    moonLight.shadow.camera.far = 300;
    moonLight.shadow.camera.left = -90;
    moonLight.shadow.camera.right = 90;
    moonLight.shadow.camera.top = 90;
    moonLight.shadow.camera.bottom = -90;
    scene.add(moonLight);

    // 3. Ground Arena with Realistic Asphalt
    const arenaSize = 360;
    const asphaltTexture = createAsphaltTexture();
    const groundGeo = new THREE.PlaneGeometry(arenaSize, arenaSize);
    const groundMat = new THREE.MeshStandardMaterial({
      map: asphaltTexture,
      roughness: 0.82,
      metalness: 0.18,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 4. Urban Freeroam Obstacles & Lighting Poles
    const colliders: { x: number; z: number; radius: number }[] = [];

    const containerMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.55, metalness: 0.2 });
    const containerMatBlue = new THREE.MeshStandardMaterial({ color: 0x0f52ba, roughness: 0.55, metalness: 0.3 });
    const containerMatOrange = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.55, metalness: 0.2 });

    const createContainer = (x: number, z: number, rotY: number, mat: THREE.Material) => {
      const geo = new THREE.BoxGeometry(6.5, 4.6, 14.5);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 2.3, z);
      mesh.rotation.y = rotY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      colliders.push({ x, z, radius: 5.8 });
    };

    createContainer(-42, -32, 0.4, containerMatBlue);
    createContainer(-36, -48, 0.4, containerMatOrange);
    createContainer(52, -42, -0.3, containerMatRed);
    createContainer(64, 22, 1.2, containerMatBlue);
    createContainer(-58, 46, -0.8, containerMatOrange);
    createContainer(36, 68, 0.2, containerMatRed);
    createContainer(0, -82, 1.57, containerMatBlue);

    // Street Lamps with downward point lighting
    const lampPositions = [
      [-35, -12], [35, -12], [-35, 35], [35, 35], [0, 90], [0, -65]
    ];
    lampPositions.forEach(([lx, lz]) => {
      const poleGeo = new THREE.CylinderGeometry(0.2, 0.25, 9.5, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(lx, 4.75, lz);
      pole.castShadow = true;
      scene.add(pole);

      const light = new THREE.PointLight(0x38bdf8, 2.8, 36);
      light.position.set(lx, 9.2, lz);
      scene.add(light);

      const bulbGeo = new THREE.SphereGeometry(0.6, 8, 8);
      const bulbMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(lx, 9.2, lz);
      scene.add(bulb);
    });

    // Outer Perimeter Barriers
    const wallGeoH = new THREE.BoxGeometry(arenaSize, 3.5, 2);
    const wallGeoV = new THREE.BoxGeometry(2, 3.5, arenaSize);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });

    const wallN = new THREE.Mesh(wallGeoH, wallMat);
    wallN.position.set(0, 1.75, -arenaSize / 2);
    scene.add(wallN);
    const wallS = new THREE.Mesh(wallGeoH, wallMat);
    wallS.position.set(0, 1.75, arenaSize / 2);
    scene.add(wallS);
    const wallW = new THREE.Mesh(wallGeoV, wallMat);
    wallW.position.set(-arenaSize / 2, 1.75, 0);
    scene.add(wallW);
    const wallE = new THREE.Mesh(wallGeoV, wallMat);
    wallE.position.set(arenaSize / 2, 1.75, 0);
    scene.add(wallE);

    // ==========================================
    // 3D PERSISTENT SKID MARKS RIBBON MESH
    // ==========================================
    const maxSkidSegments = 600;
    const skidPositions = new Float32Array(maxSkidSegments * 6 * 3);
    const skidGeo = new THREE.BufferGeometry();
    skidGeo.setAttribute("position", new THREE.BufferAttribute(skidPositions, 3));
    const skidMat = new THREE.MeshBasicMaterial({
      color: 0x070b12,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const skidMesh = new THREE.Mesh(skidGeo, skidMat);
    scene.add(skidMesh);
    let skidIdx = 0;

    const addSkidSegment = (p1x: number, p1z: number, p2x: number, p2z: number, width: number) => {
      const dx = p2x - p1x;
      const dz = p2z - p1z;
      const len = Math.hypot(dx, dz);
      if (len < 0.05) return;

      const nx = (-dz / len) * (width / 2);
      const nz = (dx / len) * (width / 2);
      const y = 0.025; // slightly above asphalt

      const offset = (skidIdx % maxSkidSegments) * 18;
      const arr = skidPositions;

      // Triangle 1
      arr[offset] = p1x - nx; arr[offset + 1] = y; arr[offset + 2] = p1z - nz;
      arr[offset + 3] = p1x + nx; arr[offset + 4] = y; arr[offset + 5] = p1z + nz;
      arr[offset + 6] = p2x - nx; arr[offset + 7] = y; arr[offset + 8] = p2z - nz;

      // Triangle 2
      arr[offset + 9] = p2x - nx; arr[offset + 10] = y; arr[offset + 11] = p2z - nz;
      arr[offset + 12] = p1x + nx; arr[offset + 13] = y; arr[offset + 14] = p1z + nz;
      arr[offset + 15] = p2x + nx; arr[offset + 16] = y; arr[offset + 17] = p2z + nz;

      skidIdx++;
      skidGeo.attributes.position.needsUpdate = true;
    };

    // ==========================================
    // 3D CAR MODEL WITH BODY SUSPENSION ARTICULATION
    // ==========================================
    const carRoot = new THREE.Group();
    scene.add(carRoot);

    // Body container for suspension roll/pitch
    const carSuspensionBody = new THREE.Group();
    carRoot.add(carSuspensionBody);

    // 1. Car Body (Sapphire Metallic Paint)
    const bodyGeo = new THREE.BoxGeometry(2.1, 0.75, 4.4);
    const carPaintMat = new THREE.MeshStandardMaterial({
      color: 0x0f52ba,
      metalness: 0.82,
      roughness: 0.2,
    });
    const carBody = new THREE.Mesh(bodyGeo, carPaintMat);
    carBody.position.y = 0.65;
    carBody.castShadow = true;
    carSuspensionBody.add(carBody);

    // 2. Cockpit Greenhouse
    const cockpitGeo = new THREE.BoxGeometry(1.7, 0.65, 2.3);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x050b14,
      metalness: 0.9,
      roughness: 0.1,
    });
    const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
    cockpit.position.set(0, 1.25, -0.2);
    cockpit.castShadow = true;
    carSuspensionBody.add(cockpit);

    // 3. Carbon Aero Splitter
    const splitterGeo = new THREE.BoxGeometry(2.15, 0.12, 0.6);
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const splitter = new THREE.Mesh(splitterGeo, carbonMat);
    splitter.position.set(0, 0.35, 2.2);
    carSuspensionBody.add(splitter);

    // 4. Rear Carbon Spoiler Wing
    const wingGeo = new THREE.BoxGeometry(2.2, 0.08, 0.45);
    const wing = new THREE.Mesh(wingGeo, carbonMat);
    wing.position.set(0, 1.45, -2.0);
    carSuspensionBody.add(wing);

    const strutGeo = new THREE.BoxGeometry(0.08, 0.45, 0.1);
    const strutL = new THREE.Mesh(strutGeo, carbonMat);
    strutL.position.set(-0.7, 1.2, -2.0);
    carSuspensionBody.add(strutL);
    const strutR = new THREE.Mesh(strutGeo, carbonMat);
    strutR.position.set(0.7, 1.2, -2.0);
    carSuspensionBody.add(strutR);

    // 5. Wheels & Steerable Front Assemblies
    const wheelRadius = 0.42;
    const wheelWidth = 0.3;
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 18);
    wheelGeo.rotateZ(Math.PI / 2);

    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.18 });

    const createWheel = () => {
      const wheelMesh = new THREE.Group();
      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.castShadow = true;
      wheelMesh.add(tire);

      const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.72, wheelRadius * 0.72, wheelWidth + 0.02, 12);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      wheelMesh.add(rim);

      return { group: wheelMesh, tireMesh: tire };
    };

    // Front Steerable Wheels (mounted on root for ground stability)
    const frontLeftGroup = new THREE.Group();
    frontLeftGroup.position.set(-1.15, wheelRadius, 1.4);
    const frontLeftWheel = createWheel();
    frontLeftGroup.add(frontLeftWheel.group);
    carRoot.add(frontLeftGroup);

    const frontRightGroup = new THREE.Group();
    frontRightGroup.position.set(1.15, wheelRadius, 1.4);
    const frontRightWheel = createWheel();
    frontRightGroup.add(frontRightWheel.group);
    carRoot.add(frontRightGroup);

    // Rear Fixed Wheels
    const rearLeftGroup = new THREE.Group();
    rearLeftGroup.position.set(-1.15, wheelRadius, -1.3);
    const rearLeftWheel = createWheel();
    rearLeftGroup.add(rearLeftWheel.group);
    carRoot.add(rearLeftGroup);

    const rearRightGroup = new THREE.Group();
    rearRightGroup.position.set(1.15, wheelRadius, -1.3);
    const rearRightWheel = createWheel();
    rearRightGroup.add(rearRightWheel.group);
    carRoot.add(rearRightGroup);

    // 6. Dual 3D Headlights & Spotlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const headlightGeo = new THREE.BoxGeometry(0.35, 0.15, 0.1);

    const headlightL = new THREE.Mesh(headlightGeo, headlightMat);
    headlightL.position.set(-0.7, 0.72, 2.2);
    carSuspensionBody.add(headlightL);

    const headlightR = new THREE.Mesh(headlightGeo, headlightMat);
    headlightR.position.set(0.7, 0.72, 2.2);
    carSuspensionBody.add(headlightR);

    const spotLightL = new THREE.SpotLight(0xffffff, 4.2, 50, Math.PI / 6, 0.4);
    spotLightL.position.set(-0.7, 0.75, 2.2);
    spotLightL.target.position.set(-0.7, 0, 18);
    carSuspensionBody.add(spotLightL);
    carSuspensionBody.add(spotLightL.target);

    const spotLightR = new THREE.SpotLight(0xffffff, 4.2, 50, Math.PI / 6, 0.4);
    spotLightR.position.set(0.7, 0.75, 2.2);
    spotLightR.target.position.set(0.7, 0, 18);
    carSuspensionBody.add(spotLightR);
    carSuspensionBody.add(spotLightR.target);

    // Taillights
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const taillightGeo = new THREE.BoxGeometry(0.5, 0.12, 0.08);
    const taillightL = new THREE.Mesh(taillightGeo, taillightMat);
    taillightL.position.set(-0.7, 0.75, -2.2);
    carSuspensionBody.add(taillightL);
    const taillightR = new THREE.Mesh(taillightGeo, taillightMat);
    taillightR.position.set(0.7, 0.75, -2.2);
    carSuspensionBody.add(taillightR);

    // 7. Volumetric Tire Smoke Particle Pool
    const smokePoolSize = 75;
    const smokeParticles: { mesh: THREE.Mesh; life: number; maxLife: number; vx: number; vy: number; vz: number }[] = [];
    const smokeGeo = new THREE.SphereGeometry(0.4, 6, 6);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xa6b8cc,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });

    for (let i = 0; i < smokePoolSize; i++) {
      const mesh = new THREE.Mesh(smokeGeo, smokeMat.clone());
      mesh.visible = false;
      scene.add(mesh);
      smokeParticles.push({ mesh, life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0 });
    }

    const spawnSmoke = (x: number, y: number, z: number, intensity: number) => {
      const p = smokeParticles.find((item) => item.life <= 0);
      if (!p) return;
      p.mesh.position.set(x + (Math.random() - 0.5) * 0.3, y, z + (Math.random() - 0.5) * 0.3);
      p.mesh.scale.setScalar(0.7 + Math.random() * 0.5);
      p.vx = (Math.random() - 0.5) * 0.09;
      p.vy = 0.04 + Math.random() * 0.05;
      p.vz = (Math.random() - 0.5) * 0.09;
      p.life = 1.0;
      p.maxLife = 1.0;
      p.mesh.visible = true;
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(0.42, 0.2 + intensity * 0.25);
    };

    // ==========================================
    // REALISTIC DUAL-AXLE VEHICLE DYNAMICS STATE
    // ==========================================
    let posX = 0;
    let posZ = 0;
    let yaw = 0;          // car heading angle
    let yawRate = 0;      // angular velocity (rad/s)
    let velX = 0;         // world velocity X
    let velZ = 0;         // world velocity Z
    let steerAngle = 0;   // front wheel angle (rad)
    let bodyRoll = 0;     // suspension roll angle
    let bodyPitch = 0;    // suspension pitch angle
    let bodyRollVel = 0;
    let bodyPitchVel = 0;

    let nitro = 100;
    let engineRpm = 1000;
    let currentGear = 1;

    let currentDriftPoints = 0;
    let currentMultiplier = 1;
    let driftDuration = 0;

    // Last known tire world coordinates for skid lines
    let lastLeftTirePos: THREE.Vector3 | null = null;
    let lastRightTirePos: THREE.Vector3 | null = null;

    // Keyboard Listeners
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
        posX = 0;
        posZ = 0;
        yaw = 0;
        yawRate = 0;
        velX = 0;
        velZ = 0;
        steerAngle = 0;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) keysRef.current.up = false;
      if (["ArrowDown", "KeyS"].includes(e.code)) keysRef.current.down = false;
      if (["ArrowLeft", "KeyA"].includes(e.code)) keysRef.current.left = false;
      if (["ArrowRight", "KeyD"].includes(e.code)) keysRef.current.right = false;
      if (e.code === "Space") keysRef.current.handbrake = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") keysRef.current.nitro = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ==========================================
    // MAIN PHYSICS & RENDER LOOP
    // ==========================================
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const keys = keysRef.current;
      const isNitro = keys.nitro && nitro > 2 && keys.up;

      // 1. Nitro Gauge
      if (isNitro) {
        nitro = Math.max(0, nitro - 0.65);
        setNitroFuel(Math.round(nitro));
      } else if (nitro < 100) {
        nitro = Math.min(100, nitro + 0.14);
        setNitroFuel(Math.round(nitro));
      }

      // 2. Realistic Steering Input Dynamics
      const maxSteerLimit = 0.58; // ~33 degrees lock-to-lock
      if (keys.left) {
        steerAngle = Math.min(maxSteerLimit, steerAngle + 0.075);
      } else if (keys.right) {
        steerAngle = Math.max(-maxSteerLimit, steerAngle - 0.075);
      } else {
        steerAngle *= 0.78; // self-centering
      }

      frontLeftGroup.rotation.y = steerAngle;
      frontRightGroup.rotation.y = steerAngle;

      // 3. Local Vehicle Velocity Transformation
      const forwardVecX = Math.sin(yaw);
      const forwardVecZ = Math.cos(yaw);
      const rightVecX = Math.cos(yaw);
      const rightVecZ = -Math.sin(yaw);

      // Long and Lat velocities in car local reference frame
      const vLong = velX * forwardVecX + velZ * forwardVecZ;
      const vLat = velX * rightVecX + velZ * rightVecZ;

      // 4. Dual-Axle Slip Angles (Pacejka Bicycle Kinematics)
      const a = 1.35; // CG to front axle
      const b = 1.35; // CG to rear axle

      const vLatFront = vLat + a * yawRate;
      const vLatRear = vLat - b * yawRate;
      const vLongAbs = Math.max(0.2, Math.abs(vLong));

      // Slip angles alpha
      const alphaFront = Math.atan2(vLatFront, vLongAbs) - steerAngle * Math.sign(vLong || 1);
      const alphaRear = Math.atan2(vLatRear, vLongAbs);

      // 5. Tire Forces & Lateral Grip Breakdown
      // When handbrake is pressed or heavy rear slip occurs, rear lateral stiffness collapses
      const corneringStiffnessFront = 14.0;
      let corneringStiffnessRear = 15.5;

      if (keys.handbrake) {
        corneringStiffnessRear = 2.2; // Rear wheels lose lateral grip!
      } else if (isNitro) {
        corneringStiffnessRear = 6.0; // Power oversteer breakdown
      }

      // Lateral forces with non-linear saturation
      const fLatFront = -corneringStiffnessFront * Math.sin(1.8 * Math.atan(alphaFront));
      const fLatRear = -corneringStiffnessRear * Math.sin(1.8 * Math.atan(alphaRear));

      // 6. Engine Throttle, Braking, and Longitudinal Forces
      let fLong = 0;
      const basePower = isNitro ? 32 : 18;

      if (keys.up) {
        fLong = basePower;
      } else if (keys.down) {
        if (vLong > 0.2) {
          fLong = -22; // Braking
        } else {
          fLong = -10; // Reverse
        }
      } else {
        fLong = -Math.sign(vLong) * 2.2; // Rolling resistance
      }

      // Handbrake slows longitudinal rolling
      if (keys.handbrake) {
        fLong -= Math.sign(vLong) * 8.0;
      }

      // Air aerodynamic drag
      fLong -= 0.04 * vLong * Math.abs(vLong);

      // 7. Equations of Motion (Newton-Euler)
      const mass = 1200;
      const Izz = 1800; // Yaw moment of inertia
      const dt = 0.016;

      // Accelerations in vehicle local frame
      const aLong = (fLong - fLatFront * Math.sin(steerAngle)) / (mass * 0.04);
      const aLat = (fLatRear + fLatFront * Math.cos(steerAngle)) / (mass * 0.04);

      // Convert local accelerations to World frame
      const aWorldX = forwardVecX * aLong + rightVecX * aLat;
      const aWorldZ = forwardVecZ * aLong + rightVecZ * aLat;

      velX += aWorldX * dt;
      velZ += aWorldZ * dt;

      // Yaw Torque & Angular Acceleration
      const yawTorque = a * fLatFront * Math.cos(steerAngle) - b * fLatRear;
      const yawAccel = yawTorque / (Izz * 0.04);
      yawRate += yawAccel * dt;

      // Angular damping (natural alignment torque)
      yawRate *= 0.94;

      // Update Heading & Positions
      yaw += yawRate * dt;
      posX += velX;
      posZ += velZ;

      carRoot.position.set(posX, 0, posZ);
      carRoot.rotation.y = yaw;

      // 8. Suspension Body Roll & Pitch (Spring-Damper Simulation)
      // Car rolls outwards in turns (centrifugal roll)
      const targetRoll = -aLat * 0.008;
      const rollForce = (targetRoll - bodyRoll) * 45;
      bodyRollVel = (bodyRollVel + rollForce * dt) * 0.88;
      bodyRoll += bodyRollVel * dt;

      // Car pitches back on acceleration (squat), forward on braking (dive)
      const targetPitch = aLong * 0.005;
      const pitchForce = (targetPitch - bodyPitch) * 45;
      bodyPitchVel = (bodyPitchVel + pitchForce * dt) * 0.88;
      bodyPitch += bodyPitchVel * dt;

      carSuspensionBody.rotation.z = THREE.MathUtils.clamp(bodyRoll, -0.15, 0.15);
      carSuspensionBody.rotation.x = THREE.MathUtils.clamp(bodyPitch, -0.12, 0.12);

      // Wheel Roll rotation
      const wheelRoll = (vLong / wheelRadius) * 0.32;
      frontLeftWheel.tireMesh.rotation.x += wheelRoll;
      frontRightWheel.tireMesh.rotation.x += wheelRoll;
      rearLeftWheel.tireMesh.rotation.x += wheelRoll;
      rearRightWheel.tireMesh.rotation.x += wheelRoll;

      // 9. Realistic Transmission, Gears, and Engine RPM
      const actualSpeedKmh = Math.round(Math.abs(vLong) * 48);
      setSpeedKmh(actualSpeedKmh);

      let calcGear = 1;
      let targetRpm = 1000;
      let isRevLimiter = false;

      if (actualSpeedKmh < 40) {
        calcGear = 1;
        targetRpm = 1000 + (actualSpeedKmh / 40) * 6200;
      } else if (actualSpeedKmh < 80) {
        calcGear = 2;
        targetRpm = 3200 + ((actualSpeedKmh - 40) / 40) * 4000;
      } else if (actualSpeedKmh < 125) {
        calcGear = 3;
        targetRpm = 4000 + ((actualSpeedKmh - 80) / 45) * 3300;
      } else {
        calcGear = 4;
        targetRpm = 4800 + ((actualSpeedKmh - 125) / 55) * 2600;
      }

      if (keys.up && (keys.handbrake || Math.abs(alphaRear) > 0.45)) {
        targetRpm = 7450; // Throttle burnout / drift rev-limiter!
      }

      if (targetRpm >= 7400) {
        isRevLimiter = true;
      }

      engineRpm = THREE.MathUtils.lerp(engineRpm, Math.min(7500, targetRpm), 0.15);
      setRpm(Math.round(engineRpm));
      setGear(calcGear);

      // 10. Drift Scoring, 3D Smoke & Persistent Rubber Skid Marks
      const isSlipDrift = (Math.abs(alphaRear) > 0.28 || keys.handbrake) && Math.hypot(velX, velZ) > 0.28;
      const driftIntensity = Math.min(1, Math.abs(alphaRear) * 2.2);

      setIsDrifting(isSlipDrift);
      audio.update(engineRpm, isSlipDrift, driftIntensity, isRevLimiter);

      // Calculate Rear Tire World Positions
      const rearLeftWorld = new THREE.Vector3(-1.15, 0.1, -1.3).applyMatrix4(carRoot.matrixWorld);
      const rearRightWorld = new THREE.Vector3(1.15, 0.1, -1.3).applyMatrix4(carRoot.matrixWorld);

      if (isSlipDrift) {
        driftDuration += dt;
        const pts = Math.round(Math.abs(alphaRear) * actualSpeedKmh * 0.9);
        currentDriftPoints += pts;

        if (driftDuration > 1.2 && currentMultiplier < 5) {
          currentMultiplier = Math.min(5, Math.floor(driftDuration / 1.0) + 1);
        }

        setDriftScore(currentDriftPoints * currentMultiplier);
        setMultiplier(currentMultiplier);

        // Volumetric 3D Tire Smoke
        spawnSmoke(rearLeftWorld.x, rearLeftWorld.y, rearLeftWorld.z, driftIntensity);
        spawnSmoke(rearRightWorld.x, rearRightWorld.y, rearRightWorld.z, driftIntensity);

        // Lay Down Persistent 3D Rubber Skid Mark Ribbons
        if (lastLeftTirePos && lastRightTirePos) {
          addSkidSegment(lastLeftTirePos.x, lastLeftTirePos.z, rearLeftWorld.x, rearLeftWorld.z, 0.28);
          addSkidSegment(lastRightTirePos.x, lastRightTirePos.z, rearRightWorld.x, rearRightWorld.z, 0.28);
        }
      } else {
        // Bank Points on Clean Drift Exit
        if (currentDriftPoints > 0) {
          const earned = currentDriftPoints * currentMultiplier;
          setTotalScore((prev) => {
            const next = prev + earned;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem("apexdrift3d_highscore", next.toString());
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

      lastLeftTirePos = rearLeftWorld.clone();
      lastRightTirePos = rearRightWorld.clone();

      // Update Smoke Particles
      smokeParticles.forEach((p) => {
        if (p.life > 0) {
          p.life -= 0.024;
          p.mesh.position.x += p.vx;
          p.mesh.position.y += p.vy;
          p.mesh.position.z += p.vz;
          p.mesh.scale.multiplyScalar(1.035);
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, p.life * 0.38);
          if (p.life <= 0) p.mesh.visible = false;
        }
      });

      // 11. Bouncy Collision Physics
      const boundaryLimit = arenaSize / 2 - 4.5;
      if (Math.abs(posX) > boundaryLimit || Math.abs(posZ) > boundaryLimit) {
        posX = Math.max(-boundaryLimit, Math.min(boundaryLimit, posX));
        posZ = Math.max(-boundaryLimit, Math.min(boundaryLimit, posZ));
        velX *= -0.35;
        velZ *= -0.35;
        if (currentDriftPoints > 0) {
          setBankedAlert("💥 WALL HIT! DRIFT LOST");
          setTimeout(() => setBankedAlert(null), 1200);
          currentDriftPoints = 0;
          setDriftScore(0);
        }
      }

      colliders.forEach((c) => {
        const dist = Math.hypot(posX - c.x, posZ - c.z);
        if (dist < c.radius) {
          const pushAngle = Math.atan2(posX - c.x, posZ - c.z);
          posX = c.x + Math.sin(pushAngle) * c.radius;
          posZ = c.z + Math.cos(pushAngle) * c.radius;
          velX *= -0.35;
          velZ *= -0.35;
        }
      });

      // 12. Dynamic Chase Camera with Drift Sway & Inertia
      const camDist = 9.2;
      const camHeight = 3.9;

      // Camera swings wide during drift angle
      const driftSway = alphaRear * 2.6;
      const targetCamX = posX - Math.sin(yaw + driftSway * 0.4) * camDist;
      const targetCamZ = posZ - Math.cos(yaw + driftSway * 0.4) * camDist;

      camera.position.x += (targetCamX - camera.position.x) * 0.085;
      camera.position.z += (targetCamZ - camera.position.z) * 0.085;
      camera.position.y += (carRoot.position.y + camHeight - camera.position.y) * 0.085;

      const lookTarget = new THREE.Vector3(
        posX + Math.sin(yaw) * 4.5,
        carRoot.position.y + 1.1,
        posZ + Math.cos(yaw) * 4.5
      );
      camera.lookAt(lookTarget);

      // FOV Dynamic Kick on Nitro
      camera.fov = THREE.MathUtils.lerp(camera.fov, isNitro ? 72 : 60, 0.08);
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      audio.stopAll();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [highScore]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-sapphire-300/40 bg-[#080c14] shadow-2xl select-none ${
        isFullscreen ? "h-screen" : "h-[540px]"
      }`}
    >
      {/* Top Glass Arcade Header HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0a192f]/85 border-b border-slate-800/80 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#38bdf8] animate-pulse" />
            <span className="font-bold text-white tracking-wider">
              APEX_DRIFT // REALISTIC DYNAMICS
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/90 text-slate-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BEST: {highScore}</span>
          </div>
        </div>

        {/* Live Metrics: Speed, Tachometer, Gear */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Speedometer & Gear */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200">
            <Gauge className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="font-bold text-white text-sm">{speedKmh}</span>
            <span className="text-[10px] text-slate-400">KM/H</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-900/80 text-cyan-300 font-bold text-[10px]">
              G{gear}
            </span>
          </div>

          {/* RPM Tachometer */}
          <div className="hidden sm:flex flex-col gap-0.5 min-w-[70px]">
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>RPM</span>
              <span className={rpm >= 7200 ? "text-red-400 font-bold" : "text-slate-300"}>
                {rpm}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-75 ${
                  rpm >= 7200 ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400"
                }`}
                style={{ width: `${Math.min(100, (rpm / 7500) * 100)}%` }}
              />
            </div>
          </div>

          {/* Nitro Gauge */}
          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${nitroFuel > 20 ? "text-[#38bdf8]" : "text-slate-600"}`} />
            <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-100"
                style={{ width: `${nitroFuel}%` }}
              />
            </div>
          </div>

          {/* Controls */}
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

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-slate-300" />
              ) : (
                <Maximize2 className="w-4 h-4 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Drift Score & Multiplier HUD */}
      {isDrifting && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="px-5 py-1.5 rounded-full bg-blue-600/40 border border-cyan-400/60 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md animate-bounce shadow-xl flex items-center gap-2">
            <span>REAL DRIFT</span>
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
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold backdrop-blur-md shadow-lg animate-pulse pointer-events-none">
          {bankedAlert}
        </div>
      )}

      {/* Controls Help Overlay */}
      {showHelp && (
        <div className="absolute inset-0 bg-[#080c14]/94 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-3">REALISTIC DRIFT DYNAMICS</h3>
          <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
            Real dual-axle physics with counter-steering, suspension body roll, weight transfer, and rev-limiter bounce.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm text-left text-xs font-mono text-slate-300 mb-6">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[#38bdf8] block font-bold">W / ↑</span>
              <span>Throttle Accelerate</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[#38bdf8] block font-bold">S / ↓</span>
              <span>Brake / Weight Transfer</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[#38bdf8] block font-bold">A & D / ← →</span>
              <span>Steer & Counter-Steer</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-400 font-bold">
              <span className="text-amber-300 block font-bold">SPACEBAR</span>
              <span>HANDBRAKE (Break Rear Traction)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-cyan-400 font-bold col-span-2">
              <span className="text-cyan-300 block font-bold">SHIFT KEY</span>
              <span>NITRO BOOST (Flame Jets)</span>
            </div>
          </div>

          <button
            onClick={() => setShowHelp(false)}
            className="px-6 py-2 rounded-full bg-[#0f52ba] text-white font-bold text-xs hover:bg-blue-600 transition-all cursor-pointer"
          >
            ENTER 3D CIRCUIT
          </button>
        </div>
      )}

      {/* Mobile Touch Controls */}
      <div className="absolute bottom-14 left-3 right-3 flex items-end justify-between pointer-events-auto sm:hidden z-20">
        <div className="flex gap-2">
          <button
            onTouchStart={() => (keysRef.current.left = true)}
            onTouchEnd={() => (keysRef.current.left = false)}
            className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 active:bg-[#0f52ba] text-white font-bold flex items-center justify-center text-lg select-none"
          >
            ◀
          </button>
          <button
            onTouchStart={() => (keysRef.current.right = true)}
            onTouchEnd={() => (keysRef.current.right = false)}
            className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 active:bg-[#0f52ba] text-white font-bold flex items-center justify-center text-lg select-none"
          >
            ▶
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onTouchStart={() => (keysRef.current.handbrake = true)}
            onTouchEnd={() => (keysRef.current.handbrake = false)}
            className="w-12 h-12 rounded-2xl bg-amber-600/70 border border-amber-400 active:bg-amber-500 text-white font-bold flex items-center justify-center text-xs select-none"
          >
            DRIFT
          </button>
          <button
            onTouchStart={() => (keysRef.current.up = true)}
            onTouchEnd={() => (keysRef.current.up = false)}
            className="w-12 h-12 rounded-2xl bg-blue-600/80 border border-cyan-400 active:bg-blue-500 text-white font-bold flex items-center justify-center text-sm select-none"
          >
            GAS
          </button>
        </div>
      </div>

      {/* Bottom Live Score Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-2 bg-[#0a192f]/90 border-t border-slate-800 backdrop-blur-md text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span>BANKED SCORE:</span>
          <span className="text-base font-bold text-white">{totalScore}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-500 hidden sm:inline">
            Physics: Dual-Axle Slip · Body Roll & Squat · 4-Speed Trans · Persistent 3D Skid Tracks
          </span>
        </div>
      </div>
    </div>
  );
}
