import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import CategoryBar from '../../features/search-feed/categorybar';
import Footer from './footer';

export default function StoreLayout() {
  return (
    <>
      <Navbar />
      <CategoryBar />
      {/* The 'Outlet' component is where your child routes will be injected */}
      <Outlet />
      <Footer />
    </>
  );
}