import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';

const { width: WIN_WIDTH, height: WIN_HEIGHT } = Dimensions.get('window');

interface BokononRigged3DProps {
  act: 'throw' | 'point' | 'open';
}

export function BokononRigged3D({ act }: BokononRigged3DProps) {
  const actRef = useRef(act);
  actRef.current = act;

  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    try {
      const glWidth = gl.drawingBufferWidth || WIN_WIDTH;
      const glHeight = gl.drawingBufferHeight || WIN_HEIGHT;
      const aspect = glWidth / glHeight;

      // 1. Scène 3D & Atmosphère mystique du temple
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0a0a, 0.04);

      // 2. Caméra universelle responsive (cadrage parfait sur mobile et tablette)
      const vFov = 45;
      const halfFovRad = (vFov * Math.PI) / 360;
      const targetHeight = 2.4;
      const targetWidth = 1.8;

      const distForHeight = (targetHeight / 2) / Math.tan(halfFovRad);
      const distForWidth = (targetWidth / 2) / (Math.tan(halfFovRad) * aspect);
      const baseDistance = Math.max(distForHeight, distForWidth) * 1.3;
      const targetCenterY = 0.58;

      const camera = new THREE.PerspectiveCamera(vFov, aspect, 0.1, 100);
      camera.position.set(0, 0.68, baseDistance);
      camera.lookAt(0, targetCenterY, 0.05);

      // 3. Moteur WebGL Three.js lié au contexte Expo-GL (pixelRatio 1 pour éviter tout zoom)
      const renderer = new THREE.WebGLRenderer({
        canvas: {
          width: glWidth,
          height: glHeight,
          style: {},
          addEventListener: () => {},
          removeEventListener: () => {},
          clientHeight: glHeight,
          clientWidth: glWidth,
          getContext: () => gl,
        } as any,
        context: gl,
        antialias: true,
        alpha: true,
      });

      renderer.setPixelRatio(1);
      renderer.setSize(glWidth, glHeight, false);
      renderer.setClearColor(0x0a0a0a, 1);
      gl.viewport(0, 0, glWidth, glHeight);

      // 4. Éclairage cinématique du sanctuaire
      const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
      scene.add(ambientLight);

      const topGoldLight = new THREE.DirectionalLight(0xffdf88, 2.2);
      topGoldLight.position.set(0, 4.5, 2.5);
      scene.add(topGoldLight);

      const rimLight = new THREE.DirectionalLight(0xc5a059, 1.8);
      rimLight.position.set(0, 3, -3);
      scene.add(rimLight);

      const torchLeft = new THREE.PointLight(0xff6600, 2.4, 9);
      torchLeft.position.set(-2.4, 1.6, 0.6);
      scene.add(torchLeft);

      const torchRight = new THREE.PointLight(0xff7711, 2.4, 9);
      torchRight.position.set(2.4, 1.6, 0.6);
      scene.add(torchRight);

      // 5. Sol pavé du temple
      const floorGeo = new THREE.PlaneGeometry(16, 16);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x141414,
        roughness: 0.9,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      scene.add(floor);

      // 6. Natte rituelle circulaire
      const matGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.02, 36);
      const matMat = new THREE.MeshStandardMaterial({
        color: 0x6e5233,
        roughness: 0.95,
      });
      const ritualMat = new THREE.Mesh(matGeo, matMat);
      ritualMat.position.set(0, 0.01, 0.05);
      scene.add(ritualMat);

      // 7. Halo sacré doré flottant derrière la tête du prêtre
      const haloGeo = new THREE.RingGeometry(0.52, 0.7, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xc5a059,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(0, 0.96, -0.2);
      scene.add(halo);

      // 8. Plateau divinatoire Opon Ifá sculpté en bois 3D
      const trayGroup = new THREE.Group();

      const trayBaseGeo = new THREE.CylinderGeometry(0.38, 0.4, 0.03, 36);
      const trayBaseMat = new THREE.MeshStandardMaterial({
        color: 0x3d1f0d,
        roughness: 0.55,
        metalness: 0.2,
      });
      const trayBase = new THREE.Mesh(trayBaseGeo, trayBaseMat);
      trayGroup.add(trayBase);

      const rimGeo = new THREE.TorusGeometry(0.37, 0.025, 14, 40);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xc5a059,
        roughness: 0.35,
        metalness: 0.8,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.018;
      trayGroup.add(rim);

      const powderGeo = new THREE.CircleGeometry(0.35, 36);
      const powderMat = new THREE.MeshStandardMaterial({
        color: 0xd9b359,
        roughness: 0.95,
      });
      const powder = new THREE.Mesh(powderGeo, powderMat);
      powder.rotation.x = -Math.PI / 2;
      powder.position.y = 0.019;
      trayGroup.add(powder);

      trayGroup.position.set(0, 0.02, 0.42);
      scene.add(trayGroup);

      // 9. Cauris rituels 3D
      const cowrieGroup = new THREE.Group();
      const cowries: {
        mesh: THREE.Mesh;
        baseX: number;
        baseZ: number;
        throwY: number;
        rotSpeed: number;
      }[] = [];

      const cowrieGeo = new THREE.SphereGeometry(0.028, 14, 12);
      cowrieGeo.scale(1.3, 0.55, 1.7);
      const cowrieMat = new THREE.MeshStandardMaterial({
        color: 0xfdfaf2,
        roughness: 0.25,
        metalness: 0.1,
      });

      const cowrieCoords = [
        { x: -0.09, z: 0.4 },
        { x: 0.08, z: 0.38 },
        { x: -0.03, z: 0.48 },
        { x: 0.11, z: 0.46 },
      ];

      cowrieCoords.forEach((pos, idx) => {
        const cMesh = new THREE.Mesh(cowrieGeo, cowrieMat);
        cMesh.position.set(pos.x, 0.04, pos.z);
        cMesh.rotation.y = idx * 1.3;
        cowrieGroup.add(cMesh);
        cowries.push({
          mesh: cMesh,
          baseX: pos.x,
          baseZ: pos.z,
          throwY: 0.04,
          rotSpeed: 0.06 + idx * 0.02,
        });
      });
      scene.add(cowrieGroup);

      // 10. Modélisation 3D du Bokonon (Prêtre vénérable assis en tailleur)
      const bokononGroup = new THREE.Group();

      const robeMat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        roughness: 0.75,
        metalness: 0.05,
      });
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0x3d2719,
        roughness: 0.65,
        metalness: 0.06,
      });
      const goldOrnamentMat = new THREE.MeshStandardMaterial({
        color: 0xc5a059,
        roughness: 0.3,
        metalness: 0.9,
      });
      const hairBeardMat = new THREE.MeshStandardMaterial({
        color: 0xe8e8e8,
        roughness: 0.85,
      });

      // A. Jambes en tailleur
      const legLeftGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.5, 24);
      legLeftGeo.rotateZ(Math.PI / 2.3);
      const legLeft = new THREE.Mesh(legLeftGeo, robeMat);
      legLeft.position.set(-0.24, 0.11, 0.1);
      bokononGroup.add(legLeft);

      const legRightGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.5, 24);
      legRightGeo.rotateZ(-Math.PI / 2.3);
      const legRight = new THREE.Mesh(legRightGeo, robeMat);
      legRight.position.set(0.24, 0.11, 0.1);
      bokononGroup.add(legRight);

      // B. Torse et Tunique blanche cérémoniale
      const torsoGeo = new THREE.CylinderGeometry(0.26, 0.42, 0.65, 36);
      const torso = new THREE.Mesh(torsoGeo, robeMat);
      torso.position.y = 0.46;
      bokononGroup.add(torso);

      // Broderie dorée centrale sacrée
      const trimGeo = new THREE.BoxGeometry(0.05, 0.5, 0.02);
      const trim = new THREE.Mesh(trimGeo, goldOrnamentMat);
      trim.position.set(0, 0.5, 0.26);
      bokononGroup.add(trim);

      // C. Double collier rituel de perles sacrées
      const necklace1Geo = new THREE.TorusGeometry(0.16, 0.014, 12, 32);
      const necklace1 = new THREE.Mesh(necklace1Geo, goldOrnamentMat);
      necklace1.rotation.x = Math.PI / 2.4;
      necklace1.position.set(0, 0.68, 0.09);
      bokononGroup.add(necklace1);

      const necklace2Geo = new THREE.TorusGeometry(0.21, 0.011, 12, 32);
      const necklace2 = new THREE.Mesh(necklace2Geo, goldOrnamentMat);
      necklace2.rotation.x = Math.PI / 2.3;
      necklace2.position.set(0, 0.61, 0.13);
      bokononGroup.add(necklace2);

      // D. Cou et Tête expressive du prêtre
      const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.12, 20);
      const neck = new THREE.Mesh(neckGeo, skinMat);
      neck.position.set(0, 0.82, 0.02);
      bokononGroup.add(neck);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.94, 0.03);

      const headGeo = new THREE.SphereGeometry(0.135, 26, 22);
      headGeo.scale(0.95, 1.15, 1.05);
      const head = new THREE.Mesh(headGeo, skinMat);
      headGroup.add(head);

      // Coiffe cérémoniale brodée de cauris
      const hatGeo = new THREE.CylinderGeometry(0.12, 0.145, 0.15, 32);
      const hat = new THREE.Mesh(hatGeo, goldOrnamentMat);
      hat.position.set(0, 0.13, -0.01);
      headGroup.add(hat);

      // Barbe blanche vénérable
      const beardGeo = new THREE.ConeGeometry(0.08, 0.2, 20);
      const beard = new THREE.Mesh(beardGeo, hairBeardMat);
      beard.rotation.x = -Math.PI / 1.15;
      beard.position.set(0, -0.1, 0.13);
      headGroup.add(beard);

      bokononGroup.add(headGroup);

      // E. Bras Droit articulé (Lancer rituel & Main tendue vers la caméra)
      const armRightGroup = new THREE.Group();
      armRightGroup.position.set(0.3, 0.68, 0.04);

      const armRightGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.4, 20);
      armRightGeo.translate(0, -0.18, 0);
      const armRightMesh = new THREE.Mesh(armRightGeo, robeMat);
      armRightGroup.add(armRightMesh);

      const handRightGeo = new THREE.SphereGeometry(0.05, 16, 14);
      handRightGeo.scale(0.85, 1.15, 0.6);
      const handRight = new THREE.Mesh(handRightGeo, skinMat);
      handRight.position.set(0, -0.38, 0.02);
      armRightGroup.add(handRight);

      bokononGroup.add(armRightGroup);

      // F. Bras Gauche tenant le sceptre sacré (Aso-Vodun)
      const armLeftGroup = new THREE.Group();
      armLeftGroup.position.set(-0.3, 0.68, 0.04);

      const armLeftGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.4, 20);
      armLeftGeo.translate(0, -0.18, 0);
      const armLeftMesh = new THREE.Mesh(armLeftGeo, robeMat);
      armLeftGroup.add(armLeftMesh);

      const scepterGeo = new THREE.CylinderGeometry(0.012, 0.016, 0.58, 16);
      const scepter = new THREE.Mesh(scepterGeo, goldOrnamentMat);
      scepter.rotation.x = Math.PI / 4;
      scepter.position.set(-0.02, -0.3, 0.13);
      armLeftGroup.add(scepter);

      bokononGroup.add(armLeftGroup);

      scene.add(bokononGroup);

      // 11. Particules magiques d'incantation
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSpeeds: { vx: number; vy: number; vz: number }[] = [];

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 1.2;
        particlePositions[i * 3 + 1] = 0.4 + Math.random() * 1.4;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

        particleSpeeds.push({
          vx: (Math.random() - 0.5) * 0.01,
          vy: 0.008 + Math.random() * 0.015,
          vz: (Math.random() - 0.5) * 0.01,
        });
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xffd978,
        size: 0.04,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      particles.visible = false;
      scene.add(particles);

      // 12. Boucle de rendu temps réel 60 FPS
      let clock = 0;

      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        clock += 0.025;

        // Flambeaux
        torchLeft.intensity = 2.2 + Math.sin(clock * 9) * 0.35;
        torchRight.intensity = 2.2 + Math.cos(clock * 7.5) * 0.35;

        // Respiration subtile du torse
        torso.scale.y = 1 + Math.sin(clock * 2) * 0.012;

        const currentAct = actRef.current;

        if (currentAct === 'throw') {
          // Acte 1 : Rebond et vol des cauris
          const cycle = Math.sin(clock * 3.2);
          armRightGroup.rotation.x = -Math.PI / 4 + cycle * 0.3;
          armRightGroup.rotation.z = -0.1 + cycle * 0.08;

          cowries.forEach((c, idx) => {
            const bounce = Math.max(0, Math.sin(clock * 3.2 + idx * 0.4));
            c.mesh.position.y = c.throwY + bounce * 0.1;
            c.mesh.rotation.y += c.rotSpeed;
          });

          camera.position.set(0, 0.68, baseDistance);
          camera.lookAt(0, targetCenterY, 0.05);
          particles.visible = false;
        } else if (currentAct === 'point') {
          // Acte 2 : Main tendue et incantation
          armRightGroup.rotation.x = -Math.PI / 2.2;
          armRightGroup.rotation.y = -0.25;
          armRightGroup.rotation.z = 0.15;

          headGroup.rotation.x = -0.12;

          cowries.forEach((c) => {
            c.mesh.position.y = c.throwY;
          });

          // Particules magiques d'incantation tourbillonnant autour de la main
          particles.visible = true;
          const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < particleCount; i++) {
            let px = posAttr.getX(i);
            let py = posAttr.getY(i);
            let pz = posAttr.getZ(i);

            py += particleSpeeds[i].vy;
            const angle = 0.04;
            const rx = px - 0.25;
            const rz = pz - 0.35;
            px = 0.25 + (rx * Math.cos(angle) - rz * Math.sin(angle));
            pz = 0.35 + (rx * Math.sin(angle) + rz * Math.cos(angle));

            if (py > 1.9) py = 0.5;
            posAttr.setXYZ(i, px, py, pz);
          }
          posAttr.needsUpdate = true;

          camera.position.set(0, 0.68, baseDistance * 0.94);
          camera.lookAt(0, targetCenterY + 0.04, 0.1);
        } else {
          // Acte 3 : Traversée vers les portes 3D
          camera.position.z -= 0.03;
          camera.lookAt(0, 0.7, 0);
        }

        gl.viewport(0, 0, glWidth, glHeight);
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      animate();
    } catch (e) {
      console.warn('Erreur initialisation BokononRigged3D:', e);
    }
  };

  return (
    <View style={styles.container}>
      <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0A',
  },
});
