import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/content-direction.css';
import ModernButton from './ui/ModernButton';
import SystemNav from './SystemNav';

// Icons (Simple SVGs)
const Icons = {
    LinkedIn: <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
    Instagram: <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>,
    X: <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>,
    Facebook: <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
};

const PLATFORMS = [
    { id: 'linkedin', name: 'LinkedIn', icon: Icons.LinkedIn, color: '#0077b5' },
    { id: 'instagram', name: 'Instagram', icon: Icons.Instagram, color: '#E1306C' },
    { id: 'x', name: 'X (Twitter)', icon: Icons.X, color: '#111111' },
    { id: 'facebook', name: 'Facebook', icon: Icons.Facebook, color: '#1877F2' },
];

export default function ContentDirection() {
    const navigate = useNavigate();
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [freqMode, setFreqMode] = useState('week'); // 'week' | 'month'
    const [freqValue, setFreqValue] = useState(3);
    const [isProcessing, setIsProcessing] = useState(false);

    // Refs for animations
    const containerRef = useRef(null);
    const loaderRef = useRef(null);
    const loaderTextRef = useRef(null);
    const progressRef = useRef(null);

    // Toggle Platform
    const togglePlatform = (id) => {
        setSelectedPlatforms(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Handle Frequency Change
    useEffect(() => {
        // Reset to default on mode switch
        if (freqMode === 'week') setFreqValue(3);
        else setFreqValue(12);
    }, [freqMode]);

    const adjustFreq = (delta) => {
        const min = 1;
        const max = freqMode === 'week' ? 7 : 30;
        setFreqValue(v => Math.min(Math.max(v + delta, min), max));
    };

    // THE DELEGATION ACTION
    const handleDelegate = () => {
        if (selectedPlatforms.length === 0) {
            alert("Please select at least one platform.");
            return;
        }
        setIsProcessing(true);
    };

    // --- ENTRANCE ANIMATION (SUPER COOL VERSION) ---
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Initial States
            gsap.set('.system-nav', { y: -20, opacity: 0 });
            gsap.set('.direction-header h1 .word', { y: 80, opacity: 0, rotation: 5 });

            // Explicitly set 0 width and padding to start
            gsap.set('.diya-super-box', { width: 0, padding: 0, opacity: 1 });
            gsap.set('.diya-super-box .char', { y: 40, opacity: 0 });
            gsap.set('.direction-content', { y: 40, opacity: 0 });
            gsap.set('.sub-char', { y: 20, opacity: 0 }); // Initial state for sub-header chars

            const tl = gsap.timeline({ delay: 0.1 });

            // 1. Navigation Drops In
            tl.to('.system-nav', { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });

            // 2. Header Words (Explosive Entry)
            // Target all .word elements (excluding the ones in the box for now)
            tl.to('.direction-header h1 > .word', {
                y: 0,
                opacity: 1,
                rotation: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power4.out"
            }, "-=0.3");

            // 2b. Sub-header Text Entry (Slide Up + Fade) - SYNCED WITH HEADER
            // Appears alongside the main header text
            tl.to('.sub-char', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.02,
                ease: "power2.out"
            }, "<0.2"); // Start 0.2s after Header starts

            // Measure Width for Smoothness
            const box = document.querySelector('.diya-super-box');
            // Temporarily unset width to get natural size
            gsap.set(box, { width: 'auto', padding: '0 0.4em' });
            const finalWidth = box.offsetWidth + 2; // +2px buffer for subpixel rounding
            // Reset to 0
            gsap.set(box, { width: 0, padding: 0 });

            // 3. Highlight Box Expands (Pre-calc Pixel Width)
            tl.to('.diya-super-box', {
                width: finalWidth,
                padding: '0 0.4em',
                duration: 1.2,
                ease: "power2.inOut"
            }, "-=1.0");

            // 4. Text Inside Box (Fade In)
            tl.to('.diya-super-box span', {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.05,
                ease: "back.out(1.2)"
            }, "-=0.5");

            // 5. The Shine (Flash)
            tl.fromTo('.diya-super-box::after',
                { left: '-100%' },
                { left: '200%', duration: 0.6, ease: "power2.inOut" },
                "-=0.1"
            );

            // 7. Grid & Sections Fade In
            tl.to('.direction-content', {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, "-=0.5");

            gsap.registerPlugin(ScrollTrigger);

            // ... (Previous animations kept but ensuring ScrollTrigger logic is added)

            // 9. Scroll Animations for Frequency Section
            // Title
            gsap.fromTo('.frequency-section .section-title',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.frequency-section',
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Toggle Switch
            gsap.fromTo('.frequency-control',
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: '.frequency-section',
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Counter
            gsap.fromTo('.freq-value-selector',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.frequency-section',
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // 10. CTA Button Scroll Animation
            gsap.fromTo('.delegation-section',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.delegation-section',
                        start: "top 95%", // Trigger almost at bottom
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // 8. Looping Sub-header (Green Wave)
            // Staggered color cycle for "shimmer" effect - Starts after entry
            gsap.to('.sub-char', {
                color: '#00c237', // Brand Green
                duration: 1.5,
                stagger: {
                    each: 0.03,
                    repeat: -1,
                    yoyo: true,
                    from: "start"
                },
                ease: "sine.inOut",
                delay: 0.5 // Minimal delay after entry
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    // --- PARTICLE BURST LOGIC ---
    const triggerExplosion = (rect, iconSvg, color) => {
        // Create fewer, high-quality particles (3-4)
        const particleCount = 4;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = iconSvg; // Inject SVG

            // Random start position near center
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            // Randomize spread
            const randomX = (Math.random() - 0.5) * 150; // Wider horizontal spread
            const apexY = startY - 200 - Math.random() * 100; // Go higher
            const dropY = window.innerHeight + 100; // Fall off screen

            // Style the particle wrapper
            Object.assign(particle.style, {
                position: 'fixed',
                left: `${startX}px`,
                top: `${startY}px`,
                width: '32px', // Slightly larger for "High Quality" feel
                height: '32px',
                color: color,
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: 0,
                transform: 'translate(-50%, -50%)' // Center anchor
            });

            document.body.appendChild(particle);

            // GSAP Physics Simulation (Projectile Motion)
            // We use a single timeline but animate X and Y with different eases to create a curve
            const tl = gsap.timeline({
                onComplete: () => particle.remove()
            });

            const duration = 1.5 + Math.random() * 0.5;

            tl.set(particle, { opacity: 1, scale: 0 })
                .to(particle, {
                    scale: 1,
                    duration: 0.2,
                    ease: "back.out(1.2)"
                }, 0)
                .to(particle, {
                    x: randomX,
                    duration: duration,
                    ease: "power1.out" // Linear-ish horizontal drift
                }, 0)
                .to(particle, {
                    y: -300 - Math.random() * 100, // Upward burst
                    duration: duration * 0.4,
                    ease: "power2.out" // Decelerate up
                }, 0)
                .to(particle, {
                    y: window.innerHeight - startY + 100, // Downward fall (relative to start)
                    duration: duration * 0.6,
                    ease: "power2.in" // Accelerate down
                }, ">") // Append immediately after up
                .to(particle, {
                    rotation: (Math.random() - 0.5) * 720,
                    duration: duration,
                    ease: "none"
                }, 0);
        }
    };

    // Helper text for sub-header
    const subText = "Set the direction once. DIYA handles the rest.";

    // ... (Loader logic remains same)

    return (
        <div className="direction-page" ref={containerRef}>
            {/* Navigation */}
            <SystemNav step={2} totalSteps={3} onBack={() => navigate('/brand-persona')} />

            {/* Header */}
            <header className="direction-header">
                <h1>
                    <span className="word">HOW</span>{' '}
                    <span className="word">SHOULD</span>{' '}
                    <span className="word">DIYA</span>{' '}
                    <span className="word">RUN</span>{' '}
                    <br className="mobile-break" />
                    {/* The Kinetic Box around YOUR CONTENT */}
                    <span className="diya-super-box">
                        <span>YOUR</span>
                        {/* Gap handles spacing now */}
                        <span>CONTENT?</span>
                    </span>
                </h1>
                <p className="direction-sub">
                    {subText.split('').map((char, i) => (
                        <span key={i} className="sub-char" style={{ display: 'inline-block' }}>
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </p>
            </header>

            <main className="direction-content">
                {/* 1. Platform Section */}
                <section className="direction-section">
                    <h2 className="section-title">Where should DIYA post?</h2>
                    <div className="platform-grid">
                        {PLATFORMS.map(p => (
                            <div
                                key={p.id}
                                className={`platform-card ${selectedPlatforms.includes(p.id) ? 'selected' : ''}`}
                                onClick={(e) => {
                                    if (!selectedPlatforms.includes(p.id)) {
                                        // Trigger explosion only on select
                                        const rect = e.currentTarget.getBoundingClientRect();

                                        // Get SVG string based on ID (Reusing paths for particles)
                                        let iconString = '';
                                        if (p.id === 'linkedin') iconString = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>`;
                                        if (p.id === 'instagram') iconString = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>`;
                                        if (p.id === 'x') iconString = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>`;
                                        if (p.id === 'facebook') iconString = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>`;

                                        triggerExplosion(rect, iconString, p.color);
                                    }
                                    togglePlatform(p.id);
                                }}
                            >
                                <div className="check-indicator">✓</div>
                                <div className="platform-icon" style={{ color: selectedPlatforms.includes(p.id) ? '#00c237' : '#333' }}>
                                    {p.icon}
                                </div>
                                <span className="platform-name">{p.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Frequency Section */}
                <section className="direction-section frequency-section">
                    <h2 className="section-title">How often should DIYA post?</h2>

                    <div className="frequency-control">
                        <div
                            className="freq-slider-bg"
                            style={{ transform: freqMode === 'week' ? 'translateX(0)' : 'translateX(100%)' }}
                        />
                        <button
                            className={`freq-toggle-btn ${freqMode === 'week' ? 'active' : ''}`}
                            onClick={() => setFreqMode('week')}
                        >
                            Weekly
                        </button>
                        <button
                            className={`freq-toggle-btn ${freqMode === 'month' ? 'active' : ''}`}
                            onClick={() => setFreqMode('month')}
                        >
                            Monthly
                        </button>
                    </div>

                    <div className="freq-value-selector">
                        <button className="freq-btn" onClick={() => adjustFreq(-1)}>-</button>
                        <div className="freq-display-container">
                            <div className="freq-display">{freqValue}</div>
                            <div className="freq-label">posts per {freqMode}</div>
                        </div>
                        <button className="freq-btn" onClick={() => adjustFreq(1)}>+</button>
                    </div>
                </section>

                {/* 3. CTA Section */}
                <section className="delegation-section">
                    <ModernButton onClick={handleDelegate}>
                        Let DIYA plan the content
                    </ModernButton>
                </section>
            </main>

            {/* Planning Loader (Hidden until triggered) */}
            <div className="planning-loader" ref={loaderRef} style={{ display: 'none', opacity: 0 }}>
                <div className="loader-bar">
                    <div className="loader-progress" ref={progressRef}></div>
                </div>
                <div className="loader-text" ref={loaderTextRef}>
                    Initializing...
                </div>
            </div>
        </div>
    );
}
