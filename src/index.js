import { createRoot } from '@wordpress/element';
import App from './App';
import ResultsViewer from './steps/ResultsViewer';
import './style.css';

/**
 * index.js — WordPress React entry point.
 *
 * The mount div <div id="react-root"></div> lives inside page-calculator.php.
 * @wordpress/scripts compiles this to /build/index.js which functions.php enqueues.
 */
const rootElement = document.getElementById('react-root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
// Mount admin results viewer (only present on results-viewer page)
const viewerRoot = document.getElementById('rental-audit-results-viewer');
if (viewerRoot) createRoot(viewerRoot).render(<ResultsViewer />);