import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';
// import Dashboardheader from '../component/Dashboardheader';
import UpComingEvents from '../component/UpComingEvent';
import './styles/Project.css';

const Project = ({title}) => {
   useEffect(() => { document.title = title;
  }, [title]);
  return (
   <>
          <div className="dashboard-content">
             <div className="dashboard-view" id="projects">
                <div className="project-nav">
                  <NavLink end to="." className={({isActive}) => `project-nav-link${isActive ? ' active' : ''} button-81`}>
                    <span className="material-symbols-rounded">folder</span>
                    My Projects
                  </NavLink>
                  <NavLink to="create" className={({isActive}) => `project-nav-link${isActive ? ' active' : ''} button-89`}>
                    <span className="material-symbols-rounded">add_circle</span>
                    Create Project
                  </NavLink>
                </div>
{/* <!-- HTML !-->
<button class="button-89" role="button">Button 89</button> */}

               <UpComingEvents />
          </div>
          </div>
   </>
  )
}

export default Project;