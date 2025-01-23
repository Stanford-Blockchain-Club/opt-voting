'use client';

import React, { useState } from 'react';

const LiteratureReview = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{ padding: '0px 0px' }}>
      <h2 className="section-heading">Description</h2>
      <p className="section-paragraph">
        We will begin our exploration of DAO voting mechanism designs with a survey of existing literature on voting theory as a way to motivate the problem space and ground our exploration within a wider research context. To this end, we will discuss several prominent ideas in a modern, quantitative approach to democratic theory as well as their application and relevance to DAO governance design.
      </p>

      {/* Conditionally render content based on isExpanded state */}
      {isExpanded ? (
        <>
          <h3>Jury Theorems and Democratic Theory</h3>
          <p className="section-paragraph">
            One of the most important theoretical concepts behind democratic theory is the idea that “crowds are wise” – that a decision made by a crowd will outperform a decision made by any single member of that crowd. This idea fundamentally motivates the need for decentralized governance in a blockchain context, and there exists a broad class of mathematical models known as Jury Theorems that seek to prove this result.
          </p>

          <h4>Condorcet&apos;s Jury Theorem</h4>
          <p className="section-paragraph">
            Perhaps the most important of these is Condorcet&apos;s Jury theorem. This theorem states that if we have a binary decision being made by a slate of n voters and each voter has an i.i.d. probability of selecting the correct outcome, p; so long as p {'>'} 0.5, then P(majority selects correct choice) = 1 as n goes to infinity. Fundamentally, this theorem speaks to the wisdom of crowds, showing how even slightly knowledgeable crowds can arrive at the correct decision. It is for this reason that education of group members is highly valuable, and we should be skeptical of blindly following experts.
          </p>

          <p className="section-paragraph">
            Obviously, this theory is not perfect, as the independent and identically distributed assumption is nearly impossible to meet, especially given the fact that many voters will be exposed to similar information. This condition is slightly relaxed in the Conditional Jury Theorem, where we allow for the probability, pi, of selecting the right choice to differ between voters, ri, exposed to information, x; so long as pi = P(ri|x), pi {'>'} 0.5. More applicable to our problem space, however, is the Competence-Sensitive Jury Theorem, which allows for voters to have an individual probability of selecting the right choice (pi {'<'} 0.5); so long as the aggregate probability of voters exposed to that information, E[pi] {'>'} 0. (Jury Theorems, 2024)
          </p>

          <h3>Delegation and Liquid Democracy</h3>
          <p className="section-paragraph">
            From these Jury Theorems, it’s reasonable to assume experts are helpful, but should not be blindly followed. This line of reasoning leads to the idea of representative democracy through delegation – where users can choose “representative delegates” that are more motivated and informed than themselves to vote on their behalf. In an ideal setting of delegation, all voters can either choose to (A) vote themselves, or (B) delegate to someone else to vote on their behalf. These delegates can also choose to either vote themselves, or delegate all their votes to someone else, thus creating a liquid “chain” of delegations that can be revoked at any time, seeking to maximize participation.
          </p>

          <p className="section-paragraph">
            In democratic theory literature, this concept is known as Liquid Democracy. Given the frequency and technicality of proposals, this is a common approach within blockchain-based voting systems. Its practical implementation has been validated through experiments by Google, which advocates for what it calls the “Golden Rule of Liquid Democracy.” This rule states that if I give you a vote, I can see what you do with it; thereby, creating an enforcement mechanism for benevolent action. (Hardt and Lopes, 2015). In the context of blockchain governance and DAO voting mechanisms, this theoretical idea of liquid democracy seems particularly relevant – most major DAOs today implement some form of delegation in order to facilitate increased decentralization and transparency, and the concept of “redelegation” of voting power has emerged independently in several DAOs, such as in Optimism’s Anti-Capture Commission. Thus, liquid democracy as a concept has both technical feasibility and practical desirability in a DAO governance context.
          </p>

          <p className="section-paragraph">
            That being said, issues within traditional democracy still persist in Liquid Democracy. It’s for this reason that Blum and Zuber argue for a trustee or executive branch to ensure the feasibility and correctness of decisions. Further, they claim that these groups should have an established set of norms for deliberation as well as potential moderation for persistent disagreement (Blum and Zuber, 2015). Mooers et al. provides a counterpoint to this, however, as they have shown in a series of liquid democracy experiments that voters tend to overestimate the precision of more informed voters. Thus, while an executive to verify decisions may be desired, it may not be as effective as the wisdom of the crowds. (Mooers et al., 2024)
          </p>

          <h3>Quadratic Voting</h3>
          <p className="section-paragraph">
            Another popular mechanism for enhanced representation and combatting centralization is through a “Quadratic Voting” mechanism. First described by Steven Lalley and E. Glen Weyl, Quadratic Voting is a mechanism for token-based voting systems (Lalley and Weyl, 2018). It works by reweighting network participants’ voting power to be the square root of their tokens. For example, a participant with nine voting tokens would have a power of three, while a participant with four voting tokens would have a power of two. Assuming that a number of assumptions are met regarding token balances, if every party agrees that a vote is determinative with a constant probability, you can prove that such a mechanism is uniquely optimal. For these reasons, Quadratic Voting provides us with an efficient mechanism that balances decentralization with increased network stake.
          </p>

          <p className="section-paragraph">
            Nonetheless, Quadratic Voting makes the critical assumption that everyone’s number of voting tokens is known. In most blockchain-based systems, this is not true, as one can pseudonymously create as many wallets as they like. For this reason, critics of Quadratic Voting often claim that the mechanism is vulnerable to an indirect Sybil attack, where a user creates many fake identities to gain outsized power in a voting system. For Optimism, however, this is not a concern, as delegates are pre-selected and verified. There is still potential for a direct Sybil attack among colluding delegates who decide to average their vote across multiple projects; however, this comes with significant counterparty risk (Lalley and Weyl, 2018). We will consider these factors in assessing the effectiveness of quadratic voting as a voting mechanism in Optimism’s RetroPGF setup.
          </p>

          <h3>Jensen-Meckling Free Riders</h3>
          <p className="section-paragraph">
            One further consideration that we will take into account in our evaluation of Optimism’s voting designs is the question of participation and “free riders.” DAOs today are often plagued by a lack of participation and “voter apathy,” which in turn poses centralization risks. Moreover, as Strnad suggests in “Economic DAO Governance: A Contestable Control Approach,” this low participation bears a measurable economic cost in the form of Jensen-Meckling Free Riders.
          </p>

          <p className="section-paragraph">
            In effect, although all shareholders (or tokenholders) reap the benefits of value accrual to a DAO, only those that participate in the decision-making process, the voting delegates, bear the costs of time, energy, and deliberation (Jensen and Meckling, 1976). Mechanisms that encourage either (1) increased voter participation, such as liquid democracy, or (2) increase the benefits accrued to those that participate, such as Strnad’s innovative auction approach, would decrease the value captured by free riders, aligning the incentives between those that work for these benefits and those that reap the rewards.
          </p>
        </>
      ) : null}

      {/* Show More / Show Less button */}
      <button className="show-more-button" onClick={toggleExpand}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

export default LiteratureReview;
