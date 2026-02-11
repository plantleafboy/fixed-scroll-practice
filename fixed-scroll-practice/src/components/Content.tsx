import { useEffect, useRef, useState } from 'react';
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Tween, Group, Easing } from '@tweenjs/tween.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
ScrollTrigger.config({ limitCallbacks: true });
import { useLenis } from 'lenis/react';


const Content = () => {

    const [currentScroll, setCurrentScroll] = useState(0);
    const scrollRef = useRef(0); // Add this for the animation loop

    useLenis(({ scroll }) => {
        scrollRef.current = scroll; // Update the ref
    setCurrentScroll(scroll); 
    });


    const modelRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const loaderRef = useRef<GLTFLoader | null>(null);
    const objectRef = useRef<THREE.Object3D | null>(null);
    const boxRef = useRef<THREE.Box3 | null>(null);
    const tweenGroup = useRef(new Group());
    const scannerRef = useRef<HTMLDivElement> (null);
    const scanContainerRef = useRef<HTMLDivElement>(null);
    
    const scrollYOffset = useRef({ value: -1.5 });
    const headerRef = useRef<HTMLHeadingElement>(null);
    const scrambleRef = useRef<HTMLHeadingElement>(null);
    
    const scrambleChars = 'upperAndLowerCase';
    useEffect(() => {

        SplitText.create(headerRef.current!, {
            type: "characters,lines, words",
            mask: "words",
            autoSplit: true,
            onSplit(self) {
                return gsap.from(self.words, {
                duration: 1, 
                y: 100, 
                autoAlpha: 0, 
                stagger: 0.05
                });
            }
        });

                
        // Creates a looping timeline for a single quote element
        const scrambleQuote = (ref: React.RefObject<HTMLHeadingElement | null>, text: string) => {
            const tl = gsap.timeline({});

            // Show quote with scramble in
            tl.to(ref.current, {
            delay: Math.random() * 5, // Stagger the appearance
            duration: 1,
            opacity: 1,
            scrambleText: { text, chars: scrambleChars, revealDelay: 0.5, speed: 1 },
            ease: 'power2.out',
            })

            // // Hide quote with scramble out
            // .to(ref.current, {
            // delay: 0.5,
            // duration: 1,
            // scrambleText: { text: '', chars: scrambleChars },
            // opacity: 0,
            // ease: 'power2.in',
            // });
        };

        scrambleQuote(scrambleRef, scrambleRef.current?.textContent ?? '');

        let frameId : number;

        const floatAmplitude = 0.2;
        const floatSpeed = 1.5;
        const rotationSpeed = 0.3;
        let isFloating = true;

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
        
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 5, 1000);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false, // Turn this off
            logarithmicDepthBuffer: true,
            powerPreference: "high-performance"
        });
        renderer.setClearColor(0xfffdfd, 1); // Match your background color here

        renderer.setClearColor(0xffffff, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Shadow 
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting and Tone Mapping
        renderer.outputColorSpace = THREE.SRGBColorSpace; 
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;


        if (model) {
            model.appendChild(renderer.domElement);
        }
        rendererRef.current = renderer;

        

        const playInitialAnimation = () => {
            if (!objectRef.current) return;

            // Example: Make the spiral grow from scale 0 to 1
            objectRef.current.scale.set(0, 0, 0);

            new Tween(objectRef.current.scale, tweenGroup.current)
                .to({ x: 1.5, y: 1.5, z: 1.5 }, 1500)
                .easing(Easing.Back.Out)
                .start();
            
            gsap.to(objectRef.current.scale, {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    duration: 1,
                    ease: "power2.out",
            });
            
        };

        gsap.to(scanContainerRef.current, { //TODO: whats this shit
                    scale: 1,
                    duration: 1,
                    ease: "power2.out",
        });

        let time = 0;
        let isExiting = false;
        
        const animate = () => { //TODO: confirm order of movement
            frameId = requestAnimationFrame(animate);

            time += 0.01 * floatSpeed; // Increment time based on your speed variable

            if (objectRef.current) {
                const liveScroll = scrollRef.current;
                const scannerPosition1 = scannerRef.current?.offsetTop || 1000;
                const scrollProgress1 = Math.min(liveScroll / scannerPosition1, 1);

                // Handle Position: Combined Floating + Scroll Offset
                const floatOffset = isFloating ? Math.sin(time) * floatAmplitude : 0;
                objectRef.current.position.y = scrollYOffset.current.value + floatOffset;

                // Handle Rotation: Combined Scroll Rotation + Idle Spin
                objectRef.current.rotation.x = scrollProgress1 * Math.PI * 2;
                objectRef.current.rotation.y += 0.001 * rotationSpeed;
                // const liveScroll = scrollRef.current;

                // // Math.sin creates a smooth up-and-down wave
                // objectRef.current.position.y = scrollYOffset.current.value + Math.sin(time) * floatAmplitude;
                // objectRef.current.rotation.y += 0.005;

                // // 1. Calculate Progress- Use the offsetTop of your scanner section to know when the model should be "flipped"
                // const scannerPosition1 = scannerRef.current?.offsetTop || 1000;
                // const scrollProgress1 = Math.min(liveScroll / scannerPosition1, 1);

                // if (isFloating) {
                //     const floatOffset = Math.sin(time) * floatAmplitude;
                //     objectRef.current.position.y = scrollYOffset.current.value + floatOffset;
                // }

                //  objectRef.current.position.y = scrollYOffset.current.value;
                // // 3. Scroll-Based Rotation - Maps 0-1 progress to a full 360-degree X-axis rotation
                // objectRef.current.rotation.x = scrollProgress1 * Math.PI * 2;
                
                // // Keeps the model spinning slightly on the Y-axis for constant movement
                // objectRef.current.rotation.y += 0.001 * rotationSpeed;

                
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }

            tweenGroup.current.update();

        }

        const loader = new GLTFLoader();
        loaderRef.current = loader;

        loader.load('../../../spiral.glb', (gltf: GLTF) => {

            objectRef.current = gltf.scene;
            
            if (objectRef.current) {
                objectRef.current.traverse((node: THREE.Object3D) => {            
                    if ((node as THREE.Mesh).isMesh) {
                        const mesh = node as THREE.Mesh;
                        mesh.geometry.center();
                        
                        // Ensure the material exists and is a StandardMaterial (common for GLB)
                        if (mesh.material && mesh.material instanceof THREE.MeshStandardMaterial) {
                            mesh.material.metalness = 0.5;
                            mesh.material.roughness = 0.2;
                            mesh.material.envMapIntensity = 1.2;
                            // mesh.material.metalness = 0.5;
                            mesh.material.transparent = false; // Usually better for spirals
                            mesh.material.depthWrite = true;
                            //  mesh.material.depthTest = true;
                             mesh.material.side = THREE.DoubleSide;
                            // mesh.material.roughness = 0.2;
                            // mesh.material.envMapIntensity = 1.5;
                            // mesh.material.polygonOffset = true; // Prevents overlapping faces from fighting
                            // mesh.material.polygonOffsetFactor = 1;
                            // mesh.material.polygonOffsetUnits = 1;
                        }
                        // mesh.castShadow = true;
                    }
                });
            }
            if (objectRef.current) {
                const box = new THREE.Box3().setFromObject(objectRef.current);
                boxRef.current = box;
                objectRef.current.position.y = scrollYOffset.value;   

                scene.add(objectRef.current) 

                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                camera.position.z = maxDim * 4; 
                objectRef.current.scale.set(1,1,1);
                camera.lookAt(0,0,0);

                // --- ADD THE GSAP TRIGGER HERE ---
                ScrollTrigger.create({
                    trigger: ".scanner",
                    start: "top center",
                    onEnter: () => {
                        if (objectRef.current) {
                            isExiting = true; // Set your flag
                            
                            gsap.to(objectRef.current.scale, {
                                x: 0, y: 0, z: 0,
                                duration: 0.8,
                                ease: "back.in(1.7)",
                                onComplete: () => {
                                    console.log("Shrink finished!");
                                }
                            });
                        }
                    }
                });

                playInitialAnimation();

                // 2. Setup GSAP inside the loader success callback
                if (scannerRef.current) {
                    gsap.to(scrollYOffset.current, {
                        value: 2, // The target Y position when scrolled
                        scrollTrigger: {
                            trigger: scannerRef.current,
                            start: "top center",
                            end: "bottom center",
                            scrub: true,
                        }
                    });
                }
            } else {
                return;
            }
        });

        animate();        
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
                <h1 ref={headerRef}> An attempt at modern animations <br/>
                after 2025 burnout
                </h1>
                <h2 className = "scramble"ref={scrambleRef}>Project uses React, TSX, GSAP with Scroll Trigger, ThreeJS</h2>
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

            <section className="scanner" ref={scannerRef}>
                <div className="scan-info">
                    <div className="product-id"><h2>$42_88</h2></div>
                    <div className="product-description">
                        <p> Engage and showcase </p>
                    </div>
                </div>
            </section>

            <div className="scan-container" ref={scanContainerRef}> </div>

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

// TODO: create the scene with another model - learn the attributes to look for
// extra: create own model...