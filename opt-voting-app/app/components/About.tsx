import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" style={{ padding: '20px 20px 0px' }}>
      <h2 className="section-heading">About</h2>
      <p className="section-paragraph">
        A project by Stanford Blockchain Club&apos;s research and governance team to evaluate the robustness of different voting mechanisms in the context of Optimism&apos;s RPGF. We develop a simulation framework for three primary voting mechanisms used in previous RetroPGF rounds: Quadratic Voting, Mean Voting, and Median Voting, and evaluate their performance against voter collusion attack scenarios and project collusion attack scenarios.
      </p>
      <p className="section-paragraph">
        <b>Voter attacks</b> refer to scenarios where a group of two or more individual voters collude to manipulate the voting outcome, swaying the vote towards their preferred projects. <b>Project attacks</b> refer to scenarios where a group of two or more projects collude to manipulate the voting outcome, asking all of their preferred voters to split their votes among the colluding projects.
      </p>
      <p className="section-paragraph">
        This work was generously supported by research grant from the Optimism Foundation.
      </p>

    </section>
  );
};

export default About;
