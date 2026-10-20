"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ThreeHeroProps {
  className?: string;
}

export default function ThreeHero({ className }: ThreeHeroProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const scrollMotion = useRef({ progress: 0 });
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useGSAP(
    () => {
      gsap.registerPlugin(useGSAP, ScrollTrigger);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(scrollMotion.current, {
          progress: 1,
          ease: "none",
          scrollTrigger: {
            trigger: hostRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      return () => media.revert();
    },
    { scope: hostRef },
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.error("Unable to initialize the 3D hero renderer.", error);
      setWebglUnavailable(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    scene.add(new THREE.AmbientLight(0xffffff, 1.05));

    const keyLight = new THREE.PointLight(0xe8c783, 72, 12, 2);
    keyLight.position.set(-2.2, 2.1, 3.2);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x8e6330, 55, 10, 2);
    rimLight.position.set(2.4, -1.8, -1.2);
    scene.add(rimLight);

    const object = new THREE.Group();
    scene.add(object);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.03, 3),
      new THREE.MeshPhysicalMaterial({
        color: 0xb28a4c,
        metalness: 0.72,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        flatShading: true,
      }),
    );
    object.add(core);

    const glassShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.12, 1),
      new THREE.MeshBasicMaterial({
        color: 0xe4c98f,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      }),
    );
    object.add(glassShell);

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.52, 0.009, 8, 180),
      new THREE.MeshBasicMaterial({
        color: 0xd0b176,
        transparent: true,
        opacity: 0.75,
      }),
    );
    orbit.rotation.set(0.92, 0.18, -0.42);
    object.add(orbit);

    const innerOrbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.34, 0.005, 8, 160),
      new THREE.MeshBasicMaterial({
        color: 0xe9ddc5,
        transparent: true,
        opacity: 0.42,
      }),
    );
    innerOrbit.rotation.set(0.16, 0.9, 0.32);
    object.add(innerOrbit);

    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 20, 16),
      new THREE.MeshBasicMaterial({ color: 0xf2dfb6 }),
    );
    node.position.set(1.36, 0.68, 0.42);
    object.add(node);

    const pointer = new THREE.Vector2(0, 0);
    const targetPointer = new THREE.Vector2(0, 0);
    const targetScale = new THREE.Vector3();
    let frame = 0;
    let visible = false;
    let pageVisible = !document.hidden;

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.position.z = width < 520 ? 6.5 : 5.8;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (reducedMotion.matches) renderer.render(scene, camera);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      targetPointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
    };
    const resetPointer = () => targetPointer.set(0, 0);
    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && visible && !reducedMotion.matches && !frame) {
        frame = window.requestAnimationFrame(renderFrame);
      }
    };

    const renderFrame = () => {
      frame = 0;
      if (!visible || !pageVisible) return;

      pointer.lerp(targetPointer, 0.045);
      const progress = scrollMotion.current.progress;
      object.rotation.x +=
        ((pointer.y * 0.28 + progress * 0.48 + 0.08) - object.rotation.x) * 0.045;
      object.rotation.y +=
        ((pointer.x * 0.42 + progress * 1.15) - object.rotation.y) * 0.045;
      object.rotation.z += (progress * 0.24 - object.rotation.z) * 0.035;
      const scale = 1 + progress * 0.09;
      object.scale.lerp(targetScale.setScalar(scale), 0.045);

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(renderFrame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && pageVisible && !reducedMotion.matches && !frame) {
          frame = window.requestAnimationFrame(renderFrame);
        } else if ((!visible || !pageVisible) && frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0 },
    );

    const resizeObserver = new ResizeObserver(resize);
    observer.observe(host);
    resizeObserver.observe(host);
    document.addEventListener("visibilitychange", handleVisibility);
    if (!reducedMotion.matches) {
      host.addEventListener("pointermove", handlePointerMove);
      host.addEventListener("pointerleave", resetPointer);
    }
    resize();
    if (!reducedMotion.matches) {
      visible = true;
      frame = window.requestAnimationFrame(renderFrame);
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      host.removeEventListener("pointermove", handlePointerMove);
      host.removeEventListener("pointerleave", resetPointer);
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      role="img"
      aria-label="Interactive 3D study of a faceted, gold-toned glass form"
    >
      {webglUnavailable && (
        <div className="home-hero__fallback" aria-hidden="true">
          <span />
        </div>
      )}
    </div>
  );
}
