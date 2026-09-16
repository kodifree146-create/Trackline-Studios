/* =========================================================
   Trackline Studios | NSW Trains
   app.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const root = document.documentElement;
    const body = document.body;

    /* =====================================================
       Reduced Motion
       ===================================================== */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       Current Year
       ===================================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       Reveal Animations
       ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if (prefersReducedMotion) {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }


    /* =====================================================
       Progress Bar
       ===================================================== */

    const progressFill = document.querySelector(".progress-fill");

    if (progressFill) {
        const progress = Number(progressFill.dataset.progress) || 0;
        const safeProgress = Math.min(Math.max(progress, 0), 100);

        if (prefersReducedMotion) {
            progressFill.style.width = `${safeProgress}%`;
        } else {
            progressFill.style.width = "0%";

            const progressObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        requestAnimationFrame(() => {
                            progressFill.style.width = `${safeProgress}%`;
                        });

                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.4
                }
            );

            progressObserver.observe(progressFill);
        }
    }


    /* =====================================================
       Project Milestone Countdown
       ===================================================== */

    const countdown = document.querySelector("[data-countdown]");

    if (countdown) {
        const startTime = new Date(countdown.dataset.start).getTime();
        const targetTime = new Date(countdown.dataset.target).getTime();
        const daysElement = countdown.querySelector("[data-countdown-days]");
        const hoursElement = countdown.querySelector("[data-countdown-hours]");
        const minutesElement = countdown.querySelector("[data-countdown-minutes]");
        const secondsElement = countdown.querySelector("[data-countdown-seconds]");
        const fillElement = countdown.querySelector("[data-countdown-fill]");
        const percentElement = countdown.querySelector("[data-countdown-percent]");
        const statusElement = countdown.querySelector("[data-countdown-status]");
        const progressBar = countdown.querySelector('[role="progressbar"]');
        let timer;

        const updateCountdown = () => {
            const now = Date.now();
            const remaining = Math.max(targetTime - now, 0);
            const totalSeconds = Math.floor(remaining / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const elapsed = Math.min(Math.max(now - startTime, 0), targetTime - startTime);
            const progress = Math.min(Math.max((elapsed / (targetTime - startTime)) * 100, 0), 100);
            const padded = (value) => String(value).padStart(2, "0");

            daysElement.textContent = String(days).padStart(3, "0");
            hoursElement.textContent = padded(hours);
            minutesElement.textContent = padded(minutes);
            secondsElement.textContent = padded(seconds);
            fillElement.style.width = `${progress}%`;
            percentElement.textContent = `${Math.round(progress)}%`;
            progressBar.setAttribute("aria-valuenow", String(Math.round(progress)));

            if (remaining === 0) {
                statusElement.textContent = "MILESTONE REACHED";
                if (timer) {
                    clearInterval(timer);
                }
            }
        };

        updateCountdown();
        timer = setInterval(updateCountdown, 1000);
    }


    /* =====================================================
       Mobile Navigation
       ===================================================== */

    const mobileMenuButton = document.querySelector(".mobile-menu-button");
    const mobileNavigation = document.querySelector(".mobile-navigation");

    if (mobileMenuButton && mobileNavigation) {
        const closeMobileMenu = () => {
            mobileNavigation.classList.remove("open");
            mobileMenuButton.classList.remove("active");

            mobileMenuButton.setAttribute("aria-expanded", "false");
        };

        const toggleMobileMenu = () => {
            const isOpen = mobileNavigation.classList.toggle("open");

            mobileMenuButton.classList.toggle("active", isOpen);
            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        };

        mobileMenuButton.addEventListener("click", toggleMobileMenu);

        const mobileLinks = mobileNavigation.querySelectorAll("a");

        mobileLinks.forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });

        document.addEventListener("click", (event) => {
            if (!mobileNavigation.classList.contains("open")) {
                return;
            }

            const clickedInsideMenu =
                mobileNavigation.contains(event.target);

            const clickedButton =
                mobileMenuButton.contains(event.target);

            if (!clickedInsideMenu && !clickedButton) {
                closeMobileMenu();
            }
        });
    }


    /* =====================================================
       Smooth Anchor Navigation
       ===================================================== */

    const anchorLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });


    /* =====================================================
       Header Scroll State
       ===================================================== */

    const siteHeader = document.querySelector(".site-header");

    if (siteHeader) {
        const updateHeader = () => {
            if (window.scrollY > 30) {
                siteHeader.classList.add("scrolled");
            } else {
                siteHeader.classList.remove("scrolled");
            }
        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );
    }


    /* =====================================================
       Cursor Glow
       ===================================================== */

    const supportsHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const cursorGlow = document.querySelector(".cursor-glow");

    if (supportsHover && cursorGlow && !prefersReducedMotion) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let targetX = mouseX;
        let targetY = mouseY;

        window.addEventListener(
            "pointermove",
            (event) => {
                targetX = event.clientX;
                targetY = event.clientY;
            },
            { passive: true }
        );

        const animateCursor = () => {
            mouseX += (targetX - mouseX) * 0.12;
            mouseY += (targetY - mouseY) * 0.12;

            root.style.setProperty(
                "--mouse-x",
                `${mouseX}px`
            );

            root.style.setProperty(
                "--mouse-y",
                `${mouseY}px`
            );

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        cursorGlow.classList.add("active");
    }


    /* =====================================================
       Network Train Animation
       ===================================================== */

    const trains = document.querySelectorAll(".map-train");

    if (trains.length && !prefersReducedMotion) {
        trains.forEach((train, index) => {
            train.style.animationDelay = `${index * 1.8}s`;
        });
    }


    /* =====================================================
       Prevent Flash Before Page Is Ready
       ===================================================== */

    body.classList.add("app-ready");
});