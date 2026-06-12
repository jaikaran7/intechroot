import { useEffect, useRef } from "react";
import ClientLogo from "./ClientLogo";
import {
  TRUSTED_CLIENTS,
  TRUSTED_CLIENTS_ROW_BOTTOM,
  TRUSTED_CLIENTS_ROW_TOP,
} from "../constants/trustedClients";

const SCROLL_FACTOR = 0.9;
const AUTO_PX_PER_MS = 0.04;
const SCROLL_IDLE_MS = 180;
const CLIENT_COUNT = TRUSTED_CLIENTS.length;

function wrapOffset(offset, loopWidth) {
  if (loopWidth <= 0) return offset;
  let wrapped = offset % loopWidth;
  if (wrapped > 0) wrapped -= loopWidth;
  return wrapped;
}

/** Half-loop + half-slot keeps reversed bottom row off by ½ step (never same name top/bottom). */
function getAntiAlignPhase(loopWidth) {
  if (loopWidth <= 0 || CLIENT_COUNT <= 0) return 0;
  const slotWidth = loopWidth / CLIENT_COUNT;
  return loopWidth / 2 + slotWidth / 2;
}

function MarqueeRow({ clients, trackRef }) {
  const loop = [...clients, ...clients];

  return (
    <div className="trusted-marquee-row overflow-hidden">
      <div ref={trackRef} className="trusted-marquee-track">
        {loop.map((client, index) => (
          <div key={`${client.id}-${index}`} className="trusted-marquee-item">
            <ClientLogo client={client} variant="dark" className="max-h-10 sm:max-h-12 w-auto max-w-[9rem] sm:max-w-[11rem]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrustedClientsMarquee({ className = "" }) {
  const sectionRef = useRef(null);
  const topTrackRef = useRef(null);
  const bottomTrackRef = useRef(null);
  const topOffsetRef = useRef(0);
  const topLoopWidthRef = useRef(0);
  const bottomLoopWidthRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const inViewRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const userScrollingRef = useRef(false);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let scrollIdleTimer = null;
    let rafId = null;
    let lastFrameTime = 0;

    const measureLoops = () => {
      if (topTrackRef.current) {
        topLoopWidthRef.current = topTrackRef.current.scrollWidth / 2;
      }
      if (bottomTrackRef.current) {
        bottomLoopWidthRef.current = bottomTrackRef.current.scrollWidth / 2;
      }
    };

    const getLoopWidth = () => topLoopWidthRef.current || bottomLoopWidthRef.current;

    const syncBottomToTop = () => {
      const loopWidth = getLoopWidth();
      const phase = getAntiAlignPhase(loopWidth);
      return -topOffsetRef.current - phase;
    };

    const applyTransforms = () => {
      if (reducedMotionRef.current) return;

      const loopWidth = getLoopWidth();
      const topX = wrapOffset(topOffsetRef.current, loopWidth);
      const bottomX = wrapOffset(syncBottomToTop(), bottomLoopWidthRef.current || loopWidth);

      if (topTrackRef.current) {
        topTrackRef.current.style.transform = `translate3d(${topX}px, 0, 0)`;
      }
      if (bottomTrackRef.current) {
        bottomTrackRef.current.style.transform = `translate3d(${bottomX}px, 0, 0)`;
      }
    };

    const markUserScrolling = () => {
      userScrollingRef.current = true;
      clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => {
        userScrollingRef.current = false;
      }, SCROLL_IDLE_MS);
    };

    measureLoops();
    applyTransforms();

    const resizeObserver = new ResizeObserver(() => {
      measureLoops();
      applyTransforms();
    });
    if (topTrackRef.current) resizeObserver.observe(topTrackRef.current);
    if (bottomTrackRef.current) resizeObserver.observe(bottomTrackRef.current);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0, rootMargin: "120px 0px" }
    );
    if (sectionRef.current) intersectionObserver.observe(sectionRef.current);

    const onScroll = () => {
      if (reducedMotionRef.current) return;

      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      if (delta !== 0) {
        markUserScrolling();
      }

      if (!inViewRef.current || delta === 0) return;

      topOffsetRef.current += delta * SCROLL_FACTOR;
      applyTransforms();
    };

    const autoTick = (time) => {
      if (inViewRef.current && !reducedMotionRef.current && !userScrollingRef.current) {
        const dt = lastFrameTime ? Math.min(time - lastFrameTime, 48) : 0;
        if (dt > 0) {
          topOffsetRef.current += dt * AUTO_PX_PER_MS;
          applyTransforms();
        }
      }
      lastFrameTime = time;
      rafId = requestAnimationFrame(autoTick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureLoops);
    rafId = requestAnimationFrame(autoTick);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event) => {
      reducedMotionRef.current = event.matches;
      if (event.matches) {
        if (topTrackRef.current) topTrackRef.current.style.transform = "";
        if (bottomTrackRef.current) bottomTrackRef.current.style.transform = "";
      } else {
        applyTransforms();
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureLoops);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      clearTimeout(scrollIdleTimer);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`trusted-marquee w-full opacity-60 hover:opacity-90 transition-opacity duration-700 ${className}`}
      aria-label="Trusted by leading enterprises"
    >
      <MarqueeRow clients={TRUSTED_CLIENTS_ROW_TOP} trackRef={topTrackRef} />
      <MarqueeRow clients={TRUSTED_CLIENTS_ROW_BOTTOM} trackRef={bottomTrackRef} />
    </div>
  );
}
