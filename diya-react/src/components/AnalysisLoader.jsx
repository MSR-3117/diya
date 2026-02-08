import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../css/analysis-loader.css';
import BoxLoader from './ui/BoxLoader';
import GravityShapes from './ui/GravityShapes';
import BrandFacts from './ui/BrandFacts';

const LOADING_STEPS = [
    "Analyzing your responses...",
    "Detecting your brand's unique voice...",
    "Curating your perfect color palette...",
    "Designing your custom persona..."
];

export default function AnalysisLoader() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [statusText, setStatusText] = useState(LOADING_STEPS[0]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // --- A. Master Text Cycle (Total ~10s) ---
            LOADING_STEPS.forEach((step, index) => {
                // 1. Set Text (Immediate)
                tl.call(() => setStatusText(step))

                    // 2. Fade In (Smooth)
                    .fromTo(textRef.current,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
                    )

                    // 3. Hold (Readability)
                    .to(textRef.current, {
                        opacity: 1,
                        duration: 1.2
                    }) // Dummy tween for delay

                    // 4. Fade Out (Clean exit, except last one stays a bit longer before page exit)
                    .to(textRef.current, {
                        opacity: 0,
                        y: -10,
                        duration: 0.5,
                        ease: "power2.in"
                    });
            });

            // --- B. Exit Sequence (At ~10s) ---
            // Triggered after the text cycle completes
            tl.call(() => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => navigate('/brand-persona')
                });
            });

        }, containerRef);
        return () => ctx.revert();
    }, [navigate]);

    return (
        <div className="analysis-page" ref={containerRef} style={{ background: '#f9f9f9', position: 'relative', overflow: 'hidden' }}>
            {/* 1. Background Layer (Falling Shapes) */}
            <GravityShapes />

            {/* 2. Content Layer (Loader & Status) */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <BoxLoader />
                </div>

                <div className="loading-status-text" ref={textRef} style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: '#666',
                    textAlign: 'center',
                    minHeight: '2rem', // Prevent layout shift
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    letterSpacing: '0.02em'
                }}>
                    {statusText}
                </div>
            </div>

            {/* 3. Foreground Layer (Brand Facts) */}
            <BrandFacts />
        </div>
    );
}
