import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <header className="about-header">
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px',
            zIndex: 10
          }}>
            <Link 
              to="/" 
              style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.color = 'rgba(255,255,255,1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'rgba(255,255,255,0.8)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ← Back to Simulator
            </Link>
          </div>
          <h1>About Parking Lot Simulator</h1>
          <p className="subtitle">Exploring the economics of accessibility in urban planning</p>
        </header>

        <section className="about-section">
          <h2>Project Overview</h2>
          <p>
            This parking lot simulator explores a fundamental question in urban economics: how do we measure the real welfare impact 
            of handicapped parking spots? While these spaces are legally required and socially accepted, their true economic value 
            and distributional effects remain poorly understood. This project aims to quantify the trade-offs between accessibility, 
            parking efficiency, and overall social welfare.
          </p>
          <p>
            Traditional economic analysis often treats handicapped parking as a simple regulatory cost, but this approach misses 
            the complex interactions between accessibility needs, parking demand patterns, and the broader transportation ecosystem. 
            Our simulator allows users to experiment with different parking configurations to better understand these dynamics.
          </p>
        </section>

        <section className="about-section">
          <h2>Research Methodology</h2>
          <p>
            The simulator employs agent-based modeling to represent diverse parking behaviors and accessibility needs. Each simulation 
            tracks individual vehicles with varying mobility requirements, time constraints, and parking preferences. By observing 
            how different handicapped spot allocations affect overall parking efficiency, wait times, and accessibility outcomes, 
            we can begin to measure the true welfare implications of accessibility accommodations.
          </p>
          <p>
            Key metrics include: average wait times for different user groups, parking space utilization rates, accessibility 
            compliance effectiveness, and the economic cost of accessibility accommodations relative to their social benefits. 
            This data-driven approach helps bridge the gap between regulatory requirements and measurable outcomes.
          </p>
        </section>

        <section className="about-section">
          <h2>Key Findings</h2>
          <p>
            Our research reveals a crucial insight: the speed of handicapped walking relative to non-handicapped walking is 
            fundamental to determining the economic justification for reserved parking spaces. The slower you assume handicapped 
            individuals walk compared to the general population, the more economically justifiable these spaces become.
          </p>
          <p>
            This finding challenges traditional approaches that treat accessibility accommodations as purely regulatory costs. 
            When we model realistic walking speed differentials, the welfare benefits of closer parking access become quantifiable 
            and significant. The simulation demonstrates that even modest differences in walking speed can justify substantial 
            parking space allocations when considering the cumulative time savings and improved accessibility outcomes.
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