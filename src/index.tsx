import { render } from 'solid-js/web';
import { lazy } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Home from './pages/Home';
import Navbar from './components/navbar';
import Footer from './components/footer';
import '@fontsource-variable/plus-jakarta-sans';
import './styles/globals.scss';

const User = lazy(() => import('./pages/User'));
const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
 throw new Error('Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?');
}

render(
 () => (
  <>
   <Navbar />
   <Router>
    <Route
     path='/users/:userId'
     component={User}
     matchFilters={{
      userId: /^\d+$/, // only allow numbers
     }}
    />
    <Route path='/' component={Home} />
   </Router>
   <Footer />
  </>
 ),
 root!,
);
