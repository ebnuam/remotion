/**
 * KOK ISO YO? - 3D World Scene & Animation Engine
 * Three.js 3D Environment with 2.5D Billboard Cutouts,
 * Molecular Visualization, and Cinematic Camera Choreography.
 */
import * as THREE from "three";
import { SHOTS } from "./constants";

export class KokIsoYoWorld {
  public root: THREE.Group;
  private textures: Record<string, THREE.Texture>;

  // Key Scene Objects
  private labGroup: THREE.Group;
  private moleculeGroup: THREE.Group;
  private masIsoShot1: THREE.Mesh;
  private masIsoShot3: THREE.Mesh;
  private masIsoHeadShot3: THREE.Mesh;
  private masIsoShadow1: THREE.Mesh;
  private masIsoShadow3: THREE.Mesh;
  private iceCube: THREE.Mesh;
  private glassGroup: THREE.Group;
  private molecules: { group: THREE.Group; liquidPos: THREE.Vector3; solidPos: THREE.Vector3 }[] = [];
  private hBonds: THREE.Mesh[] = [];

  constructor(textures: Record<string, THREE.Texture>) {
    this.textures = textures;
    this.root = new THREE.Group();

    this.labGroup = new THREE.Group();
    this.moleculeGroup = new THREE.Group();
    this.glassGroup = new THREE.Group();

    this.root.add(this.labGroup);
    this.root.add(this.moleculeGroup);

    this.buildLights();
    this.buildLabEnvironment();
    this.buildExperimentTable();
    this.buildGlassAndIce();
    this.buildMasIsoBillboards();
    this.buildMolecularLattice();
  }

  // 1. Cinematic Studio Lighting
  private buildLights() {
    // Ambient soft fill (bright, welcoming)
    const ambient = new THREE.AmbientLight("#CCE4F8", 0.95);
    this.labGroup.add(ambient);

    // Warm Main Key Light (sunlight through lab window)
    const keyLight = new THREE.DirectionalLight("#FFF8E7", 2.2);
    keyLight.position.set(-3.5, 5.0, 3.8);
    this.labGroup.add(keyLight);

    // Cool Rim Light (behind)
    const rimLight = new THREE.DirectionalLight("#90E0EF", 1.4);
    rimLight.position.set(2.5, 4.0, -3.0);
    this.labGroup.add(rimLight);

    // Table Bounce Light
    const bounceLight = new THREE.DirectionalLight("#FFE8D6", 0.5);
    bounceLight.position.set(0, -0.5, 2);
    this.labGroup.add(bounceLight);
  }

  // 2. 3D Laboratory Room Environment
  private buildLabEnvironment() {
    // Floor: Stylized warm wood parquet floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#5C4033",
      roughness: 0.35,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.labGroup.add(floor);

    // Back Wall: Cozy laboratory blue-slate wall
    const wallGeo = new THREE.PlaneGeometry(16, 8);
    const wallMat = new THREE.MeshStandardMaterial({
      color: "#243447",
      roughness: 0.8,
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 3.5, -3.5);
    this.labGroup.add(backWall);

    // Baseboard trim
    const trimGeo = new THREE.BoxGeometry(16, 0.2, 0.1);
    const trimMat = new THREE.MeshStandardMaterial({ color: "#3D2B1F" });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 0.1, -3.45);
    this.labGroup.add(trim);

    // Laboratory Chalkboard / Whiteboard on Back Wall
    const boardFrameGeo = new THREE.BoxGeometry(3.6, 2.0, 0.08);
    const boardFrameMat = new THREE.MeshStandardMaterial({ color: "#7F5539", roughness: 0.5 });
    const boardFrame = new THREE.Mesh(boardFrameGeo, boardFrameMat);
    boardFrame.position.set(0.1, 2.2, -3.4);
    this.labGroup.add(boardFrame);

    const boardInnerGeo = new THREE.PlaneGeometry(3.36, 1.76);
    const boardInnerMat = new THREE.MeshStandardMaterial({
      color: "#18231E",
      roughness: 0.95,
    });
    const boardInner = new THREE.Mesh(boardInnerGeo, boardInnerMat);
    boardInner.position.set(0.1, 2.2, -3.35);
    this.labGroup.add(boardInner);

    // Chalk diagrams on board (represented by stylized vector-like meshes)
    const chalkMat = new THREE.MeshBasicMaterial({ color: "#E0FBFC" });
    const chalkCircleGeo = new THREE.RingGeometry(0.2, 0.23, 24);
    const c1 = new THREE.Mesh(chalkCircleGeo, chalkMat);
    c1.position.set(-1.5, 2.3, -3.34);
    this.labGroup.add(c1);

    // Laboratory Wall Shelf & Glass Flasks
    const shelfGeo = new THREE.BoxGeometry(1.8, 0.06, 0.35);
    const shelfMat = new THREE.MeshStandardMaterial({ color: "#4A3525", roughness: 0.6 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(1.9, 2.3, -3.2);
    this.labGroup.add(shelf);

    // Beakers on shelf
    const beakerMat1 = new THREE.MeshStandardMaterial({
      color: "#00B4D8",
      transparent: true,
      opacity: 0.8,
    });
    const beakerMat2 = new THREE.MeshStandardMaterial({
      color: "#F77F00",
      transparent: true,
      opacity: 0.8,
    });

    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.28, 16), beakerMat1);
    b1.position.set(1.5, 2.47, -3.2);
    this.labGroup.add(b1);

    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.24, 16), beakerMat2);
    b2.position.set(1.9, 2.45, -3.2);
    this.labGroup.add(b2);
  }

  // 3. Wooden Experiment Table
  private buildExperimentTable() {
    const tableGroup = new THREE.Group();

    // Tabletop
    const topGeo = new THREE.BoxGeometry(2.2, 0.09, 1.2);
    const topMat = new THREE.MeshStandardMaterial({
      color: "#8B5A2B",
      roughness: 0.35,
      metalness: 0.05,
    });
    const tabletop = new THREE.Mesh(topGeo, topMat);
    tabletop.position.set(0.3, 0.75, 0.1);
    tableGroup.add(tabletop);

    // 4 Table Legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.75, 0.08);
    const legMat = new THREE.MeshStandardMaterial({ color: "#5C3A1E", roughness: 0.6 });
    const legOffsets = [
      [-0.95, 0.375, -0.45],
      [0.95, 0.375, -0.45],
      [-0.95, 0.375, 0.45],
      [0.95, 0.375, 0.45],
    ];
    legOffsets.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(0.3 + x, y, 0.1 + z);
      tableGroup.add(leg);
    });

    this.labGroup.add(tableGroup);
  }

  // 4. Glass of Water with Floating Ice Cube
  private buildGlassAndIce() {
    this.glassGroup.position.set(0.12, 0.8, 0.25); // Placed prominently on front-left of table

    // Glass Beaker Cylinder
    const glassGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.46, 24, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#E2F1F8",
      transparent: true,
      opacity: 0.4,
      roughness: 0.02,
      transmission: 0.8,
      ior: 1.5,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 0.23;
    this.glassGroup.add(glass);

    // Glass Bottom
    const baseGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.025, 24);
    const base = new THREE.Mesh(baseGeo, glassMat);
    base.position.y = 0.012;
    this.glassGroup.add(base);

    // Water Volume Inside Glass
    const waterGeo = new THREE.CylinderGeometry(0.17, 0.155, 0.36, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: "#48CAE4",
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.19;
    this.glassGroup.add(water);

    // Main Floating Ice Cube
    const iceGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const iceMat = new THREE.MeshPhysicalMaterial({
      color: "#CAF0F8",
      transparent: true,
      opacity: 0.88,
      roughness: 0.08,
      transmission: 0.6,
      ior: 1.31,
    });
    this.iceCube = new THREE.Mesh(iceGeo, iceMat);
    this.iceCube.position.set(0.02, 0.35, 0.02);
    this.iceCube.rotation.set(0.15, 0.35, -0.1);
    this.glassGroup.add(this.iceCube);

    // Second smaller ice cube
    const ice2Geo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const ice2 = new THREE.Mesh(ice2Geo, iceMat);
    ice2.position.set(-0.05, 0.33, -0.03);
    ice2.rotation.set(-0.2, 0.6, 0.15);
    this.glassGroup.add(ice2);

    this.labGroup.add(this.glassGroup);
  }

  // 5. Mas Iso 2.5D Billboard Cutouts & Contact Shadows
  private buildMasIsoBillboards() {
    // Character standing height = 1.62m
    const charH = 1.62;
    const charW = charH * (250 / 665); // Aspect ratio matching sprite crop

    // A. Shot 1 Billboard: Mas Iso 3/4 standing beside the table
    const tex1 = this.textures["mas_iso_34.png"] || this.textures["mas_iso_front.png"];
    const mat1 = new THREE.MeshStandardMaterial({
      map: tex1,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.45,
    });
    const geo1 = new THREE.PlaneGeometry(charW, charH);
    this.masIsoShot1 = new THREE.Mesh(geo1, mat1);
    this.masIsoShot1.position.set(-0.52, charH / 2, 0.25);
    this.labGroup.add(this.masIsoShot1);

    // Floor Contact Shadow for Shot 1
    const shadowGeo = new THREE.PlaneGeometry(0.55, 0.28);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.35,
    });
    this.masIsoShadow1 = new THREE.Mesh(shadowGeo, shadowMat);
    this.masIsoShadow1.rotation.x = -Math.PI / 2;
    this.masIsoShadow1.position.set(-0.52, 0.005, 0.25);
    this.labGroup.add(this.masIsoShadow1);

    // B. Shot 3 Billboard: Mas Iso Front Facing (Headless body + swap head)
    const tex3 = this.textures["mas_iso_front_headless.png"] || this.textures["mas_iso_front.png"];
    const mat3 = new THREE.MeshStandardMaterial({
      map: tex3,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.45,
    });
    this.masIsoShot3 = new THREE.Mesh(geo1, mat3);
    this.masIsoShot3.position.set(-0.35, charH / 2, 0.35);
    this.masIsoShot3.visible = false;
    this.labGroup.add(this.masIsoShot3);

    // Head overlay for Shot 3 (Deadpan head swap)
    const headTex = this.textures["head_deadpan.png"];
    const headH = 0.52;
    const headW = headH * (130 / 140);
    const headGeo = new THREE.PlaneGeometry(headW, headH);
    const headMat = new THREE.MeshStandardMaterial({
      map: headTex,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.45,
    });
    this.masIsoHeadShot3 = new THREE.Mesh(headGeo, headMat);
    // Position head precisely over the front body head
    this.masIsoHeadShot3.position.set(0.005, 0.58, 0.02);
    this.masIsoShot3.add(this.masIsoHeadShot3);

    this.masIsoShadow3 = new THREE.Mesh(shadowGeo, shadowMat);
    this.masIsoShadow3.rotation.x = -Math.PI / 2;
    this.masIsoShadow3.position.set(-0.35, 0.005, 0.35);
    this.masIsoShadow3.visible = false;
    this.labGroup.add(this.masIsoShadow3);
  }

  // 6. Macro Water Molecular Lattice (H2O Hexagonal Ring) for Shot 2
  private buildMolecularLattice() {
    this.moleculeGroup.position.set(0.12, 1.25, 0.25);
    this.moleculeGroup.visible = false;

    // Molecular materials
    const oxygenMat = new THREE.MeshStandardMaterial({ color: "#EF233C", roughness: 0.2 }); // Red Oxygen
    const hydrogenMat = new THREE.MeshStandardMaterial({ color: "#F8F9FA", roughness: 0.2 }); // White Hydrogen
    const bondMat = new THREE.MeshStandardMaterial({ color: "#90E0EF", roughness: 0.3 });
    const hBondMat = new THREE.MeshStandardMaterial({
      color: "#0077B6",
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
    });

    const oGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const hGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const bondGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8);

    // 6 H2O molecules arranged in an open hexagonal ring
    const radiusSolid = 0.65; // Expanded open lattice (solid ice)
    const radiusLiquid = 0.34; // Dense packed (liquid water)

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const mGroup = new THREE.Group();

      // Oxygen core
      const oMesh = new THREE.Mesh(oGeo, oxygenMat);
      mGroup.add(oMesh);

      // Two Hydrogen atoms at 104.5 degrees
      const h1 = new THREE.Mesh(hGeo, hydrogenMat);
      h1.position.set(0.15 * Math.cos(0.9), 0.15 * Math.sin(0.9), 0);
      mGroup.add(h1);

      const h2 = new THREE.Mesh(hGeo, hydrogenMat);
      h2.position.set(0.15 * Math.cos(-0.9), 0.15 * Math.sin(-0.9), 0);
      mGroup.add(h2);

      // Covalent bonds connecting O to H
      const b1 = new THREE.Mesh(bondGeo, bondMat);
      b1.position.set(h1.position.x / 2, h1.position.y / 2, 0);
      b1.rotation.z = 0.9 + Math.PI / 2;
      mGroup.add(b1);

      const b2 = new THREE.Mesh(bondGeo, bondMat);
      b2.position.set(h2.position.x / 2, h2.position.y / 2, 0);
      b2.rotation.z = -0.9 + Math.PI / 2;
      mGroup.add(b2);

      mGroup.rotation.z = angle;

      const solidPos = new THREE.Vector3(radiusSolid * Math.cos(angle), radiusSolid * Math.sin(angle), (i % 2) * 0.14 - 0.07);
      const liquidPos = new THREE.Vector3(radiusLiquid * Math.cos(angle + 0.3), radiusLiquid * Math.sin(angle + 0.3), (i % 2) * 0.05);

      mGroup.position.copy(liquidPos);
      this.moleculeGroup.add(mGroup);

      this.molecules.push({ group: mGroup, liquidPos, solidPos });
    }

    // Hydrogen bonds between neighboring molecules in solid lattice
    for (let i = 0; i < 6; i++) {
      const hBondGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8);
      const hb = new THREE.Mesh(hBondGeo, hBondMat);
      hb.rotation.z = (i * Math.PI) / 3 + Math.PI / 6;
      hb.position.set((radiusSolid * 0.86) * Math.cos(hb.rotation.z), (radiusSolid * 0.86) * Math.sin(hb.rotation.z), 0);
      this.moleculeGroup.add(hb);
      this.hBonds.push(hb);
    }
  }

  // 7. Per-frame Timeline & Cinematic Camera Choreography
  public update(frame: number, cam: THREE.PerspectiveCamera) {
    // Ice cube gentle bobbing in water
    this.iceCube.position.y = 0.35 + Math.sin(frame * 0.12) * 0.008;
    this.iceCube.rotation.y = 0.35 + Math.sin(frame * 0.08) * 0.04;

    // SHOT 1: Hook (Frames 0 - 59)
    if (frame < SHOTS.shot2.startFrame) {
      this.labGroup.visible = true;
      this.moleculeGroup.visible = false;
      this.masIsoShot1.visible = true;
      this.masIsoShot3.visible = false;
      this.masIsoShadow1.visible = true;
      this.masIsoShadow3.visible = false;

      // Mas Iso breathing and gentle head-tilt toward the glass
      this.masIsoShot1.position.y = 1.62 / 2 + Math.sin(frame * 0.1) * 0.008;
      this.masIsoShot1.rotation.z = -0.04 + Math.sin(frame * 0.06) * 0.012;

      // Camera: Cinematic slow dolly-in
      const t = frame / 60;
      cam.position.set(-0.12 - t * 0.04, 1.25 - t * 0.05, 2.35 - t * 0.55);
      cam.lookAt(-0.15, 1.05, 0.2);
      return;
    }

    // SHOT 2: Explanation & Molecular Lattice (Frames 60 - 179)
    if (frame < SHOTS.shot3.startFrame) {
      this.masIsoShot1.visible = false;
      this.masIsoShot3.visible = false;
      this.masIsoShadow1.visible = false;
      this.masIsoShadow3.visible = false;

      const fShot2 = frame - 60; // 0 to 120

      if (fShot2 < 28) {
        // Part A: Close-up zoom on glass and floating ice
        this.labGroup.visible = true;
        this.moleculeGroup.visible = false;
        const u = fShot2 / 28;
        cam.position.set(0.12 + u * 0.03, 1.08 - u * 0.02, 0.85 - u * 0.25);
        cam.lookAt(0.12, 1.04, 0.25);
      } else {
        // Part B: Macro Molecular Lattice Expansion
        this.labGroup.visible = true;
        this.moleculeGroup.visible = true;

        // Expansion progress: molecules move from dense liquid to open solid honeycomb
        const expandProgress = Math.min(1, Math.max(0, (fShot2 - 32) / 45));
        const smoothExp = expandProgress * expandProgress * (3 - 2 * expandProgress);

        this.molecules.forEach(({ group, liquidPos, solidPos }) => {
          group.position.lerpVectors(liquidPos, solidPos, smoothExp);
        });

        // Hydrogen bonds scale in as crystal solidifies
        this.hBonds.forEach((hb) => {
          hb.scale.set(smoothExp, smoothExp, smoothExp);
        });

        // Rotate molecular group gently
        this.moleculeGroup.rotation.z = fShot2 * 0.015;
        this.moleculeGroup.rotation.y = Math.sin(fShot2 * 0.02) * 0.2;

        // Camera slow orbit around molecule
        const camAngle = 0.8 + fShot2 * 0.008;
        cam.position.set(0.12 + Math.sin(camAngle) * 1.1, 1.25 + Math.cos(camAngle * 0.5) * 0.12, 0.25 + Math.cos(camAngle) * 1.1);
        cam.lookAt(0.12, 1.25, 0.25);
      }
      return;
    }

    // SHOT 3: Punchline (Frames 180 - 239)
    this.labGroup.visible = true;
    this.moleculeGroup.visible = false;
    this.masIsoShot1.visible = false;
    this.masIsoShot3.visible = true;
    this.masIsoShadow1.visible = false;
    this.masIsoShadow3.visible = true;

    const fShot3 = frame - 180; // 0 to 60

    // Comedic timing:
    // Frame 0-10: Looking down slightly at the glass
    // Frame 11+: Snappy comedic head tilt directly at camera with deadpan expression!
    if (fShot3 < 10) {
      this.masIsoShot3.rotation.z = -0.05;
      this.masIsoHeadShot3.rotation.z = -0.04;
    } else {
      const snap = Math.min(1, (fShot3 - 10) / 4);
      this.masIsoShot3.rotation.z = -0.05 + snap * 0.12; // tilted towards viewer
      this.masIsoHeadShot3.rotation.z = -0.04 + snap * 0.15;
      this.masIsoShot3.position.y = 1.62 / 2 + Math.sin(fShot3 * 0.15) * 0.006;
    }

    // Camera: Punchy medium-close framing on Mas Iso
    cam.position.set(-0.35, 1.32, 1.45);
    cam.lookAt(-0.35, 1.25, 0.35);
  }
}
