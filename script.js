/* ============================================================
   MARK: Global Setup
   - Shared helpers and media queries
   ============================================================ */
const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)"
).matches;

/* ============================================================
   MARK: Sticky Navbar Shadow
   Reason:
   - Add subtle shadow when user scrolls down.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const nav = document.querySelector(".topbar");
	if (!nav) return;

	window.addEventListener(
		"scroll",
		() => {
			if (window.scrollY > 8) {
				nav.classList.add("nav-shadow");
			} else {
				nav.classList.remove("nav-shadow");
			}
		},
		{ passive: true }
	);
});

/* ============================================================
   MARK: Fade-on-scroll Animation
   Reason:
   - Reusable fade-in for elements with .fade-on-scroll
   - Uses IntersectionObserver and respects reduced motion
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const elements = document.querySelectorAll(".fade-on-scroll");
	if (!elements.length) return;

	if (prefersReducedMotion || !("IntersectionObserver" in window)) {
		elements.forEach((el) => el.classList.add("show"));
		return;
	}

	const io = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add("show");
				obs.unobserve(entry.target);
			});
		},
		{ threshold: 0.14 }
	);

	elements.forEach((el) => io.observe(el));
});

/* ============================================================
   MARK: About Section Reveal
   Reason:
   - Staggered reveal for #about .reveal-about cards
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const items = document.querySelectorAll("#about .reveal-about");
	if (!items.length) return;

	if (prefersReducedMotion || !("IntersectionObserver" in window)) {
		items.forEach((el) => el.classList.add("show"));
		return;
	}

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add("show");
				io.unobserve(entry.target);
			});
		},
		{ threshold: 0.12 }
	);

	items.forEach((el, index) => {
		el.style.transitionDelay = `${index * 150}ms`;
		io.observe(el);
	});
});

/* ============================================================
   MARK: Results KPI Counters
   Reason:
   - Animate numbers in "Results That Matter" section
   - Uses .kpi-number[data-target][data-suffix]
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const counters = document.querySelectorAll("#results .kpi-number");
	if (!counters.length) return;

	function animateCount(el) {
		const target = Number(el.dataset.target || 0);
		const suffix = el.dataset.suffix || "";

		if (prefersReducedMotion) {
			el.textContent = `${target}${suffix}`;
			return;
		}

		const duration = 1200;
		const startTime = performance.now();

		function tick(now) {
			const progress = Math.min(1, (now - startTime) / duration);
			const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
			const value = Math.round(target * eased);
			el.textContent = `${value}${suffix}`;
			if (progress < 1) requestAnimationFrame(tick);
		}

		requestAnimationFrame(tick);
	}

	if (!("IntersectionObserver" in window)) {
		counters.forEach(animateCount);
		return;
	}

	const io = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				if (entry.target.classList.contains("kpi-number")) {
					animateCount(entry.target);
					obs.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.18 }
	);

	counters.forEach((counter) => io.observe(counter));
});

/* ============================================================
   MARK: Commitment Section Stagger
   Reason:
   - Slight delay between elements in #commitment
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const els = document.querySelectorAll("#commitment .fade-on-scroll");
	if (!els.length) return;

	if (prefersReducedMotion) {
		els.forEach((el) => el.classList.add("show"));
		return;
	}

	let delay = 0;
	els.forEach((el) => {
		delay += 120;
		el.style.transitionDelay = `${delay}ms`;
	});
});

/* ============================================================
   MARK: Smooth Scroll for In-page Links
   Reason:
   - Handle #hash navigation with smooth scroll
   - Collapse mobile nav if open (works together with nav fix)
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const links = document.querySelectorAll('a[href^="#"]');
	if (!links.length) return;

	links.forEach((link) => {
		link.addEventListener("click", (event) => {
			const id = link.getAttribute("href");
			if (!id || id === "#") return;

			const target = document.querySelector(id);
			if (!target) return;

			event.preventDefault();
			target.scrollIntoView({
				behavior: prefersReducedMotion ? "auto" : "smooth",
				block: "start",
			});
		});
	});

	// If page loads with hash, align to section nicely
	if (location.hash) {
		const target = document.querySelector(location.hash);
		if (target) {
			setTimeout(() => {
				target.scrollIntoView({
					behavior: prefersReducedMotion ? "auto" : "smooth",
					block: "start",
				});
			}, 0);
		}
	}
});

/* ============================================================
   MARK: Dynamic Footer Year
   Reason:
   - Always show current year in footer copyright
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const yearEl = document.getElementById("year");
	if (!yearEl) return;
	yearEl.textContent = new Date().getFullYear();
});

/* ============================================================
   MARK: Contact Dock Hint
   Reason:
   - Show small hint above dock once per session when #contact is visible.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const contact = document.querySelector("#contact");
	const hint = document.querySelector(".dock-hint");
	if (!contact || !hint) return;

	const KEY = "knm_dock_hint_shown";
	if (sessionStorage.getItem(KEY) === "1") return;

	if (!("IntersectionObserver" in window)) return;

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;

				hint.classList.add("is-visible");
				const duration = prefersReducedMotion ? 1500 : 2600;

				setTimeout(() => {
					hint.classList.remove("is-visible");
				}, duration);

				sessionStorage.setItem(KEY, "1");
				io.unobserve(contact);
			});
		},
		{ threshold: 0.35 }
	);

	io.observe(contact);
});

/* ============================================================
   MARK: Mobile Navbar Fix
   Reason:
   - Bootstrap menu opens but does NOT close on mobile.
   - This script:
       1) Closes menu on menu-item click.
       2) Closes menu when user starts scrolling.
       3) Keeps smooth scroll behavior.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
	const navMain = document.getElementById("navMain");
	const navLinks = document.querySelectorAll('#navMain .nav-link[href^="#"]');

	// Safety check: menu or Bootstrap missing
	if (!navMain || !navLinks.length || !window.bootstrap) return;

	/* MARK: Helper — Close mobile navbar */
	function closeMobileNav() {
		// Only for mobile widths
		if (window.innerWidth >= 992) return;
		if (!navMain.classList.contains("show")) return;

		let collapse = bootstrap.Collapse.getInstance(navMain);
		if (!collapse) {
			collapse = new bootstrap.Collapse(navMain, { toggle: false });
		}
		collapse.hide();
	}

	/* MARK: Close navbar when clicking menu items */
	navLinks.forEach((link) => {
		link.addEventListener("click", function (event) {
			const targetId = this.getAttribute("href");
			const targetEl = document.querySelector(targetId);

			// Custom smooth scroll to avoid double-handling
			if (targetEl) {
				event.preventDefault();
				targetEl.scrollIntoView({
					behavior: prefersReducedMotion ? "auto" : "smooth",
					block: "start",
				});
			}

			closeMobileNav();
		});
	});

	/* MARK: Auto-close navbar when user scrolls */
	let lastScrollY = window.scrollY;

	window.addEventListener(
		"scroll",
		() => {
			const currentY = window.scrollY;

			if (Math.abs(currentY - lastScrollY) > 10) {
				closeMobileNav();
			}

			lastScrollY = currentY;
		},
		{ passive: true }
	);
});
