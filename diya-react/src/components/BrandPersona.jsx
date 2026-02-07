import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BrandPersona() {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} style={{
            height: '100vh',
            width: '100%',
            backgroundColor: '#f4f4f4',
            color: '#111',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            fontFamily: 'var(--font-heading)'
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Brand Persona Generated</h1>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Dashboard Placeholder</p>
            <div style={{
                marginTop: '2rem',
                padding: '2rem',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <div style={{ marginBottom: '1rem' }}><strong>Primary Color:</strong> #111111</div>
                <div style={{ marginBottom: '1rem' }}><strong>Accent Color:</strong> #00c237</div>
                <div><strong>Typography:</strong> Inter</div>
            </div>
        </div>
    );
}
