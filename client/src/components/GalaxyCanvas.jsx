import React, { useEffect, useRef } from 'react';

export default function GalaxyCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for interactive constellations
    const mouse = {
      x: width / 2,
      y: height / 2,
      radius: 140
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Star generation
    const starCount = Math.min(Math.floor((width * height) / 5000), 220);
    let stars = [];

    const colors = [
      'rgba(255, 255, 255, ',
      'rgba(0, 240, 255, ',   // cyan
      'rgba(157, 78, 221, ',  // purple
      'rgba(247, 37, 133, ',  // magenta
      'rgba(255, 183, 3, '    // gold
    ];

    function initStars() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const baseAlpha = Math.random() * 0.7 + 0.3;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.2 + 0.6,
          baseColor: colors[Math.floor(Math.random() * colors.length)],
          alpha: baseAlpha,
          baseAlpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18
        });
      }
    }

    initStars();

    // Shooting stars / meteors
    let meteors = [];

    function spawnMeteor() {
      if (Math.random() < 0.02 && meteors.length < 3) {
        meteors.push({
          x: Math.random() * width * 1.2 - width * 0.1,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 90 + 50,
          speed: Math.random() * 8 + 6,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
          opacity: 1,
          decay: Math.random() * 0.015 + 0.01
        });
      }
    }

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Distant cosmic background glow
      const radialGlow = ctx.createRadialGradient(
        width * 0.75, height * 0.25, 50,
        width * 0.75, height * 0.25, width * 0.6
      );
      radialGlow.addColorStop(0, 'rgba(114, 9, 183, 0.08)');
      radialGlow.addColorStop(0.5, 'rgba(0, 240, 255, 0.03)');
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star slightly
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Twinkle
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 1) {
          star.alpha = 1;
          star.twinkleDir = -1;
        } else if (star.alpha <= 0.2) {
          star.alpha = 0.2;
          star.twinkleDir = 1;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.baseColor + star.alpha + ')';
        ctx.shadowBlur = star.size > 1.8 ? 10 : 3;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();

        // Connect nearby stars with constellation lines
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = star.x - s2.x;
          const dy = star.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(s2.x, s2.y);
            const lineAlpha = (1 - dist / 75) * 0.14;
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Interactive constellation connection to mouse
        const mdx = star.x - mouse.x;
        const mdy = star.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mouse.x, mouse.y);
          const mouseLineAlpha = (1 - mDist / mouse.radius) * 0.35;
          ctx.strokeStyle = `rgba(0, 240, 255, ${mouseLineAlpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0; // reset shadow

      // Spawn and draw meteors
      spawnMeteor();
      for (let m = meteors.length - 1; m >= 0; m--) {
        const meteor = meteors[m];
        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        const meteorGrad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        meteorGrad.addColorStop(0.3, `rgba(0, 240, 255, ${meteor.opacity * 0.8})`);
        meteorGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Update meteor
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.opacity -= meteor.decay;

        if (meteor.opacity <= 0 || meteor.x > width + 100 || meteor.y > height + 100) {
          meteors.splice(m, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="galaxy-canvas" ref={canvasRef} />;
}
