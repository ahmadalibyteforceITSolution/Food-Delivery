export const useSEO = (options = {}) => {
  const {
    title = 'Elysium Eats | Premium Food Delivery',
    description = 'Experience the finest culinary masterpieces delivered to your door. Order from Michelin-starred restaurants and local hidden gems.',
    image = 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200',
    url = window.location.href,
    type = 'website'
  } = options

  // Set Title immediately
  if (title) {
    document.title = title;
  }

  // Helper to manage meta tags
  const setMeta = (name, content, property = false) => {
    if (!content) return;
    const attr = property ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.content = content;
  };

  // Standard Meta
  setMeta('description', description);

  // Open Graph
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:image', image, true);
  setMeta('og:url', url, true);
  setMeta('og:type', type, true);

  // Twitter
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image);

  // Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;

  // For debugging/verification in dev tools
  // console.log(`SEO Updated: ${title}`);
};
