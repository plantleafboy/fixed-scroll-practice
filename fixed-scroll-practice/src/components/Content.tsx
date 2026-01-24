import { useEffect, useRef, useState } from 'react';

import * as THREE from "three";



const Content = () => {

    const modelRef = useRef<HTMLDivElement | null>(null);

    const sceneRef = useRef<THREE.Scene | null>(null);

    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {

        let frameId : number;

        const model = modelRef.current;
        if (!model) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0xfefdfd);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;

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
            
        }

        animate();        


        return () => {

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