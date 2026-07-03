import { FaBars,   } from 'react-icons/fa'
import logoImg from '../../assets/logo.png'
import searchImg from '../../assets/search_icon.png'
import { Link } from 'react-router-dom';
import CountrySelector from '../ui/countrySelector'; 
import { SearchBar } from '../../features/search-feed/searchBar';





function Navbar() {
  return (
    <nav className=" flex items-center justify-between gap-5 py-[14px] px-5 bg-[#05445e]
    text-white sticky top-0 z-[1000]">
      
      {/* MENU ICON  */}
      <div className="flex items-center gap-[12px]">
        <FaBars className="menu-btn" />
       

{/*The Logo*/}

       <a href='/' >
        <img 
  src={logoImg} 
  alt="bmday Logo" 
  className="block w-[130px] h-10 object-contain " 
/>

        </a>
          <CountrySelector />
      </div>
      <SearchBar/>
   {/* RIGHT */}
<div className="flex items-center gap-[18px] ml-auto">
  <Link to ="/signin"
  
        rel="noopener noreferrer"
   className="no-underline text-white font-semibold ">Sign in</Link>
  <div className="icon-btn"></div>
  
 {/* THE LINK CONVERTED FOR FAST SINGLE-PAGE ROUTING */}
<Link to="/cart" className="relative cursor-pointer text-[18px] select-none block">
  🛒
  

    <span className="absolute top-[-8px] right-[-10px] bg-[#e63946] text-white text-[11px] py-[2px] px-[6px] rounded-full min-w-[18px] text-center font-bold">
      
    </span>
  
</Link>

</div>
</nav>
  )
}

export default Navbar
