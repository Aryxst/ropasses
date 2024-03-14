import { render } from 'solid-js/web';
import { HashRouter, Route } from '@solidjs/router';
import Home from './pages/Home';
import User from './pages/User';
import Navbar from './components/navbar';
import Footer from './components/footer';
import '@fontsource-variable/plus-jakarta-sans';
import './styles/globals.scss';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
 throw new Error('Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?');
}
const App = (props: any) => (
 <>
  <Navbar />
  {props.children}
  <Footer />
 </>
);
render(
 () => (
  <HashRouter root={App}>
   <Route path='/' component={Home} />
   <Route path='/user' component={User} />
  </HashRouter>
 ),
 root!,
);
