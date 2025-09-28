// Script pentru verificarea și popularea cursurilor în Firebase
import { waitForFirebase } from '../firebase/config';
import { getAllCourses } from '../firebase/firestore';

// Cursuri demo pentru popularea bazei de date
const demoCourses = [
  {
    title: "React Complete - De la Zero la Expert",
    shortDescription: "Învață React de la bază până la nivel avansat cu proiecte reale",
    description: "Un curs complet de React care te va învăța tot ce trebuie să știi despre această bibliotecă populară. Vei învăța componente, hooks, state management, routing și multe altele prin proiecte practice.",
    instructor: "Alexandru Popescu",
    price: 299,
    duration: 45,
    level: "intermediate",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
    category: "react",
    rating: 4.8,
    students: 1250,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "40+ ore de conținut video",
      "10 proiecte practice",
      "Suport 24/7",
      "Certificat de completare",
      "Acces pe viață"
    ],
    curriculum: [
      "Introducere în React",
      "Componente și Props",
      "State și Lifecycle",
      "Hooks în React",
      "Context API",
      "React Router",
      "State Management cu Redux",
      "Testing în React",
      "Deployment și Optimizare"
    ]
  },
  {
    title: "Python pentru Data Science",
    shortDescription: "Dezvoltă abilități în analiza datelor cu Python și bibliotecile sale",
    description: "Învață cum să folosești Python pentru analiza datelor, machine learning și vizualizare. Cursul acoperă pandas, numpy, matplotlib, seaborn și scikit-learn.",
    instructor: "Maria Ionescu",
    price: 399,
    duration: 60,
    level: "beginner",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500",
    category: "python",
    rating: 4.9,
    students: 2100,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "60+ ore de conținut",
      "15 proiecte practice",
      "Datasets reale",
      "Suport comunitate",
      "Certificat recunoscut"
    ],
    curriculum: [
      "Fundamentele Python",
      "Pandas pentru manipularea datelor",
      "NumPy pentru calculul numeric",
      "Matplotlib și Seaborn",
      "Scikit-learn pentru ML",
      "Proiecte practice"
    ]
  },
  {
    title: "UI/UX Design cu Figma",
    shortDescription: "Creează interfețe moderne și intuitive cu Figma",
    description: "Învață principiile designului UI/UX și cum să le aplici în Figma. De la wireframe la prototip interactiv, vei învăța tot procesul de design.",
    instructor: "Andrei Dumitrescu",
    price: 249,
    duration: 35,
    level: "beginner",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=500",
    category: "design",
    rating: 4.7,
    students: 980,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "35+ ore de conținut",
      "8 proiecte practice",
      "Templates premium",
      "Feedback personalizat",
      "Portfolio ready"
    ],
    curriculum: [
      "Principiile UI/UX",
      "Figma basics",
      "Design systems",
      "Prototipare",
      "User research",
      "Portfolio building"
    ]
  },
  {
    title: "Mobile Development cu React Native",
    shortDescription: "Dezvoltă aplicații mobile cross-platform cu React Native",
    description: "Învață să creezi aplicații mobile pentru iOS și Android folosind React Native. De la setup la deployment, vei învăța tot procesul de dezvoltare mobile.",
    instructor: "Cristina Radu",
    price: 449,
    duration: 50,
    level: "intermediate",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
    category: "mobile",
    rating: 4.6,
    students: 750,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "50+ ore de conținut",
      "12 aplicații practice",
      "Deployment pe App Store",
      "Suport tehnic",
      "Comunitate activă"
    ],
    curriculum: [
      "React Native fundamentals",
      "Navigation",
      "State management",
      "APIs și networking",
      "Native modules",
      "Testing și debugging"
    ]
  },
  {
    title: "DevOps cu Docker și Kubernetes",
    shortDescription: "Automatizează deployment-ul aplicațiilor cu Docker și Kubernetes",
    description: "Învață cum să containerizezi aplicațiile cu Docker și să le orchestrezi cu Kubernetes. De la development la production, vei învăța tot procesul DevOps.",
    instructor: "Mihai Stoica",
    price: 599,
    duration: 70,
    level: "advanced",
    image: "https://images.unsplash.com/photo-1667372393120-0e1a70d5b0c3?w=500",
    category: "devops",
    rating: 4.9,
    students: 650,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "70+ ore de conținut",
      "15 proiecte practice",
      "Infrastructure as Code",
      "CI/CD pipelines",
      "Certificare Docker"
    ],
    curriculum: [
      "Docker fundamentals",
      "Container orchestration",
      "Kubernetes basics",
      "CI/CD cu Jenkins",
      "Monitoring și logging",
      "Security best practices"
    ]
  },
  {
    title: "Cybersecurity Fundamentals",
    shortDescription: "Învață principiile securității cibernetice și cum să protejezi sistemele",
    description: "Un curs complet de cybersecurity care te va învăța cum să identifici vulnerabilități, să implementezi măsuri de securitate și să răspunzi la incidente de securitate.",
    instructor: "Radu Popescu",
    price: 699,
    duration: 80,
    level: "intermediate",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500",
    category: "security",
    rating: 4.8,
    students: 420,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "80+ ore de conținut",
      "20 lab-uri practice",
      "Certificare ethical hacking",
      "Suport mentor",
      "Job placement assistance"
    ],
    curriculum: [
      "Network security",
      "Web application security",
      "Penetration testing",
      "Incident response",
      "Risk assessment",
      "Compliance și standards"
    ]
  },
  {
    title: "JavaScript Avansat - ES6+ și Modern Development",
    shortDescription: "Stăpânește JavaScript modern cu ES6+, async/await și design patterns",
    description: "Un curs avansat de JavaScript care te va învăța funcționalitățile moderne ale limbajului, design patterns, async programming și cum să scrii cod de calitate enterprise.",
    instructor: "Elena Marinescu",
    price: 349,
    duration: 55,
    level: "intermediate",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500",
    category: "javascript",
    rating: 4.9,
    students: 1800,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "55+ ore de conținut",
      "12 proiecte practice",
      "Code reviews",
      "Best practices",
      "Acces pe viață"
    ],
    curriculum: [
      "ES6+ Features",
      "Async/Await și Promises",
      "Design Patterns",
      "Functional Programming",
      "Testing cu Jest",
      "Performance Optimization"
    ]
  },
  {
    title: "Machine Learning cu Python și TensorFlow",
    shortDescription: "Dezvoltă modele de AI și machine learning cu Python și TensorFlow",
    description: "Învață să creezi modele de machine learning și AI folosind Python, TensorFlow și Keras. De la algoritmi de bază la deep learning avansat.",
    instructor: "Dr. Andrei Munteanu",
    price: 799,
    duration: 90,
    level: "advanced",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500",
    category: "ai",
    rating: 4.9,
    students: 320,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "90+ ore de conținut",
      "25 proiecte practice",
      "GPU access",
      "Research papers",
      "Certificare ML Engineer"
    ],
    curriculum: [
      "Fundamentele ML",
      "TensorFlow și Keras",
      "Deep Learning",
      "Computer Vision",
      "Natural Language Processing",
      "Model Deployment"
    ]
  },
  {
    title: "Web Development Full Stack cu Node.js",
    shortDescription: "Dezvoltă aplicații web complete cu frontend și backend",
    description: "Un curs complet de full-stack development care te va învăța să creezi aplicații web moderne cu React, Node.js, Express și MongoDB.",
    instructor: "Mihai Ionescu",
    price: 499,
    duration: 65,
    level: "intermediate",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500",
    category: "web",
    rating: 4.7,
    students: 1100,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "65+ ore de conținut",
      "15 proiecte practice",
      "Mentorship 1-on-1",
      "Portfolio building",
      "Job placement help"
    ],
    curriculum: [
      "Frontend cu React",
      "Backend cu Node.js",
      "Database cu MongoDB",
      "Authentication",
      "API Development",
      "Deployment"
    ]
  },
  {
    title: "Digital Marketing și SEO Avansat",
    shortDescription: "Stăpânește marketingul digital și optimizarea pentru motoarele de căutare",
    description: "Învață strategii avansate de digital marketing, SEO, social media marketing și cum să crești o afacere online de succes.",
    instructor: "Ana Popescu",
    price: 299,
    duration: 40,
    level: "beginner",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
    category: "marketing",
    rating: 4.6,
    students: 2500,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "40+ ore de conținut",
      "10 case studies",
      "Tools premium",
      "Community access",
      "Certificare Google Ads"
    ],
    curriculum: [
      "SEO Fundamentals",
      "Google Ads",
      "Social Media Marketing",
      "Content Marketing",
      "Analytics",
      "Conversion Optimization"
    ]
  },
  {
    title: "Blockchain și Cryptocurrency Development",
    shortDescription: "Dezvoltă aplicații blockchain și smart contracts cu Solidity",
    description: "Învață să creezi aplicații blockchain, smart contracts și să dezvolți proiecte în domeniul cryptocurrency și DeFi.",
    instructor: "Cristian Radu",
    price: 899,
    duration: 75,
    level: "advanced",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500",
    category: "blockchain",
    rating: 4.8,
    students: 180,
    language: "română",
    lastUpdated: new Date().toISOString(),
    features: [
      "75+ ore de conținut",
      "20 smart contracts",
      "Testnet access",
      "NFT projects",
      "DeFi protocols"
    ],
    curriculum: [
      "Blockchain Fundamentals",
      "Solidity Programming",
      "Smart Contracts",
      "DeFi Protocols",
      "NFT Development",
      "Security Auditing"
    ]
  }
];

// Funcție pentru verificarea și popularea cursurilor
export const checkAndPopulateCourses = async () => {
  try {
    await waitForFirebase();
    
    console.log('🔍 Verific cursurile din Firebase...');
    const existingCourses = await getAllCourses();
    
    if (existingCourses.length === 0) {
      console.log('📚 Nu există cursuri în Firebase. Populez cu toate cursurile...');
      
      const { collection, addDoc } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const coursesRef = collection(db, 'courses');
      
      for (const course of demoCourses) {
        try {
          const docRef = await addDoc(coursesRef, course);
          console.log(`✅ Curs adăugat: ${course.title} (ID: ${docRef.id})`);
        } catch (error) {
          console.error(`❌ Eroare la adăugarea cursului ${course.title}:`, error);
        }
      }
      
      console.log('🎉 Popularea cursurilor completată!');
    } else {
      console.log(`📚 Există deja ${existingCourses.length} cursuri în Firebase`);
      
      // Verific dacă trebuie să adaug cursuri noi
      const existingTitles = existingCourses.map(course => course.title);
      const newCourses = demoCourses.filter(course => !existingTitles.includes(course.title));
      
      if (newCourses.length > 0) {
        console.log(`🆕 Adaug ${newCourses.length} cursuri noi...`);
        
        const { collection, addDoc } = window.firestoreFunctions;
        const db = window.firebaseDB;
        const coursesRef = collection(db, 'courses');
        
        for (const course of newCourses) {
          try {
            const docRef = await addDoc(coursesRef, course);
            console.log(`✅ Curs nou adăugat: ${course.title} (ID: ${docRef.id})`);
          } catch (error) {
            console.error(`❌ Eroare la adăugarea cursului ${course.title}:`, error);
          }
        }
        
        console.log('🎉 Cursurile noi au fost adăugate!');
      } else {
        console.log('✅ Toate cursurile sunt deja în baza de date');
      }
      
      existingCourses.forEach(course => {
        console.log(`- ${course.title} (${course.category})`);
      });
    }
    
    // Returnez toate cursurile din baza de date
    const allCourses = await getAllCourses();
    return allCourses;
  } catch (error) {
    console.error('❌ Eroare la verificarea/popularea cursurilor:', error);
    throw error;
  }
};

// Funcție pentru ștergerea tuturor cursurilor (pentru testare)
export const clearAllCourses = async () => {
  try {
    await waitForFirebase();
    
    const { collection, getDocs, deleteDoc, doc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    
    console.log(`🗑️ Șterg ${snapshot.docs.length} cursuri...`);
    
    for (const courseDoc of snapshot.docs) {
      await deleteDoc(doc(db, 'courses', courseDoc.id));
      console.log(`✅ Curs șters: ${courseDoc.data().title}`);
    }
    
    console.log('🎉 Toate cursurile au fost șterse!');
  } catch (error) {
    console.error('❌ Eroare la ștergerea cursurilor:', error);
    throw error;
  }
};
