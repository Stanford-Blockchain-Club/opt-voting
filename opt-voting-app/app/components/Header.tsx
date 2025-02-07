"use client";  // Add this line at the very top

import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = 0;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    lastScrollY = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${!isVisible ? styles.hidden : ''}`}>
      <div className={styles.headerLeft}>
        <h1>Optimism RPGF Evaluation</h1>
      </div>
      <div className={styles.headerRight}>
        <nav>
          <ul>
            <li><a href="https://blockchain.stanford.edu/files/research/optimism-rpgf-0206.pdf">Paper</a></li>
            <li><a href="https://github.com/orgs/ethereum-optimism/projects/31/views/1?pane=issue&itemId=61734498">RFP Details</a></li>

            {/* <li><a href="#results">Result</a></li>
            <li><a href="#measurement">Measure</a></li>
            <li><a href="#explanation">Explain</a></li> */}
          </ul>
        </nav>
        <div className={styles.headerIcons}>
          <a href="https://blockchain.stanford.edu/" target="_blank" rel="noopener noreferrer">
            <img src="/SBC.png" alt="Website" />
          </a>
          <a href="https://github.com/Stanford-Blockchain-Club" target="_blank" rel="noopener noreferrer">
            <img src="/GitHub.png" alt="GitHub" />
          </a>
          <a href="https://x.com/StanfordCrypto" target="_blank" rel="noopener noreferrer">
            <img src="/X.png" alt="Twitter" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
