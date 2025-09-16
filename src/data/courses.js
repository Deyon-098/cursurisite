export const courses = [
  {
    id: 'react-basics',
    title: 'React pentru Incepatori',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Invata fundamentele React si construieste primele tale componente.',
    description:
      'Acest curs acopera JSX, componente, props, state, hooks si bune practici pentru a incepe rapid cu React.',
    lessonsCount: 32,
    durationHours: 8,
    level: 'Incepator',
  },
  {
    id: 'advanced-react',
    title: 'React Avansat si Patterns',
    price: 89.0,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Context, Reducers, performanta si arhitectura componentelor.',
    description:
      'Intra in detalii despre optimizare, context, reduceri, memoization, code-splitting si arhitectura scalabila.',
    lessonsCount: 45,
    durationHours: 12,
    level: 'Intermediar',
  },
  {
    id: 'fullstack-js',
    title: 'Full‑Stack JavaScript',
    price: 129.0,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'De la frontend la backend cu Node si React.',
    description:
      'Construieste un proiect cap‑coada: API REST cu Node/Express, client React, autentificare si deploy.',
    lessonsCount: 60,
    durationHours: 18,
    level: 'Avansat',
  },
];

export const getCourseById = (id) => courses.find((c) => c.id === id);



