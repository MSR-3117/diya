import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HandwrittenDecor() {
    const svgRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const paths = svgRef.current.querySelectorAll('path');

            gsap.set(paths, { strokeDasharray: 300, strokeDashoffset: 300, opacity: 0 });
            // External entrance control only

        }, svgRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="handwritten-decor" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 65
        }}>
            <svg ref={svgRef} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                {/* 
                   ARROW: Pointing from left side towards the new SystemInput (lower now due to stacked text).
                   Adjusted Coordinates: Start (200, 600) -> End (450, 650) assuming 1080p center is ~650y
                */}
                <path
                    d="M 250 550 Q 350 600 480 620"
                    fill="none"
                    stroke="rgba(0, 194, 55, 0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    markerEnd="url(#arrowhead)"
                />

                {/* Arrowhead Definition */}
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 194, 55, 0.4)" />
                    </marker>
                </defs>

                {/* 
                   Decorative Circle (Top Right) - Balancing composition
                */}
                <circle cx="85%" cy="30%" r="50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="5,5" />
                <path d="M 85% 25% L 85% 35%" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                <path d="M 82% 30% L 88% 30%" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />

                {/* 
                    Annotation Label
                */}
                <text x="240" y="540" fill="rgba(0, 194, 55, 0.4)" fontFamily="monospace" fontSize="12" style={{ opacity: 0, animation: 'fadeIn 1s 1.5s forwards' }}>
                    auto_detect :: source
                </text>
            </svg>
            <style>
                {`@keyframes fadeIn { to { opacity: 1; } }`}
            </style>
        </div>
    );
}
