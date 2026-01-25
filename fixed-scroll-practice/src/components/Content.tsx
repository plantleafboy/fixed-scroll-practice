import { useEffect, useRef, useState } from 'react';
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Tween, Group, Easing } from '@tweenjs/tween.js';





const Content = () => {

    const modelRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    const loaderRef = useRef<GLTFLoader | null>(null);
    const objectRef = useRef<THREE.Object3D | null>(null);
    const boxRef = useRef<THREE.Box3 | null>(null);
    const tweenGroup = useRef(new Group());
 

    const playInitialAnimation = () => {
        if (!objectRef.current) return;

        // Example: Make the spiral grow from scale 0 to 1
        objectRef.current.scale.set(0, 0, 0);

        new Tween(objectRef.current.scale, tweenGroup.current)
            .to({ x: 1, y: 1, z: 1 }, 1500)
            .easing(Easing.Back.Out)
            .start();
    };
    useEffect(() => {

        let frameId : number;

        const model = modelRef.current;
        if (!model) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0xfefdfd);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        scene.add(dirLight);
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;

        
            // // 1. Add a temporary bright light just to see if it's there
            // const pointLight = new THREE.PointLight(0xffffff, 100);
            // pointLight.position.set(5, 5, 5);
            // scene.add(pointLight);

        const renderer = new THREE.WebGLRenderer({
            antialias: true, alpha: true
        });

        renderer.setClearColor(0xffffff, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Shadow 
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting and Tone Mapping
        renderer.outputColorSpace = THREE.SRGBColorSpace; 
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2.5;


        if (model) {
            model.appendChild(renderer.domElement);
        }
        rendererRef.current = renderer;

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            }

            tweenGroup.current.update();

        }

        const loader = new GLTFLoader();
        loaderRef.current = loader;

        loader.load('../../../public/spiral.glb', (gltf: GLTF) => {
            objectRef.current = gltf.scene;
            
            gltf.scene.traverse((node: THREE.Object3D) => {
                if ((node as THREE.Mesh).isMesh) {
                    const mesh = node as THREE.Mesh;
                    
                    // Ensure the material exists and is a StandardMaterial (common for GLB)
                    if (mesh.material && mesh.material instanceof THREE.MeshStandardMaterial) {
                        mesh.material.metalness = 0.5;
                        mesh.material.roughness = 0.2;
                        mesh.material.envMapIntensity = 1.5;
                    }
                    
                    mesh.castShadow = true;
                    // mesh.receiveShadow = true;
                }
            });
            
            if (objectRef.current) {
                const box = new THREE.Box3().setFromObject(objectRef.current);
                boxRef.current = box;
                const center = box.getCenter(new THREE.Vector3());
                gltf.scene.position.sub(center);
                scene.add(gltf.scene)

                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                camera.position.z = maxDim * 1.5;
                // gltf.scene.scale.set(0,0,0,);
                camera.lookAt(0,0,0);

                playInitialAnimation();


            } else {
                return;
            }

            // gltf.scene.position.set(0,0,0);
            // camera.position.set(3,2,4);
            // camera.lookAt(0,0,0);
        });
        //CONTEXT - model = gltf.scene

        animate();        
        // cancelAnimationFrame(frameId);


        return () => {

            cancelAnimationFrame(frameId);

            model.removeChild(renderer.domElement);
            renderer.dispose();
        }
    }, []) 

    return (
        <>
            <div id="model" ref={modelRef}></div>

            <section  className="hero">
                <h1> An attempt at modern animations <br/>
                after 2025 burnout
                </h1>
                <h2>Project uses React, TSX, GSAP with Scroll Trigger, ThreeJS</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque ipsam veritatis ipsa nisi non, sint voluptas aspernatur animi ea officiis magni repellendus inventore at et illo quasi fugiat explicabo adipisci!</p>

            </section>

            <section  className="info">
                <div className = "tags">
                    <p>Marketing for powerful products</p>
                    <p> UX & UI </p>
                    <p> Digital presence </p>
                    <p> Be creative </p>                
                 </div>
                 <h2> We believe teamwork sparks innovation, POWERFUL products need a silver platter to display what can be achieved 
                 </h2>
            </section>

            <section className="scanner">
                <div className="scan-info">
                    <div className="product-id"><h2>$42_88</h2></div>
                    <div className="product-description">
                        <p> Engage and showcase </p>
                    </div>
                </div>
            </section>

            <div className="scan-container"> </div>

            <div className="barcode">
                <img src="../assets/barcode.png" alt="" />
            </div>

            <div className="purchased">
                <p>finished.</p>
            </div>
            <section className="outro"></section>

        </>
    )
} 

export default Content;