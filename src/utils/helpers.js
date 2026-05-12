export const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000';
export const PLACEHOLDER_RESTAURANT = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000';

export const handleImageError = (event, type = 'dish') => {
  const target = event.target;
  target.src = type === 'restaurant' ? PLACEHOLDER_RESTAURANT : DEFAULT_IMAGE;
  target.onerror = null; // Prevent infinite loop if fallback image also fails
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};
