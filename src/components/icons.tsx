import React from 'react';

export const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Hablar con el camarero virtual</title>{' '}
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>{' '}
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path> <line x1="12" y1="19" x2="12" y2="23"></line>{' '}
    <line x1="8" y1="23" x2="16" y2="23"></line>{' '}
  </svg>
);
export const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Cerrar</title> <line x1="18" y1="6" x2="6" y2="18"></line>{' '}
    <line x1="6" y1="6" x2="18" y2="18"></line>{' '}
  </svg>
);
export const QrCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Mostrar código QR</title> <rect x="3" y="3" width="7" height="7"></rect>{' '}
    <rect x="14" y="3" width="7" height="7"></rect> <rect x="3" y="14" width="7" height="7"></rect>{' '}
    <line x1="14" y1="14" x2="14.01" y2="14"></line> <line x1="17" y1="14" x2="21" y2="14"></line>{' '}
    <line x1="14" y1="17" x2="17" y2="17"></line> <line x1="17" y1="21" x2="21" y2="21"></line>{' '}
    <line x1="21" y1="17" x2="21" y2="21"></line>{' '}
  </svg>
);
export const CubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Modelo 3D</title>{' '}
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>{' '}
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>{' '}
    <line x1="12" y1="22.08" x2="12" y2="12"></line>{' '}
  </svg>
);
export const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Imagen</title> <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>{' '}
    <circle cx="8.5" cy="8.5" r="1.5"></circle> <polyline points="21 15 16 10 5 21"></polyline>{' '}
  </svg>
);
export const AlertTriangleIcon = ({
  title,
  ...props
}: React.SVGProps<SVGSVGElement> & { title?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    {title ? <title>{title}</title> : <title>Alerta</title>}{' '}
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>{' '}
    <line x1="12" y1="9" x2="12" y2="13"></line>{' '}
    <line x1="12" y1="17" x2="12.01" y2="17"></line>{' '}
  </svg>
);
export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Confirmado</title> <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>{' '}
    <polyline points="22 4 12 14.01 9 11.01"></polyline>{' '}
  </svg>
);
export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Recomendaciones</title>{' '}
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9L12 3z" />{' '}
    <path d="M5 3v4" /> <path d="M19 17v4" /> <path d="M3 5h4" /> <path d="M17 19h4" />{' '}
  </svg>
);
export const UploadCloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Subir archivo</title>{' '}
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /> <path d="M12 12v9" />{' '}
    <path d="m16 16-4-4-4 4" />{' '}
  </svg>
);
export const Wand2Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Generar con IA</title>{' '}
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path>{' '}
    <path d="m14 7 3 3"></path>
    <path d="M5 6v4"></path> <path d="M19 14v4"></path>
    <path d="M10 2v2"></path> <path d="M7 8H3"></path>
    <path d="M21 16h-4"></path> <path d="M11 3H9"></path>{' '}
  </svg>
);
export const Volume2Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>
      Leer en voz alta
    </title> <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>{' '}
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>{' '}
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>{' '}
  </svg>
);
export const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Historial de pedidos</title>{' '}
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /> <path d="M12 8v4l2 2" />{' '}
  </svg>
);
export const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Estrella</title>{' '}
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />{' '}
  </svg>
);
export const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Todos</title> <line x1="8" y1="6" x2="21" y2="6"></line>{' '}
    <line x1="8" y1="12" x2="21" y2="12"></line> <line x1="8" y1="18" x2="21" y2="18"></line>{' '}
    <line x1="3" y1="6" x2="3.01" y2="6"></line> <line x1="3" y1="12" x2="3.01" y2="12"></line>{' '}
    <line x1="3" y1="18" x2="3.01" y2="18"></line>{' '}
  </svg>
);
export const SaladIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Ensalada</title> <path d="M7 21h10" />{' '}
    <path d="M12 21V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3" />{' '}
    <path d="M12 14c4.42 0 8-2.69 8-6h-2a6 6 0 0 1-6 6z" />{' '}
    <path d="M12 14a6 6 0 0 0-6-6H4c0 3.31 3.58 6 8 6z" />{' '}
  </svg>
);
export const SandwichIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Bocadillo</title> <path d="M2 14.5h20v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3z" />{' '}
    <path d="M18 11.5V10a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1.5" />{' '}
    <path d="M21.17 14.5 12 7l-9.17 7.5" /> <path d="m7 8-1.5-1.5M13.5 8 12 6.5 10.5 8" />{' '}
  </svg>
);
export const FishIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Pescado</title>{' '}
    <path d="M6.5 12.5a5.5 5.5 0 0 1 0-5 .5.5 0 0 0-.5-.5.5.5 0 0 0-.5.5 6.5 6.5 0 0 0 0 6 .5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5V12.5z" />{' '}
    <path d="m18.5 12.5-3-3 3-3" />{' '}
    <path d="M15.5 12.5a5.5 5.5 0 0 1 0-5 .5.5 0 0 0-.5-.5.5.5 0 0 0-.5.5 6.5 6.5 0 0 0 0 6 .5.5 0 0 0 .5.5.5.5 0 0 0 .5-.5V12.5z" />{' '}
    <path d="M2 12.5h13.5" />{' '}
  </svg>
);
export const MeatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Carne</title>{' '}
    <path d="M12.65 3.31a2 2 0 0 0-2.3 0L3.6 8.16a2 2 0 0 0 0 2.68l6.76 4.85a2 2 0 0 0 2.3 0l6.76-4.85a2 2 0 0 0 0-2.68L12.65 3.31z" />{' '}
    <path d="M3.5 11.5 12 18l8.5-6.5" /> <path d="m12 18 8.5 3-8.5-3.5-8.5 3.5 8.5-3z" />{' '}
  </svg>
);
export const CakeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Postre</title> <path d="M12 20h.01" /> <path d="M12 14h.01" /> <path d="M12 8h.01" />{' '}
    <path d="M2 14.5h20v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3z" />{' '}
    <path d="M12 4a3 3 0 0 1 3 3v2H9V7a3 3 0 0 1 3-3z" />{' '}
    <path d="M2 14.5v3c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-3" />{' '}
  </svg>
);
export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Buscar</title> <circle cx="11" cy="11" r="8"></circle>{' '}
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>{' '}
  </svg>
);
export const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Más opciones</title> <circle cx="12" cy="12" r="1"></circle>{' '}
    <circle cx="12" cy="5" r="1"></circle> <circle cx="12" cy="19" r="1"></circle>{' '}
  </svg>
);
export const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Anterior</title> <polyline points="15 18 9 12 15 6"></polyline>{' '}
  </svg>
);
export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Siguiente</title> <polyline points="9 18 15 12 9 6"></polyline>{' '}
  </svg>
);
export const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Chat</title>{' '}
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>{' '}
  </svg>
);
export const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Vídeo</title> <path d="m22 8-6 4 6 4V8Z" />{' '}
    <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />{' '}
  </svg>
);
export const ClapperboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Claquesta</title>{' '}
    <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />{' '}
    <path d="m6.2 5.3 3.1 3.9" /> <path d="m12.4 3.6 3.1 4" />{' '}
    <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />{' '}
  </svg>
);
export const BrainCircuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Cerebro</title>{' '}
    <path d="M12 5a3 3 0 1 0-5.993.13a3 3 0 0 0 5.993-.13Zm0 0a3 3 0 1 0 5.993.13A3 3 0 0 0 12 5Z" />{' '}
    <path d="M12 15a3 3 0 1 0-5.993.13a3 3 0 0 0 5.993-.13Zm0 0a3 3 0 1 0 5.993.13A3 3 0 0 0 12 15Z" />{' '}
    <path d="M12 5a3 3 0 0 0-3 3v2h6V8a3 3 0 0 0-3-3Z" />{' '}
    <path d="M12 15a3 3 0 0 0-3 3v2h6v-2a3 3 0 0 0-3-3Z" />{' '}
    <path d="M6 8.87A3 3 0 0 0 5 12a3 3 0 0 0 1 2.13" />{' '}
    <path d="M18 8.87A3 3 0 0 1 19 12a3 3 0 0 1-1 2.13" />{' '}
  </svg>
);
export const MusicNoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Música</title> <path d="M9 18V5l12-2v13" /> <circle cx="6" cy="18" r="3" />{' '}
    <circle cx="18" cy="16" r="3" />{' '}
  </svg>
);
export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Enviar</title> <line x1="22" y1="2" x2="11" y2="13"></line>{' '}
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>{' '}
  </svg>
);
export const BotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Bot</title> <path d="M12 8V4H8" /> <rect x="4" y="12" width="16" height="8" rx="2" />{' '}
    <path d="M2 12h2" /> <path d="M20 12h2" /> <path d="M12 12v-2" /> <path d="M9 18v-2" />{' '}
    <path d="M15 18v-2" />{' '}
  </svg>
);
export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Usuario</title> <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{' '}
    <circle cx="12" cy="7" r="4" />{' '}
  </svg>
);
export const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Enlace externo</title>{' '}
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />{' '}
    <polyline points="15 3 21 3 21 9" /> <line x1="10" y1="14" x2="21" y2="3" />{' '}
  </svg>
);
export const KeyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>API Key</title> <circle cx="7.5" cy="15.5" r="5.5" /> <path d="m21 2-9.6 9.6" />{' '}
    <path d="m15.5 7.5 3 3L22 7l-3-3" />{' '}
  </svg>
);
export const LayoutDashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Dashboard</title> <rect x="3" y="3" width="7" height="9" />{' '}
    <rect x="14" y="3" width="7" height="5" /> <rect x="3" y="16" width="7" height="5" />{' '}
    <rect x="14" y="12" width="7" height="9" />{' '}
  </svg>
);
export const MapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Mapa</title> <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />{' '}
    <line x1="8" y1="2" x2="8" y2="18" /> <line x1="16" y1="6" x2="16" y2="22" />{' '}
  </svg>
);
export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Ajustes</title>{' '}
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>{' '}
    <circle cx="12" cy="12" r="3"></circle>{' '}
  </svg>
);
export const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Gráfico de barras</title> <line x1="12" x2="12" y1="20" y2="10" />{' '}
    <line x1="18" x2="18" y1="20" y2="4" /> <line x1="6" x2="6" y1="20" y2="16" />{' '}
  </svg>
);
export const UtensilsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Utensilios</title> <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />{' '}
    <path d="M7 2v20" /> <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" />{' '}
  </svg>
);
export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    {...props}
  >
    {' '}
    <title>Descargar</title> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>{' '}
    <polyline points="7 10 12 15 17 10"></polyline>{' '}
    <line x1="12" y1="15" x2="12" y2="3"></line>{' '}
  </svg>
);
