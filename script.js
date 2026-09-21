/**
 * ThChang | Graduation Invitation - Mobile Showcase
 * - Falling Stars & Sparkles Animation (5-point stars, diamond sparkles, shooting stars, tap burst)
 * - Autoplay Background Music with Mobile First-Touch Fallback
 * - Floating Music Controller
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Canvas Falling Stars & Sparkles Animation
     ========================================================================== */
  const canvas = document.getElementById('stars-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });

    // Star Color Palettes (matching card's ruby red, golden, champagne, and silver glitter)
    const starColorPalettes = [
      { fill: '#d62839', glow: 'rgba(214, 40, 57, 0.75)' }, // Ruby Red
      { fill: '#ff4d6d', glow: 'rgba(255, 77, 109, 0.75)' }, // Glitter Red-Pink
      { fill: '#f4c058', glow: 'rgba(244, 192, 88, 0.85)' }, // Metallic Gold
      { fill: '#fff0c2', glow: 'rgba(255, 240, 194, 0.9)' },  // Champagne Gold
      { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.85)' }, // Silver White
      { fill: '#cbd5e1', glow: 'rgba(203, 213, 225, 0.65)' }  // Shimmer Silver
    ];

    // Falling 5-Point Stars
    const stars = [];
    const STAR_COUNT = Math.min(30, Math.max(16, Math.floor(window.innerWidth / 22)));

    for (let i = 0; i < STAR_COUNT; i++) {
      const palette = starColorPalettes[Math.floor(Math.random() * starColorPalettes.length)];
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 5 + Math.random() * 8,
        speedY: 0.7 + Math.random() * 1.3,
        speedX: (Math.random() - 0.5) * 0.9,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.015 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.035,
        fill: palette.fill,
        glow: palette.glow,
        opacity: 0.6 + Math.random() * 0.4
      });
    }

    // 4-Point Cross Sparkles (Diamond Twinkles)
    const sparkles = [];
    const SPARKLE_COUNT = Math.min(24, Math.max(12, Math.floor(window.innerWidth / 28)));

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparkles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 2.5 + Math.random() * 4,
        alpha: Math.random() * Math.PI * 2,
        speedAlpha: 0.03 + Math.random() * 0.045,
        speedY: 0.3 + Math.random() * 0.6,
        color: Math.random() > 0.4 ? '#f4c058' : '#ffffff'
      });
    }

    // Interactive Tap / Click Burst Particles
    const burstParticles = [];

    function addStarBurst(x, y) {
      const count = 10;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
        const speed = 2 + Math.random() * 3.5;
        const palette = starColorPalettes[Math.floor(Math.random() * starColorPalettes.length)];
        burstParticles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 4 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          fill: palette.fill,
          glow: palette.glow,
          alpha: 1,
          decay: 0.022 + Math.random() * 0.025
        });
      }
    }
    window.addStarBurst = addStarBurst;

    // Touch & pointer listener for sparkle bursts
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('#music-btn') || e.target.closest('#open-invitation-btn')) return;
      addStarBurst(e.clientX, e.clientY);
    });

    // Shooting Star / Meteor
    let shootingStar = null;
    let nextShootingStarTime = Date.now() + 2000;

    function createShootingStar() {
      const startX = Math.random() * width * 0.8;
      shootingStar = {
        x: startX,
        y: Math.random() * (height * 0.35),
        length: 70 + Math.random() * 60,
        speed: 11 + Math.random() * 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
        opacity: 1,
        fadeSpeed: 0.018
      };
      nextShootingStarTime = Date.now() + 3500 + Math.random() * 5000;
    }

    // Draw 5-Pointed Star
    function drawStar(cx, cy, spikes, outerRadius, innerRadius, fillStyle, glowColor, opacity) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();

      ctx.shadowBlur = 8;
      ctx.shadowColor = glowColor;
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.restore();
    }

    // Draw 4-Pointed Sparkle Cross
    function drawSparkleCross(cx, cy, size, alpha, color) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.closePath();
      ctx.fill();

      // Mini center core
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // 1. Cross Sparkles
      for (let i = 0; i < sparkles.length; i++) {
        const sp = sparkles[i];
        sp.y += sp.speedY;
        sp.alpha += sp.speedAlpha;

        if (sp.y > height + 10) {
          sp.y = -10;
          sp.x = Math.random() * width;
        }

        const currentAlpha = Math.abs(Math.sin(sp.alpha)) * 0.95;
        drawSparkleCross(sp.x, sp.y, sp.size, currentAlpha, sp.color);
      }

      // 2. Falling 5-Point Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y += s.speedY;
        s.swing += s.swingSpeed;
        s.x += Math.sin(s.swing) * s.speedX;
        s.rotation += s.rotSpeed;

        if (s.y > height + 25) {
          s.y = -25;
          s.x = Math.random() * width;
        }
        if (s.x > width + 25) s.x = -20;
        if (s.x < -25) s.x = width + 20;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        drawStar(0, 0, 5, s.size, s.size * 0.44, s.fill, s.glow, s.opacity);
        ctx.restore();
      }

      // 3. Click/Touch Burst Particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vy += 0.08;
        bp.vx *= 0.97;
        bp.alpha -= bp.decay;
        bp.rotation += bp.rotSpeed;

        if (bp.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(bp.x, bp.y);
        ctx.rotate(bp.rotation);
        drawStar(0, 0, 5, bp.size, bp.size * 0.44, bp.fill, bp.glow, bp.alpha);
        ctx.restore();
      }

      // 4. Shooting Star
      if (Date.now() > nextShootingStarTime && !shootingStar) {
        createShootingStar();
      }

      if (shootingStar) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= shootingStar.fadeSpeed;

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar = null;
        } else {
          ctx.save();
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.6, 'rgba(244, 192, 88, 0.4)');
          grad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.opacity})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffffff';

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(shootingStar.x, shootingStar.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          ctx.restore();
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ==========================================================================
     2. Background Music Autoplay & Controller (from thiepcuoionline)
     ========================================================================== */
  const bgAudio = document.getElementById('wedding-audio') || document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn') || document.getElementById('music-toggle-btn');

  function updateMusicUI(isPlaying) {
    if (musicBtn) {
      const isMuted = bgAudio && bgAudio.muted;
      if (isPlaying && !isMuted) {
        musicBtn.classList.add('playing');
      } else {
        musicBtn.classList.remove('playing');
      }
      musicBtn.setAttribute('aria-pressed', String(Boolean(isPlaying && !isMuted)));
      musicBtn.setAttribute(
        'aria-label',
        isPlaying && !isMuted ? 'Tắt nhạc nền' : isPlaying ? 'Bật âm thanh nhạc nền' : 'Bật nhạc nền'
      );
      musicBtn.title = isPlaying && !isMuted ? 'Tắt nhạc' : isPlaying ? 'Bật âm thanh' : 'Bật nhạc';
    }
  }

  function startAudio() {
    if (!bgAudio) return Promise.resolve(false);

    // Browsers that allow audible autoplay will take this path.
    bgAudio.muted = false;
    return bgAudio.play().then(() => {
      updateMusicUI(true);
      return true;
    }).catch(() => {
      // Most mobile browsers block autoplay with sound. Start muted instead so
      // the track is ready; the first tap/scroll/key press below unmutes it.
      bgAudio.muted = true;
      return bgAudio.play().then(() => {
        updateMusicUI(true);
        return true;
      }).catch(() => {
        updateMusicUI(false);
        return false;
      });
    });
  }

  // 1. Try to autoplay on load
  startAudio();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAudio);
  } else {
    startAudio();
  }
  window.addEventListener('load', startAudio);
  window.addEventListener('pageshow', startAudio);

  // Hỗ trợ webview Zalo & WeChat tự kích hoạt âm thanh
  document.addEventListener('ZaloJSBridgeReady', startAudio);
  document.addEventListener('WeixinJSBridgeReady', startAudio);

  // 2. Play upon first user interaction if browser blocked unmuted autoplay
  const interactionEvents = ['click', 'touchstart', 'scroll', 'keydown', 'pointerdown'];
  function handleFirstInteraction() {
    if (bgAudio) {
      // This runs synchronously in the user gesture, which lets Safari and
      // Chrome switch from silent autoplay to audible playback.
      bgAudio.muted = false;
      if (bgAudio.paused) {
        bgAudio.play().then(() => updateMusicUI(true)).catch(() => updateMusicUI(false));
      } else {
        updateMusicUI(true);
      }
    }
    interactionEvents.forEach(evt => window.removeEventListener(evt, handleFirstInteraction));
  }
  interactionEvents.forEach(evt => window.addEventListener(evt, handleFirstInteraction, { passive: true, once: true }));

  // 3. Music Button toggle
  if (musicBtn && bgAudio) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgAudio.paused) {
        bgAudio.muted = false;
        bgAudio.play().then(() => updateMusicUI(true)).catch(() => updateMusicUI(false));
      } else if (bgAudio.muted) {
        bgAudio.muted = false;
        updateMusicUI(true);
      } else {
        bgAudio.pause();
        updateMusicUI(false);
      }
    });
  }

  if (bgAudio) {
    bgAudio.addEventListener('play', () => updateMusicUI(true));
    bgAudio.addEventListener('pause', () => updateMusicUI(false));
    bgAudio.addEventListener('volumechange', () => updateMusicUI(!bgAudio.paused));
  }

  /* ==========================================================================
     3. Invitation Opening Screen
     ========================================================================== */
  const invitationGate = document.getElementById('invitation-gate');
  const openInvitationBtn = document.getElementById('open-invitation-btn');

  function openInvitation(e) {
    const rect = openInvitationBtn ? openInvitationBtn.getBoundingClientRect() : null;
    const centerX = rect ? (rect.left + rect.width / 2) : (e && e.clientX ? e.clientX : window.innerWidth / 2);
    const centerY = rect ? (rect.top + rect.height * 0.52) : (e && e.clientY ? e.clientY : window.innerHeight / 2);

    if (typeof window.addStarBurst === 'function') {
      // Wave 1: Immediate wax-seal pop
      window.addStarBurst(centerX, centerY);
      window.addStarBurst(centerX, centerY);

      // Wave 2: Rising envelope sparkle
      window.setTimeout(() => {
        window.addStarBurst(centerX, centerY - 15);
        window.addStarBurst(centerX, centerY - 15);
      }, 150);

      // Wave 3: Grand burst as the envelope expands open
      window.setTimeout(() => {
        window.addStarBurst(centerX - 30, centerY - 25);
        window.addStarBurst(centerX + 30, centerY - 25);
        window.addStarBurst(centerX, centerY - 35);
      }, 360);
    }

    if (invitationGate && !invitationGate.classList.contains('is-opening')) {
      invitationGate.classList.add('is-opening');
      invitationGate.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => invitationGate.remove(), 750);
    }

    // Calling play() inside the button action satisfies mobile autoplay policy.
    if (bgAudio) {
      bgAudio.muted = false;
      bgAudio.play().then(() => updateMusicUI(true)).catch(() => updateMusicUI(false));
    }
  }

  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', openInvitation);
  }

  /* ==========================================================================
     4. Dynamic UI Image Cropping for Mobile (Zero Scroll, Phone Number 100% Protected)
     ========================================================================== */
  function adjustImageCropForMobile() {
    const img = document.getElementById('invitation-img');
    const frame = document.getElementById('card-frame');
    if (!img || !frame) return;

    if (window.innerWidth <= 768) {
      const winW = window.innerWidth;
      // Dùng window.innerHeight kết hợp documentElement.clientHeight
      const winH = window.innerHeight || document.documentElement.clientHeight;

      const naturalW = img.naturalWidth || 840;
      const naturalH = img.naturalHeight || 1871;

      // Chiều cao tự nhiên của ảnh khi bung chạm 2 mép màn hình 100vw
      const renderedTotalH = winW * (naturalH / naturalW);

      // Số hàng ảnh (rows) tương ứng với chiều cao màn hình hiện tại
      const visibleRows = winH * (naturalW / winW);
      const excessRows = Math.max(0, naturalH - visibleRows);

      // Cắt bỏ phần giấy trắng thừa ở đáy trước (từ row 1871 xuống tối đa row 1690)
      // Row 1655 là đáy chữ "Contact: 0384574324", giữ đến row 1690 để có khoảng đệm ~16px an toàn dưới số điện thoại
      const maxBottomCrop = 1871 - 1690; // 181 rows giấy trắng thừa ở đáy
      const bottomCropRows = Math.max(0, Math.min(excessRows, maxBottomCrop));
      const remainingExcess = excessRows - bottomCropRows;

      // Nếu vẫn còn dài hơn màn hình, cắt tiếp phần chóp đèn disco ở đỉnh (tối đa đến row 190)
      // Chữ "Thank you for being a part of my youth..." bắt đầu ở row 240 -> row 190 cách chữ 50px cực kỳ an toàn
      const maxTopCrop = 190;
      const topCropRows = Math.max(0, Math.min(remainingExcess, maxTopCrop));

      const topCut = topCropRows;
      const bottomCut = naturalH - bottomCropRows;

      // Tính chiều cao khung chứa và độ dịch chuyển đỉnh ảnh
      const frameH = (bottomCut - topCut) * (winW / naturalW);
      const topCropPx = topCut * (winW / naturalW);

      // Thiết lập khung chứa tràn viền 100vw
      frame.style.setProperty('width', '100vw', 'important');
      frame.style.setProperty('min-width', '100vw', 'important');
      frame.style.setProperty('max-width', '100vw', 'important');
      frame.style.setProperty('height', `${frameH.toFixed(1)}px`, 'important');
      frame.style.setProperty('min-height', 'auto', 'important');
      frame.style.setProperty('max-height', 'none', 'important');
      frame.style.setProperty('overflow', 'hidden', 'important');
      frame.style.setProperty('position', 'relative', 'important');
      frame.style.setProperty('margin', '0', 'important');
      frame.style.setProperty('padding', '0', 'important');
      frame.style.setProperty('background', 'transparent', 'important');

      // Định vị ảnh bên trong khung: dịch lên trên đúng topCropPx, mép dưới vừa khít bottomCut (row 1690)
      img.style.setProperty('position', 'absolute', 'important');
      img.style.setProperty('left', '0', 'important');
      img.style.setProperty('right', '0', 'important');
      img.style.setProperty('top', `-${topCropPx.toFixed(1)}px`, 'important');
      img.style.setProperty('width', '100vw', 'important');
      img.style.setProperty('min-width', '100vw', 'important');
      img.style.setProperty('max-width', '100vw', 'important');
      img.style.setProperty('height', `${renderedTotalH.toFixed(1)}px`, 'important');
      img.style.setProperty('max-height', 'none', 'important');
      img.style.setProperty('object-fit', 'fill', 'important');
      img.style.setProperty('margin', '0', 'important');
      img.style.setProperty('padding', '0', 'important');
    } else {
      // Desktop: Reset về trạng thái khung mockup ban đầu
      frame.style.removeProperty('width');
      frame.style.removeProperty('min-width');
      frame.style.removeProperty('max-width');
      frame.style.removeProperty('height');
      frame.style.removeProperty('min-height');
      frame.style.removeProperty('max-height');
      frame.style.removeProperty('overflow');
      frame.style.removeProperty('position');
      frame.style.removeProperty('margin');
      frame.style.removeProperty('padding');
      frame.style.removeProperty('background');

      img.style.removeProperty('position');
      img.style.removeProperty('left');
      img.style.removeProperty('right');
      img.style.removeProperty('top');
      img.style.removeProperty('width');
      img.style.removeProperty('min-width');
      img.style.removeProperty('max-width');
      img.style.removeProperty('height');
      img.style.removeProperty('max-height');
      img.style.removeProperty('margin');
      img.style.removeProperty('padding');
      img.style.removeProperty('object-fit');
      img.style.removeProperty('object-position');
    }
  }

  // Kích hoạt khi ảnh tải xong hoặc thay đổi kích thước/xoay màn hình
  const targetImg = document.getElementById('invitation-img');
  if (targetImg) {
    if (targetImg.complete) {
      adjustImageCropForMobile();
    } else {
      targetImg.addEventListener('load', adjustImageCropForMobile);
    }
  }
  window.addEventListener('resize', adjustImageCropForMobile);
  window.addEventListener('orientationchange', () => {
    setTimeout(adjustImageCropForMobile, 120);
  });
  document.addEventListener('DOMContentLoaded', adjustImageCropForMobile);
  window.addEventListener('load', adjustImageCropForMobile);

})();
