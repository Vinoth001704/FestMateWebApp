import PublicNavbar from '../../component/PublicNavbar';
import './styles/Home.css';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '../../context/ToastProvider';

// import Cards from '../compounts/Event/Cards';

export const Home = ({title,apiPath}) => {
   console.log(import.meta.env.VITE_API_URL)
    const { addToast } = useToast();

    useEffect(() => {
        document.title=title;
      }, []);

    const showExample = () => {
      addToast({ message: 'Welcome back! Toast notifications are working.', type: 'success', duration: 3500 });
    };
  return (
   <>
 <PublicNavbar/>
<div className="body1">
  <section className="hero-section">
      <div className="hero">
        <h2>Welcome to FestMate</h2>
        <p>
          Your ultimate companion for managing and organizing events seamlessly. Join us to
          explore, create, and participate in amazing events tailored just for you.
        </p>
        <div className="buttons">
          <NavLink to="/register" className="join">Get Started</NavLink>
          <NavLink to="/about" className="learn">Learn More</NavLink>
          <button onClick={showExample} className="learn" style={{marginLeft:8}}>Show Toast</button>
        </div>
      </div>
      <div className="img">
        <img src={`./hero-bg.png`} alt="FestMate Hero" />
      </div>
    </section>
   </div>
   
    </>
  );
};

