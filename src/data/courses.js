export const courses = [
  {
    id: 'react-basics',
    title: 'React pentru Începători',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Învață fundamentele React și construiește primele tale componente.',
    description:
      'Acest curs acoperă JSX, componente, props, state, hooks și bune practici pentru a începe rapid cu React. Vei învăța să construiești aplicații interactive și moderne folosind cea mai populară bibliotecă JavaScript.',
    lessonsCount: 32,
    durationHours: 8,
    level: 'Începător',
    instructor: 'Alexandru Popescu',
    instructorBio: 'Senior Frontend Developer cu 8+ ani experiență în React, Vue.js și Angular. A lucrat pentru companii precum Microsoft și Google.',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    rating: 4.8,
    studentsCount: 1247,
    language: 'Română',
    lastUpdated: '2024-01-15',
    requirements: [
      'Cunoștințe de bază în JavaScript',
      'HTML și CSS de bază',
      'Node.js instalat pe computer',
      'Editor de cod (VS Code recomandat)'
    ],
    objectives: [
      'Înțelegerea conceptelor fundamentale React',
      'Construirea primelor componente React',
      'Gestionarea stării cu useState și useEffect',
      'Implementarea routing-ului cu React Router',
      'Deploy-ul unei aplicații React'
    ],
    curriculum: [
      {
        section: 'Introducere în React',
        lessons: [
          'Ce este React și de ce să-l folosești',
          'Configurarea mediului de dezvoltare',
          'Primul component React',
          'JSX - sintaxa React'
        ]
      },
      {
        section: 'Componente și Props',
        lessons: [
          'Crearea și folosirea componentelor',
          'Props - transmiterea datelor',
          'Componente funcționale vs clase',
          'Compoziția componentelor'
        ]
      },
      {
        section: 'State și Hooks',
        lessons: [
          'useState Hook',
          'useEffect Hook',
          'useContext Hook',
          'Custom Hooks'
        ]
      },
      {
        section: 'Proiect Final',
        lessons: [
          'Planificarea aplicației',
          'Implementarea funcționalităților',
          'Testarea și debugging',
          'Deploy și prezentare'
        ]
      }
    ],
    whatYouGet: [
      '32 de lecții video HD',
      'Cod sursă pentru toate proiectele',
      'Acces la comunitatea Discord',
      'Certificat de finalizare',
      'Suport direct de la instructor',
      'Actualizări gratuite la curs'
    ]
  },
  {
    id: 'advanced-react',
    title: 'React Avansat și Patterns',
    price: 89.0,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Context, Reducers, performanță și arhitectura componentelor.',
    description:
      'Intră în detalii despre optimizare, context, reduceri, memoization, code-splitting și arhitectura scalabilă. Acest curs te va ajuta să construiești aplicații React enterprise-grade cu performanță optimă.',
    lessonsCount: 45,
    durationHours: 12,
    level: 'Intermediar',
    instructor: 'Maria Ionescu',
    instructorBio: 'Lead Frontend Architect cu 10+ ani experiență. Specialist în React, TypeScript și arhitectura aplicațiilor scalabile.',
    instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop',
    rating: 4.9,
    studentsCount: 892,
    language: 'Română',
    lastUpdated: '2024-01-20',
    requirements: [
      'Cunoștințe solide în React de bază',
      'Experiență cu JavaScript ES6+',
      'Înțelegerea conceptelor de state management',
      'Cunoștințe de bază în TypeScript (opțional)'
    ],
    objectives: [
      'Masterizarea React Context și Reducers',
      'Optimizarea performanței aplicațiilor',
      'Implementarea design patterns avansate',
      'Arhitectura aplicațiilor scalabile',
      'Testing și debugging avansat'
    ],
    curriculum: [
      {
        section: 'State Management Avansat',
        lessons: [
          'React Context API profund',
          'useReducer și state complex',
          'State management patterns',
          'Zustand și Redux Toolkit'
        ]
      },
      {
        section: 'Performanță și Optimizare',
        lessons: [
          'React.memo și useMemo',
          'useCallback și optimizări',
          'Code splitting și lazy loading',
          'Bundle optimization'
        ]
      },
      {
        section: 'Design Patterns',
        lessons: [
          'Render Props pattern',
          'Higher-Order Components',
          'Compound Components',
          'Custom Hooks patterns'
        ]
      },
      {
        section: 'Arhitectură Enterprise',
        lessons: [
          'Folder structure și organizare',
          'Error boundaries și error handling',
          'Testing strategies',
          'Deployment și CI/CD'
        ]
      }
    ],
    whatYouGet: [
      '45 de lecții video HD',
      'Proiecte practice complexe',
      'Cod sursă complet documentat',
      'Acces la comunitatea premium',
      'Certificat de specializare',
      'Suport 1-on-1 cu instructorul'
    ]
  },
  {
    id: 'fullstack-js',
    title: 'Full‑Stack JavaScript',
    price: 129.0,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'De la frontend la backend cu Node și React.',
    description:
      'Construiește un proiect cap‑coadă: API REST cu Node/Express, client React, autentificare și deploy. Învață să construiești aplicații web complete folosind doar JavaScript.',
    lessonsCount: 60,
    durationHours: 18,
    level: 'Avansat',
    instructor: 'Cristian Dumitrescu',
    instructorBio: 'Full-Stack Developer cu 12+ ani experiență. A dezvoltat aplicații pentru startup-uri și corporații mari.',
    instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    rating: 4.7,
    studentsCount: 1156,
    language: 'Română',
    lastUpdated: '2024-01-18',
    requirements: [
      'Cunoștințe solide în JavaScript',
      'Experiență cu React de bază',
      'Cunoștințe de bază în HTML/CSS',
      'Git și GitHub de bază'
    ],
    objectives: [
      'Construirea unui backend complet cu Node.js',
      'Crearea API-uri REST scalabile',
      'Implementarea autentificării și autorizării',
      'Deploy-ul aplicațiilor pe cloud',
      'Integrarea frontend cu backend'
    ],
    curriculum: [
      {
        section: 'Backend cu Node.js',
        lessons: [
          'Configurarea mediului Node.js',
          'Express.js și routing',
          'Middleware și error handling',
          'Conectarea la baza de date'
        ]
      },
      {
        section: 'API Development',
        lessons: [
          'Design RESTful APIs',
          'Validarea datelor cu Joi',
          'Autentificare JWT',
          'Rate limiting și security'
        ]
      },
      {
        section: 'Frontend Integration',
        lessons: [
          'Axios și API calls',
          'State management cu Context',
          'Protected routes',
          'Error handling în frontend'
        ]
      },
      {
        section: 'Deployment și DevOps',
        lessons: [
          'Docker și containerizare',
          'Deploy pe AWS/DigitalOcean',
          'CI/CD cu GitHub Actions',
          'Monitoring și logging'
        ]
      }
    ],
    whatYouGet: [
      '60 de lecții video HD',
      'Proiect complet full-stack',
      'Cod sursă și documentație',
      'Acces la comunitatea Discord',
      'Certificat de finalizare',
      'Suport direct de la instructor'
    ]
  },
  {
    id: 'python-fundamentals',
    title: 'Python pentru Începători',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Învață Python de la zero și construiește primele tale aplicații.',
    description:
      'Curs complet de Python care acoperă sintaxa de bază, structuri de date, funcții, clase și programare orientată pe obiecte. Perfect pentru începători care vor să învețe unul dintre cele mai populare limbaje de programare.',
    lessonsCount: 28,
    durationHours: 10,
    level: 'Începător',
    instructor: 'Ana Popescu',
    instructorBio: 'Software Engineer cu 6+ ani experiență în Python, Django și Data Science. Passionată de educație și mentoring.',
    instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    rating: 4.6,
    studentsCount: 2156,
    language: 'Română',
    lastUpdated: '2024-01-12',
    requirements: [
      'Nu sunt necesare cunoștințe anterioare',
      'Computer cu Python instalat',
      'Editor de cod (PyCharm sau VS Code)',
      'Motivație și timp pentru practică'
    ],
    objectives: [
      'Înțelegerea sintaxei Python',
      'Lucrul cu structuri de date',
      'Crearea funcțiilor și claselor',
      'Programare orientată pe obiecte',
      'Construirea primelor aplicații'
    ],
    curriculum: [
      {
        section: 'Fundamentele Python',
        lessons: [
          'Instalarea și configurarea Python',
          'Variabile și tipuri de date',
          'Operatori și expresii',
          'Structuri de control'
        ]
      },
      {
        section: 'Structuri de Date',
        lessons: [
          'Liste și tupluri',
          'Dicționare și seturi',
          'String manipulation',
          'List comprehensions'
        ]
      },
      {
        section: 'Funcții și Clase',
        lessons: [
          'Definirea și apelarea funcțiilor',
          'Parametri și return values',
          'Clase și obiecte',
          'Inheritance și polymorphism'
        ]
      },
      {
        section: 'Proiecte Practice',
        lessons: [
          'Calculator simplu',
          'Sistem de gestionare contacte',
          'Joc de ghicit numere',
          'Aplicație de note'
        ]
      }
    ],
    whatYouGet: [
      '28 de lecții video HD',
      'Exerciții practice pentru fiecare lecție',
      'Cod sursă pentru toate proiectele',
      'Acces la comunitatea Discord',
      'Certificat de finalizare',
      'Suport direct de la instructor'
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Modern',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Design modern pentru interfețe utilizator și experiență utilizator.',
    description:
      'Învață principiile design-ului UI/UX, wireframing, prototyping, design systems și tools moderne precum Figma și Adobe XD. Curs complet pentru designeri care vor să creeze interfețe moderne și user-friendly.',
    lessonsCount: 35,
    durationHours: 14,
    level: 'Intermediar',
    instructor: 'Elena Vasilescu',
    instructorBio: 'Senior UI/UX Designer cu 8+ ani experiență. A lucrat pentru branduri precum Spotify, Airbnb și Netflix.',
    instructorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    rating: 4.8,
    studentsCount: 987,
    language: 'Română',
    lastUpdated: '2024-01-22',
    requirements: [
      'Cunoștințe de bază în design',
      'Acces la Figma (gratuit)',
      'Adobe Creative Suite (opțional)',
      'Creativitate și atenție la detalii'
    ],
    objectives: [
      'Înțelegerea principiilor UI/UX',
      'Crearea wireframes și prototipuri',
      'Design systems și component libraries',
      'User research și testing',
      'Handoff pentru dezvoltatori'
    ],
    curriculum: [
      {
        section: 'Fundamentele UI/UX',
        lessons: [
          'Diferența dintre UI și UX',
          'Design thinking process',
          'User personas și user journeys',
          'Information architecture'
        ]
      },
      {
        section: 'Design Tools și Workflow',
        lessons: [
          'Figma - introducere și setup',
          'Adobe XD vs Figma',
          'Design systems și libraries',
          'Collaboration și handoff'
        ]
      },
      {
        section: 'Visual Design',
        lessons: [
          'Typography și hierarchy',
          'Color theory și palettes',
          'Spacing și layout principles',
          'Icons și illustrations'
        ]
      },
      {
        section: 'Prototyping și Testing',
        lessons: [
          'Interactive prototypes',
          'User testing methods',
          'Iteration și feedback',
          'Final deliverables'
        ]
      }
    ],
    whatYouGet: [
      '35 de lecții video HD',
      'Design files și templates',
      'Acces la Figma community',
      'Portfolio review personalizat',
      'Certificat de finalizare',
      'Suport direct de la instructor'
    ]
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning cu Python',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Inteligenta artificială și algoritmi de învățare automată.',
    description:
      'Curs avansat de Machine Learning cu Python, TensorFlow, scikit-learn, deep learning și aplicații practice în AI.',
    lessonsCount: 52,
    durationHours: 20,
    level: 'Avansat',
    instructor: 'Dr. Mihai Constantinescu',
  },
  {
    id: 'devops-fundamentals',
    title: 'DevOps și CI/CD',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Automatizare, deployment și infrastructură cloud.',
    description:
      'Învață DevOps practices, Docker, Kubernetes, AWS, CI/CD pipelines și monitoring pentru aplicații moderne.',
    lessonsCount: 40,
    durationHours: 16,
    level: 'Intermediar',
    instructor: 'Radu Marinescu',
  },
  {
    id: 'mobile-react-native',
    title: 'React Native pentru Mobile',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Dezvoltare aplicații mobile cu React Native.',
    description:
      'Construiește aplicații mobile native pentru iOS și Android folosind React Native, Expo și tools moderne.',
    lessonsCount: 38,
    durationHours: 15,
    level: 'Intermediar',
    instructor: 'Andrei Popa',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Essentials',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Securitate informatică și protecția datelor.',
    description:
      'Învață principiile cybersecurity, ethical hacking, criptografie, securitatea aplicațiilor web și best practices.',
    lessonsCount: 44,
    durationHours: 18,
    level: 'Avansat',
    instructor: 'Prof. Ion Petrescu',
  },
  {
    id: 'data-science',
    title: 'Data Science cu Python',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Analiza datelor și statistică aplicată.',
    description:
      'Curs complet de Data Science cu Python, pandas, numpy, matplotlib, seaborn și machine learning pentru analiza datelor.',
    lessonsCount: 48,
    durationHours: 19,
    level: 'Intermediar',
    instructor: 'Dr. Carmen Ionescu',
  },
  {
    id: 'blockchain-web3',
    title: 'Blockchain și Web3 Development',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Dezvoltare aplicații blockchain și Web3 cu Solidity.',
    description:
      'Învață să construiești aplicații blockchain, smart contracts cu Solidity, DeFi protocols, NFT marketplace și integrare Web3 în aplicații web moderne.',
    lessonsCount: 55,
    durationHours: 22,
    level: 'Avansat',
    instructor: 'Alexandru Crypto',
  },
  {
    id: 'game-development-unity',
    title: 'Game Development cu Unity',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'Crearea jocurilor video cu Unity și C#.',
    description:
      'Curs complet de dezvoltare jocuri cu Unity, C# scripting, physics, animation, UI design, audio integration și publishing pentru multiple platforme.',
    lessonsCount: 42,
    durationHours: 17,
    level: 'Intermediar',
    instructor: 'Maria GameDev',
  },
];

export const getCourseById = (id) => courses.find((c) => c.id === id);



