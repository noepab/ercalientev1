// --- TYPES & DATA ---

export enum AppState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  modelUrl?: string;
  allergens?: Allergy[];
  ingredients?: { name: string; default: boolean; }[];
  extras?: { name: string; price: number; }[];
}

export interface DrinkItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  allergens?: Allergy[];
  ingredients?: { name: string; default: boolean; }[];
  extras?: { name: string; price: number; }[];
}

export interface CartItem {
  cartItemId: string;
  id: number;
  name: string;
  basePrice: number;
  price: number;
  quantity: number;
  customerName: string;
  status: 'pending' | 'ordered';
  itemType: 'menu' | 'drink';
  addedAt: number;
  customizations?: {
    removed: string[];
    added: { name: string; price: number }[];
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Order {
  id: string;
  date: string;
  tableNumber: string | null;
  diningOption: 'dine-in' | 'takeout' | null;
  items: CartItem[];
  total: number;
}

export const ALLERGIES_DATA = {
  gluten: 'Gluten',
  dairy: 'Lácteos',
  nuts: 'Frutos Secos',
  shellfish: 'Marisco',
  soy: 'Soja',
  eggs: 'Huevos'
} as const;

export type Allergy = keyof typeof ALLERGIES_DATA;
export const ALLERGIES = Object.keys(ALLERGIES_DATA) as Allergy[];

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'ai' | 'error';
    text: string;
    sources?: { uri: string; title: string }[];
}


export const MENU_ITEMS: MenuItem[] = [
    { id: 1, name: 'Bocadillo de Calamares', description: 'Un delicioso bocadillo de calamares fritos con pan crujiente, un clásico madrileño.', price: 6.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/bocadillo-calamares-blanco.jpg?v=1720104938923', category: 'Bocadillos', allergens: ['gluten', 'shellfish', 'eggs'], modelUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/sandwich.glb?v=1719586327633', ingredients: [ { name: 'Pan', default: true }, { name: 'Calamares Fritos', default: true }, { name: 'Mayonesa', default: true }, ], extras: [ { name: 'Queso', price: 1.00 }, { name: 'Jamón', price: 1.50 }, { name: 'Huevo Frito', price: 1.20 }, ] },
    { id: 4, name: 'Bocadillo de Tortilla Española', description: 'Primer plano de un bocadillo de tortilla de patatas jugosa en pan de barra, con un fondo de bar español.', price: 4.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/bocadillo-tortilla.jpg?v=1720188358488', category: 'Bocadillos', allergens: ['eggs', 'gluten'], ingredients: [ { name: 'Pan', default: true }, { name: 'Tortilla Española', default: true }, ], extras: [ { name: 'Alioli', price: 0.50 }, { name: 'Pimiento Verde Frito', price: 1.00 }, ] },
    { id: 11, name: 'Bocadillo de Jamón con Tomate', description: 'Un delicioso bocadillo de jamón serrano con tomate fresco rallado sobre pan de pueblo, luz natural.', price: 5.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/bocadillo-jamon.jpg?v=1720188355644', category: 'Bocadillos', allergens: ['gluten'] },
    { id: 12, name: 'Ensalada Mixta Clásica', description: 'Bol de cristal con una ensalada fresca de lechuga, tomate, atún, cebolla y aceitunas, aderezada con aceite de oliva.', price: 7.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/ensalada-mixta.jpg?v=1720188365113', category: 'Ensaladas', modelUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/salad.glb?v=1719586618171' },
    { id: 13, name: 'Ensalada César con Pollo', description: 'Plato hondo blanco con ensalada César, trozos de pollo a la parrilla, picatostes dorados y lascas de parmesano.', price: 8.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/ensalada-cesar.jpg?v=1720188362247', category: 'Ensaladas', allergens: ['gluten', 'dairy', 'eggs'] },
    { id: 14, name: 'Ración de Boquerones Fritos', description: 'Plato de boquerones fritos al estilo andaluz, crujientes y dorados, con un trozo de limón para exprimir.', price: 9.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/boquerones.jpg?v=1720188352696', category: 'Pescaito Frito', allergens: ['gluten'] },
    { id: 2, name: 'Ración de Calamares a la Romana', description: 'Una ración generosa de calamares a la romana, tiernos por dentro y crujientes por fuera, listos para dipear.', price: 10.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/calamares-romana.jpg?v=1720188360124', category: 'Pescaito Frito', allergens: ['gluten', 'shellfish'] },
    { id: 3, name: 'Croquetas Caseras de Jamón', description: 'Fotografía de producto de unas croquetas de jamón recién hechas, cremosas y doradas, sobre una pizarra.', price: 5.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/croquetas.jpg?v=1720188360938', category: 'Carnes', allergens: ['gluten', 'dairy'] },
    { id: 15, name: 'Solomillo al Whisky con Patatas', description: 'Cazuela de barro con tacos de solomillo de cerdo en salsa al whisky con ajo y patatas fritas.', price: 12.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/solomillo-whisky.jpg?v=1720188372666', category: 'Carnes' },
    { id: 16, name: 'Tarta de Queso Cremosa', description: 'Porción de tarta de queso al horno, estilo La Viña, con un interior cremoso y un exterior tostado.', price: 5.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/tarta-queso.jpg?v=1720188375836', category: 'Postres', allergens: ['gluten', 'dairy', 'eggs'] },
    { id: 17, name: 'Flan Casero de Huevo', description: 'Un flan de huevo casero clásico, tembloroso, bañado en caramelo dorado, en un plato blanco.', price: 4.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/flan.jpg?v=1720188367298', category: 'Postres', allergens: ['dairy', 'eggs'] },
    { id: 18, name: 'Batido Natural de Plátano', description: 'Vaso alto de batido de plátano cremoso, con una pajita y una rodaja de plátano en el borde.', price: 4.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/batido-platano.jpg?v=1720188349887', category: 'Postres', allergens: ['dairy'] },
];

export const DRINK_ITEMS: DrinkItem[] = [
    { id: 1, name: 'Caña de Cerveza Bien Fría', price: 2.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/cana-cerveza.jpg?v=1720188603607', allergens: ['gluten'] },
    { id: 2, name: 'Copa de Vino Tinto', price: 3.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/copa-vino.jpg?v=1720188605487' },
    { id: 3, name: 'Refresco de Cola con Hielo y Limón', price: 2.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/refresco-cola.jpg?v=1720188612141' },
    { id: 4, name: 'Agua Mineral con Gas', price: 1.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/agua-gas.jpg?v=1720188600151' },
    { id: 5, name: 'Tinto de Verano Refrescante', price: 2.75, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/tinto-verano.jpg?v=1720188614601' },
    { id: 6, name: 'Zumo de Naranja Natural', price: 3.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/zumo-naranja.jpg?v=1720188617581' },
    { id: 7, name: 'Café con Leche y Arte Latte', price: 1.80, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/cafe-leche.jpg?v=1720188601878', allergens: ['dairy'] },
];

export const MORE_DRINK_ITEMS: DrinkItem[] = [
    { id: 101, name: 'Tercio Mahou', price: 2.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/tercio-mahou.jpg?v=1720191830508', allergens: ['gluten'] }, { id: 102, name: 'Alhambra 1925', price: 3.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/alhambra-1925.jpg?v=1720191811813', allergens: ['gluten'] }, { id: 103, name: 'Estrella Galicia', price: 2.80, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/estrella-galicia.jpg?v=1720191817441', allergens: ['gluten'] }, { id: 104, name: 'Cerveza Sin Gluten', price: 3.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/cerveza-sin-gluten.jpg?v=1720191814675' }, { id: 105, name: 'Radler Limón', price: 2.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/radler.jpg?v=1720191828135', allergens: ['gluten'] }, { id: 106, name: 'Copa Rioja', price: 3.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/copa-rioja.jpg?v=1720191816434' }, { id: 107, name: 'Copa Ribera', price: 3.80, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/copa-ribera.jpg?v=1720191815598' }, { id: 108, name: 'Copa Verdejo', price: 3.20, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/copa-verdejo.jpg?v=1720191816911' }, { id: 109, name: 'Copa Rosado', price: 3.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/copa-rosado.jpg?v=1720191816027' }, { id: 110, name: 'Botella Rioja', price: 18.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/botella-rioja.jpg?v=1720191812836' }, { id: 111, name: 'Fanta Naranja', price: 2.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/fanta.jpg?v=1720191818049' }, { id: 112, name: 'Nestea Limón', price: 2.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/nestea.jpg?v=1720191825838' }, { id: 113, name: 'Aquarius Naranja', price: 2.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/aquarius.jpg?v=1720191812328' }, { id: 114, name: 'Zumo Melocotón', price: 2.80, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/zumo-melocoton.jpg?v=1720191832049' }, { id: 115, name: 'Zumo Piña', price: 2.80, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/zumo-pina.jpg?v=1720191832598' }, { id: 116, name: 'Café Solo', price: 1.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/cafe-solo.jpg?v=1720191814144' }, { id: 117, name: 'Café Cortado', price: 1.60, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/cafe-cortado.jpg?v=1720191813680', allergens: ['dairy'] }, { id: 118, name: 'Té (varios)', price: 1.80, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/te.jpg?v=1720191829983' }, { id: 119, name: 'Carajillo', price: 2.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/carajillo.jpg?v=1720191813264' }, { id: 120, name: 'ColaCao', price: 2.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/colacao.jpg?v=1720191815147', allergens: ['dairy'] }, { id: 121, name: 'Chupito de Hierbas', price: 2.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/chupito-hierbas.jpg?v=1720191814324' }, { id: 122, name: 'Whisky-Cola', price: 7.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/whisky-cola.jpg?v=1720191831498' }, { id: 123, name: 'Gin Tonic', price: 8.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/gin-tonic.jpg?v=1720191818610' }, { id: 124, name: 'Ron-Cola', price: 7.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/ron-cola.jpg?v=1720191829035' }, { id: 125, name: 'Mojito', price: 8.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/mojito.jpg?v=1720191825134' }, { id: 126, name: 'Vermut', price: 3.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/vermut.jpg?v=1720191831008' }, { id: 127, name: 'Mosto', price: 2.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/mosto.jpg?v=1720191825501' }, { id: 128, name: 'Cava (Copa)', price: 4.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/cava.jpg?v=1720191821034' }, { id: 129, name: 'Sidra (Vaso)', price: 2.50, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/sidra.jpg?v=1720191829497' }, { id: 130, name: 'Sangría (Jarra 1L)', price: 12.00, imageUrl: 'https://cdn.glitch-global.net/6822488d-9a67-4bab-9fa7-66c3c859d012/sangria.jpg?v=1720191829285' },
];

export const CATEGORIES = ['Todos', 'Ensaladas', 'Bocadillos', 'Pescaito Frito', 'Carnes', 'Postres'];