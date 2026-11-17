// Lightweight Canvas Confetti Engine (Zero dependencies, pure physics)
export function triggerConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["#10B981", "#00F5D4", "#2563EB", "#F59E0B", "#8B5CF6", "#EC4899", "#38BDF8"];
    const particles = [];
    const numParticles = 60;

    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 4 + Math.random() * 8;
        particles.push({
            x: originX,
            y: originY,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity - 3,
            size: 5 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            alpha: 1,
            gravity: 0.22,
        });
    }

    let animationId;
    function render() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        let active = false;

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotationSpeed;
            p.alpha -= 0.016;

            if (p.alpha > 0) {
                active = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
                ctx.restore();
            }
        });

        if (active) {
            animationId = requestAnimationFrame(render);
        } else {
            cancelAnimationFrame(animationId);
            if (canvas.parentNode) {
                document.body.removeChild(canvas);
            }
        }
    }

    render();
}
