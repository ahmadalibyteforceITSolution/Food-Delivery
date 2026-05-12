import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
  state: () => {
    const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    return {
      blogs: Array.from({ length: 100 }, (_, i) => {
        const title = `The Ultimate Guide to ${['Sushi', 'Pasta', 'Steak', 'Burgers', 'Vegan Food', 'Desserts'][i % 6]} in 2024`;
        return {
          id: i + 1,
          slug: `${generateSlug(title)}-${i + 1}`,
          title,
          excerpt: 'Discover the best secrets and hidden gems in the world of fine dining. From traditional recipes to modern twists, we cover it all in this comprehensive guide.',
          content: `
            <p>This is the full content for blog post ${i + 1}.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Donec vehicula cursus purus. Mauris ut tellus. Sed sodeales lorem ac urna. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
          `,
          author: ['Chef Marco', 'Gordon R.', 'Julia C.', 'Anthony B.', 'Jamie O.'][i % 5],
          date: new Date(Date.now() - (i * 86400000)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          image: `https://images.unsplash.com/photo-${[
            '1504674900247-0877df9cc836',
            '1473093226795-af9932fe5856',
            '1493770348161-369560ae357d',
            '1517248135467-4c7edcad34c4',
            '1498837167922-ddd27525d352',
            '1504754524776-8f4f37790ca0'
          ][i % 6]}?auto=format&fit=crop&q=80&w=800`,
          category: ['Cuisine', 'Lifestyle', 'Recipes', 'Reviews'][i % 4],
          readTime: `${Math.floor(Math.random() * 10) + 5} min read`
        };
      })
    };
  },
  getters: {
    getBlogBySlug: (state) => (slug) => state.blogs.find(b => b.slug === slug),
    latestBlogs: (state) => state.blogs.slice(0, 6)
  }
})
