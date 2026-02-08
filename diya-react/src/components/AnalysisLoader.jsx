import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../css/analysis-loader.css';

const LOG_MESSAGES = [
    { text: "Connecting to server...", type: "info", delay: 0 },
    { text: "Handshake successful. Secure connection established.", type: "success", delay: 500 },
    { text: "Fetching site metadata...", type: "info", delay: 1000 },
    { text: "Found <title> tag: 'Diya | AI Branding'.", type: "success", delay: 1200 },
    { text: "Extracting color palette...", type: "info", delay: 1800 },
    { text: "Detected Primary Mode: Light / Clean", type: "success", delay: 2200 },
    { text: "Detected Accent Color: #00c237", type: "success", delay: 2300 },
    { text: "Analyzing typography assets...", type: "info", delay: 2800 },
    { text: "Font family 'Inter' identified.", type: "success", delay: 3100 },
    { text: "Synthesizing Brand Persona...", type: "warning", delay: 3500 },
    { text: "Generation complete. Redirecting...", type: "success", delay: 4200 },
];

export default function AnalysisLoader() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const circleRef = useRef(null);
    const textRef = useRef(null);
    const [logs, setLogs] = useState([]);
    const [percentage, setPercentage] = useState(0);

    // 1. Progress Bar Animation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Percentage Text
            gsap.to(textRef.current, {
                innerText: 100,
                duration: 4.5,
                snap: { innerText: 1 },
                ease: "power1.inOut",
                onUpdate: function () {
                    setPercentage(Math.ceil(this.targets()[0].innerText));
                }
            });

            // Animate Circle Stroke
            const circumference = 880; // 2 * PI * 140
            gsap.fromTo(circleRef.current,
                { strokeDashoffset: circumference },
                { strokeDashoffset: 0, duration: 4.5, ease: "power1.inOut" }
            );

            // Exit Animation & Redirect
            gsap.delayedCall(4.8, () => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.5,
                    onComplete: () => navigate('/brand-persona')
                });
            });

        }, containerRef);
        return () => ctx.revert();
    }, [navigate]);

    // 2. Log Simulation
    useEffect(() => {
        let timeouts = [];

        LOG_MESSAGES.forEach((msg) => {
            const timeout = setTimeout(() => {
                setLogs(prev => [...prev, msg]);
                // Auto-scroll to bottom driven by CSS or layout update, 
                // but since array expansion forces re-render, we can just rely on flex-end
            }, msg.delay);
            timeouts.push(timeout);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="analysis-page" ref={containerRef}>
            <div className="scan-grid"></div>
            <div className="scan-line"></div>

            <div className="progress-container">
                <svg className="progress-svg" viewBox="0 0 300 300">
                    <circle
                        className="progress-circle-bg"
                        cx="150" cy="150" r="140"
                    />
                    <circle
                        ref={circleRef}
                        className="progress-circle-bar"
                        cx="150" cy="150" r="140"
                    />
                </svg>
                <div className="scan-text">
                    <span className="scan-percentage" ref={textRef}>0</span>
                    <span className="scan-label">%</span>
                </div>
            </div>

            <div className="terminal-log">
                {logs.map((log, i) => (
                    <div key={i} className={`log-entry ${log.type}`}>
                        {`> ${log.text}`}
                    </div>
                ))}
            </div>

            <h3 style={{ marginTop: '2rem', fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>
                Deconstructing Brand Identity...
            </h3>
        </div>
    );
}
