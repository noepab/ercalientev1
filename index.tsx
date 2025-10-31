import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare global {
  // FIX: Correctly augment the React.JSX.IntrinsicElements interface to add support for the 'model-viewer' custom element.
  // The previous declaration was causing conflicts and removing definitions for standard HTML and SVG elements.
  namespace React.JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          src?: string;
          ar?: boolean;
          arModes?: string;
          cameraControls?: boolean;
          autoRotate?: boolean;
          alt?: string;
        };
    }
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}