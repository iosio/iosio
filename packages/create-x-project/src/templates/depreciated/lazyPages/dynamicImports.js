export const lazyMap = {
"about-page": () => import("./about-page.js"),
"index-page": () => import("./index-page.js"),
};

export const pathMap = {
	"/about": "about-page",
	"/": "index-page"
};