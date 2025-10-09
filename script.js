/* KNM Finance — minimal scripts
   - Fade-in on scroll (IO)
   - Smooth scroll for same-page anchors
   - Respect reduced motion
*/

(function () {
	const prefersReduced = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	// Fade-in on scroll
	const els = document.querySelectorAll(".fade-on-scroll");
	if (prefersReduced) {
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

	// Smooth scroll for internal links (#hash)
	const samePageLinks = document.querySelectorAll('a[href^="#"]');
	samePageLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			const id = link.getAttribute("href");
			if (id.length > 1) {
				const target = document.querySelector(id);
				if (target) {
					e.preventDefault();
					if (prefersReduced) {
						target.scrollIntoView({ block: "start" });
					} else {
						target.scrollIntoView({ behavior: "smooth", block: "start" });
					}
					// collapse Bootstrap navbar on mobile after click
					const navbar = document.getElementById("navMain");
					if (navbar && navbar.classList.contains("show")) {
						const collapse = new bootstrap.Collapse(navbar, { toggle: true });
					}
				}
			}
		});
	});
})();
