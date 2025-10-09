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
})();
