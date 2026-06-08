import React from 'react';
import { futureBaskets } from '../../data/baskets';
import ElementalIcon from '../ElementalIcon';

export default function ComingSoonBaskets() {
  return (
    <section className="an-coming-soon" aria-labelledby="coming-soon-heading">
      <div className="an-coming-soon__head">
        <div>
          <p className="an-coming-soon__eyebrow">Roadmap</p>
          <h2 id="coming-soon-heading" className="an-coming-soon__title">
            Coming soon
          </h2>
          <p className="an-coming-soon__lead">
            More mutual fund basket strategies in research — contact us when they launch.
          </p>
        </div>
        <span className="an-coming-soon__badge">3 baskets in pipeline</span>
      </div>

      <ul className="an-coming-soon__grid">
        {futureBaskets.map((item) => (
          <li key={item.id}>
            <article className={`an-coming-soon__card an-coming-soon__card--${item.element}`}>
              <span className="an-coming-soon__status">Soon</span>
              <div className="an-coming-soon__icon">
                <ElementalIcon element={item.element} size={36} />
              </div>
              <h3 className="an-coming-soon__name">{item.name}</h3>
              <p className="an-coming-soon__tagline">{item.tagline}</p>
              <p className="an-coming-soon__note">Notify at launch</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
