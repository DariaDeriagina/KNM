/* KNM Finance — minimal scripts (robust)
   - Sticky nav shadow
   - Fade-in on scroll (IO)
   - Smooth scroll (#hash) + collapse on mobile
   - Respect reduced motion
*/
(function () {
	const prefersReduced = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	// 1) Sticky nav shadow (safe if .topbar missing)
	const nav = document.querySelector(".topbar");
	if (nav) {
		window.addEventListener(
			"scroll",
			() => {
				if (window.scrollY > 8) nav.classList.add("nav-shadow");
				else nav.classList.remove("nav-shadow");
			},
			{ passive: true }
		);
	}

	// 2) Fade-in on scroll
	const els = document.querySelectorAll(".fade-on-scroll");
	if (prefersReduced || !("IntersectionObserver" in window)) {
		els.forEach((el) => el.classList.add("show"));
	} else {
		const io = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("show");
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.14 }
		);
		els.forEach((el) => io.observe(el));
	}

	// 3) Smooth scroll for internal links (#hash) + collapse mobile nav
	const samePageLinks = document.querySelectorAll('a[href^="#"]');
	samePageLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			const id = link.getAttribute("href");
			if (!id || id === "#") return;
			const target = document.querySelector(id);
			if (!target) return;
			e.preventDefault();
			target.scrollIntoView({
				behavior: prefersReduced ? "auto" : "smooth",
				block: "start",
			});

			// Collapse Bootstrap navbar on mobile if open
			const navbar = document.getElementById("navMain");
			if (
				navbar &&
				navbar.classList.contains("show") &&
				window.bootstrap?.Collapse
			) {
				new bootstrap.Collapse(navbar, { toggle: true });
			}
		});
	});

	// 4) Optional: if page loads with a hash, scroll to it nicely
	if (location.hash) {
		const target = document.querySelector(location.hash);
		if (target) {
			setTimeout(() => {
				target.scrollIntoView({
					behavior: prefersReduced ? "auto" : "smooth",
					block: "start",
				});
			}, 0);
		}
	}

	// Smooth fade-in for About section
	(() => {
		const items = document.querySelectorAll("#about .reveal-about");
		if (!items.length) return;

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;
		if (reduceMotion) {
			items.forEach((el) => el.classList.add("show"));
			return;
		}

		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("show");
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12 }
		);

		items.forEach((el, i) => {
			el.style.transitionDelay = `${i * 150}ms`;
			io.observe(el);
		});
	})();
})();
/* ================================
   MARK: RESULTS THAT MATTER — KPI Counter Animation
   ================================ */

(function () {
	const counters = document.querySelectorAll("#results .kpi-number");
	if (!counters.length) return;

	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	function animateCount(el) {
		const target = Number(el.dataset.target || 0);
		const suffix = el.dataset.suffix || "";
		if (reduce) {
			el.textContent = target + suffix;
			return;
		}

		const duration = 1200; // ms
		const start = 0;
		const startTime = performance.now();

		function tick(now) {
			const progress = Math.min(1, (now - startTime) / duration);
			const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
			const value = Math.round(start + (target - start) * eased);
			el.textContent = value + suffix;
			if (progress < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	// IntersectionObserver for fade-in + count-up
	const observed = document.querySelectorAll(
		"#results .fade-on-scroll, #results .kpi-number"
	);
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				if (entry.target.classList.contains("fade-on-scroll")) {
					entry.target.classList.add("show");
				}
				if (entry.target.classList.contains("kpi-number")) {
					animateCount(entry.target);
					io.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.18 }
	);

	// Add small stagger between fade-ins
	let delay = 0;
	document.querySelectorAll("#results .fade-on-scroll").forEach((el) => {
		el.style.transitionDelay = delay + "ms";
		delay += 90;
		io.observe(el);
	});

	counters.forEach((counter) => io.observe(counter));
})();

/* ================================
   MARK: Fade on Scroll Animation
   ================================ */
const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)"
).matches;
const fadeElements = document.querySelectorAll(".fade-on-scroll");

if (prefersReducedMotion) {
	fadeElements.forEach((el) => el.classList.add("show"));
} else {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("show");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.14 }
	);

	fadeElements.forEach((el) => observer.observe(el));
}

/* ================================
   MARK: Animated Counters (Results Section)
   ================================ */
const counters = document.querySelectorAll(".kpi-number");
let counterTriggered = false;

function animateCounters() {
	if (counterTriggered) return;
	const resultsSection = document.querySelector(".section-results");
	const sectionPosition = resultsSection.getBoundingClientRect().top;
	const screenPosition = window.innerHeight / 1.2;

	if (sectionPosition < screenPosition) {
		counterTriggered = true;

		counters.forEach((counter) => {
			const target = parseFloat(counter.getAttribute("data-target"));
			const suffix = counter.getAttribute("data-suffix") || "%";
			let start = 0;
			const increment = target / 100;
			const duration = 1200; // total animation time (ms)
			const stepTime = duration / (target / increment);

			const timer = setInterval(() => {
				start += increment;
				if (start >= target) {
					start = target;
					clearInterval(timer);
				}
				counter.textContent = `${Math.round(start)}${suffix}`;
			}, stepTime);
		});
	}
}

window.addEventListener("scroll", animateCounters);

/* ================================
   MARK: Subtle Stagger for Commitment Section
   ================================ */
(() => {
	const els = document.querySelectorAll("#commitment .fade-on-scroll");
	if (!els.length) return;
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reduce) {
		els.forEach((e) => e.classList.add("show"));
		return;
	}
	let delay = 0;
	els.forEach((e) => {
		e.style.transitionDelay = `${(delay += 120)}ms`;
	});
})();
// MARK: Footer Dynamic Year
document.getElementById("year").textContent = new Date().getFullYear();
/* ================================
   MARK: CONTACT — Show bouncing dock hint once
   ================================ */
(function () {
	const contact = document.querySelector("#contact");
	const hint = document.querySelector(".dock-hint");
	if (!contact || !hint) return;

	// Only show once per session
	const KEY = "knm_dock_hint_shown";
	if (sessionStorage.getItem(KEY) === "1") return;

	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (!e.isIntersecting) return;

				// Reveal hint
				hint.classList.add("is-visible");
				// Auto-hide after a short time
				const DURATION = reduce ? 1500 : 2600;
				setTimeout(() => hint.classList.remove("is-visible"), DURATION);

				// Remember for this session
				sessionStorage.setItem(KEY, "1");
				io.unobserve(contact);
			});
		},
		{ threshold: 0.35 }
	);

	io.observe(contact);
})();
