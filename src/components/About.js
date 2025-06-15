import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <header className="about-header">
          <h1>About Parking Lot Simulator</h1>
          <p className="subtitle">Exploring the economics of accessibility in urban planning</p>
        </header>

        <section className="about-section">
          <h2>Project Overview</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </section>

        <section className="about-section">
          <h2>Research Methodology</h2>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores 
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, 
            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </p>
          <p>
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? 
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, 
            vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
        </section>

        <section className="about-section">
          <h2>Key Findings</h2>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia 
            deserunt mollitia animi, id est laborum et dolorum fuga.
          </p>
          <p>
            Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio 
            cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
          </p>
        </section>

        <section className="about-section">
          <h2>About the Developer</h2>
          <p>
            This parking lot simulator was developed as part of ongoing research into urban planning and accessibility economics. 
            The project aims to provide insights into how different parking configurations affect various user groups, 
            particularly focusing on accessibility considerations and their economic implications.
          </p>
        </section>

        <section className="about-section">
          <h2>Other Projects</h2>
          <div className="project-links">
            <a href="https://www.fillandflush.com" target="_blank" rel="noopener noreferrer" className="project-link">
              <h3>Fill & Flush</h3>
              <p>Innovative solutions for water management and conservation</p>
            </a>
            <a href="https://www.platechase.com" target="_blank" rel="noopener noreferrer" className="project-link">
              <h3>Plate Chase</h3>
              <p>Advanced license plate recognition and tracking systems</p>
            </a>
            <a href="https://www.josephecombs.com" target="_blank" rel="noopener noreferrer" className="project-link">
              <h3>Joseph E. Combs</h3>
              <p>Personal portfolio and professional experience</p>
            </a>
          </div>
        </section>

        <div className="about-footer">
          <Link to="/" className="back-link">
            ← Back to Simulator
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About; 