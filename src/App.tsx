import { RouteSectionProps } from '@solidjs/router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App(props: RouteSectionProps<unknown>) {
 return (
  <main>
   <Navbar />
   {props.children}
   <Footer />
  </main>
 );
}
