import * as THREE from 'three';

// Ceramic Slate Marble Material
export const marbleMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#2D3748'),
  roughness: 0.15,
  metalness: 0.1,
});

// Level Platforms (Matte Alabaster)
export const platformMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#E2E8F0'),
  roughness: 0.4,
  metalness: 0.05,
});

// Stage Backdrop
export const backdropMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#F1F5F9'),
  roughness: 0.8,
  metalness: 0.0,
});

// Static Ink (Cobalt Pastel)
export const staticStrokeMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#4B7BE5'),
  roughness: 0.25,
  metalness: 0.15,
});

// Dynamic Ink (Coral Pastel)
export const dynamicStrokeMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#F97066'),
  roughness: 0.25,
  metalness: 0.15,
});

// Target Pocket Outer Rim
export const targetRimMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#CBD5E1'),
  roughness: 0.3,
  metalness: 0.2,
});

// Target Pocket Glowing Center (Mint)
export const targetGlowMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color('#32D583'),
  transparent: true,
  opacity: 0.75,
});
