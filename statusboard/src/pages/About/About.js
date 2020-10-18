import React from 'react';
import { aboutSections } from './aboutSections';

function About() {
  return (
    <div className="text-content">
      <h1>About</h1>
      <p>
        The Brigade Project Index is a collaborative project involving core
        contributors from across many brigades. We design, develop, and maintain
        a set of tools and practices for mapping out all the work being done on
        projects across the entire global network of civic hacking organizations
        and Code for America brigades. Our core goal is to publish a rich and
        constantly-updated database of projects that any number of network
        projects can use as a data source to help us get better connected.
      </p>
      <ul>
        {aboutSections.map((s) => (
          <li key={`hash-link-${s.id}`}>
            <a href={`#${s.id}`}>{s.title}</a>
          </li>
        ))}
      </ul>
      {aboutSections.map((s) => (
        <div key={`about-section-${s.id}`}>
          <h2 id={s.id}>{s.title}</h2>
          {s.content}
        </div>
      ))}{' '}
    </div>
  );
}

export default About;
