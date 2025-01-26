import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" style={{ padding: '20px 20px 0px' }}>
      <h2 className="section-heading">About</h2>
      <p className="section-paragraph">
        A project by Stanford Blockchain Club&apos;s research and governance team to evaluate the robustness of different voting mechanisms in the context of Optimism&apos;s RPGF. We develop a simulation framework for three primary voting mechanisms used in previous RetroPGF rounds: Single Selection Maximum (Max Voting), Quadratic Voting, and Mean Voting.
      </p>
      
      <p className="section-paragraph">
        {/* This work was generously supported by research grant from the Optimism Foundation. */}
        {/* Write more about the different variants and attacks that we are testing */}
      </p>

    </section>
  );
};

export default About;
