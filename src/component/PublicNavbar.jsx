import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/PublicNavbar.css';


function  PublicNavbar() {
  const location = useLocation(); const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeHash, setActiveHash] = useState('#home');
 useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 100);

      const sections = document.querySelectorAll('section[id]');
      const top = scrollY;
      sections.forEach((sec) => {
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (top >= offset && top < offset + height) {
          setActiveHash(`#${id}`);
        }
      });

      // Close menu on scroll
      if (isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Dark mode toggle (applies class to body)
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  console.log(isMenuOpen);

  return (
    <header className={`header ${isSticky ? 'sticky' : ''}`}>

   <nav className="navbar">
        <h2 className="logo"><Link to="/">FestMate</Link></h2>

        <ul className={`links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <NavLink to="/" className={`link`}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" className={`link`}>About Us</NavLink>
          </li>
          <li>
            <NavLink to="/services" className={`link`}>Services</NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={`link`}>Contact Us</NavLink>
          </li>
        </ul>
        <div className="buttons">
          <NavLink to="/login" className="signin">Sign In</NavLink>
          <NavLink to="/register" className="signup">Sign Up</NavLink>
        </div>
         <div
        className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`}
        id="menu-icon"
        onClick={toggleMenu}
        style={{ cursor: 'pointer' }}
        aria-label="Toggle menu"
      >
        ☰
      </div>
      </nav>
    </header>
  );
};
export default PublicNavbar;
