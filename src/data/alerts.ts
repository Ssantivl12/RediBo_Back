import { Alert } from '../types/alert';

export const alerts: Alert[] = [
    { 
        id: 1, 
        car: "Kima", 
        model: "Sedan",  
        brand: "Honda",  
        tenant: "Jose Prado", 
        date: "12/07/2025", 
        time: "20:14",
        exceededTime: "2:30 hrs",
        returnInfo: "12/07/2025 - 22:44",
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop',

        viewed: false
      },
      { 
        id: 2, 
        car: "Ford", 
        model: "Explorer",
        brand: "Ford",
        tenant: "Juan Perez", 
        date: "12/07/2025", 
        time: "19:45",
        exceededTime: "1:15 hrs",
        returnInfo: "12/07/2025 - 21:00",
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop',
        viewed: false
      },
      { 
        id: 3, 
        car: "NISSAN", 
        model: "Sentra",
        brand: "Nissan",
        tenant: "Marcela Rodriguez", 
        date: "11/07/2025", 
        time: "21:14",
        exceededTime: "0:45 hrs",
        returnInfo: "11/07/2025 - 22:00",
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop',
        viewed: false
      },
      { 
        id: 4, 
        car: "Toyota", 
        model: "Corolla",
        brand: "Toyota",
        tenant: "Luis Rocha", 
        date: "11/07/2025", 
        time: "19:00",
        exceededTime: "1:00 hrs",
        returnInfo: "11/07/2025 - 20:00",
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop',
        viewed: false
      },
      { 
        id: 5, 
        car: "Mazda", 
        model: "CX-5",
        brand: "Mazda",
        tenant: "Carlos López", 
        date: "11/07/2025", 
        time: "18:50",
        exceededTime: "1:40 hrs",
        returnInfo: "11/07/2025 - 20:30",
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop',
        viewed: false
      },
      { 
        id: 6, 
        car: "BMW", 
        model: "X3",
        brand: "BMW",
        tenant: "Ana García", 
        date: "10/07/2025", 
        time: "17:30",
        exceededTime: "2:10 hrs",
        returnInfo: "10/07/2025 - 19:40",
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop',
        viewed: false
      },
      { 
        id: 7, 
        car: "Mercedes", 
        model: "C-Class",
        brand: "Mercedes-Benz",
        tenant: "Roberto Sánchez", 
        date: "10/07/2025", 
        time: "16:45",
        exceededTime: "3:00 hrs",
        returnInfo: "10/07/2025 - 19:45",
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop',
        viewed: false
      },
  // Agrega más alertas según sea necesario
];
