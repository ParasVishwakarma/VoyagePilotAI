import React, { useEffect, useRef } from "react";

export default function CyberFlightGrid() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        // Constellation / Flight Corridor Particles
        const particleCount = Math.min(45, Math.floor(width / 35));
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: Math.random() * 2 + 1.2,
                color: Math.random() > 0.6 ? "#10B981" : Math.random() > 0.3 ? "#00F5D4" : "#38BDF8",
                flightCode: "VP-" + (100 + Math.floor(Math.random() * 899)),
                alt: Math.floor(30000 + Math.random() * 12000),
            });
        }

        let mouse = { x: -1000, y: -1000 };
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener("mousemove", handleMouseMove);

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connecting flight corridor lines
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.x += p1.vx;
                p1.y += p1.vy;

                if (p1.x < 0) p1.x = width;
                if (p1.x > width) p1.x = 0;
                if (p1.y < 0) p1.y = height;
                if (p1.y > height) p1.y = 0;

                // Mouse interaction repulsion/attraction
                const dxm = mouse.x - p1.x;
                const dym = mouse.y - p1.y;
                const distMouse = Math.sqrt(dxm * dxm + dym * dym);
                if (distMouse < 140) {
                    p1.x -= dxm * 0.015;
                    p1.y -= dym * 0.015;
                }

                // Connect nearby particles with glowing cyber corridors
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 160) {
                        const alpha = (1 - dist / 160) * 0.18;
                        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Draw glowing node
                ctx.fillStyle = p1.color;
                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fill();

                // Draw subtle pulse ring around some nodes
                if (i % 5 === 0) {
                    ctx.strokeStyle = `rgba(16, 185, 129, 0.25)`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(p1.x, p1.y, p1.radius + 6, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.7,
            }}
        />
    );
}
