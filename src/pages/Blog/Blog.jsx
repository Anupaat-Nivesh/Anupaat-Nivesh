import React from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

/**
 * Blog/Knowledge Hub Component
 * Structure for educational content
 * TODO: Connect to CMS or content API
 */
const Blog = () => {
  // TODO: Replace with actual blog posts from CMS/API
  const blogCategories = [
    {
      id: 'mutual-funds',
      title: 'Mutual Funds',
      description: 'Learn about mutual funds, SIP strategies, and investment basics',
      icon: '📊',
      articles: [
        { id: 1, title: 'What is SIP and How Does It Work?', slug: 'what-is-sip' },
        { id: 2, title: 'Types of Mutual Funds Explained', slug: 'types-of-mutual-funds' },
        { id: 3, title: 'SIP vs Lumpsum: Which is Better?', slug: 'sip-vs-lumpsum' }
      ]
    },
    {
      id: 'sip-basics',
      title: 'SIP Basics',
      description: 'Everything you need to know about Systematic Investment Plans',
      icon: '💰',
      articles: [
        { id: 4, title: 'How to Start Your First SIP', slug: 'how-to-start-sip' },
        { id: 5, title: 'SIP Step-Up: Increase Your Investment Over Time', slug: 'sip-step-up' },
        { id: 6, title: 'Common SIP Mistakes to Avoid', slug: 'sip-mistakes' }
      ]
    },
    {
      id: 'market-volatility',
      title: 'Market Volatility',
      description: 'Understanding market movements and staying calm during volatility',
      icon: '📈',
      articles: [
        { id: 7, title: 'Why Markets Go Up and Down', slug: 'why-markets-fluctuate' },
        { id: 8, title: 'How to Stay Calm During Market Volatility', slug: 'stay-calm-volatility' },
        { id: 9, title: 'Should You Stop SIP During Market Falls?', slug: 'continue-sip-during-falls' }
      ]
    },
    {
      id: 'goal-planning',
      title: 'Goal Planning',
      description: 'Plan for retirement, child education, and other financial goals',
      icon: '🎯',
      articles: [
        { id: 10, title: 'Retirement Planning: Start Early, Retire Rich', slug: 'retirement-planning' },
        { id: 11, title: 'Child Education Fund: How Much Do You Need?', slug: 'child-education-fund' },
        { id: 12, title: 'Goal-Based Investing: A Complete Guide', slug: 'goal-based-investing' }
      ]
    }
  ];

  return (
    <div className="blog-page">
      <section className="blog-hero section__padding">
        <div className="container">
          <h1>Financial <span className="section-heading-focus">Knowledge Hub</span></h1>
          <p className="blog-hero-description">
            Learn about mutual funds, SIP, goal planning, and smart investing strategies. 
            Educational content designed to help you make informed financial decisions.
          </p>
        </div>
      </section>

      <section className="blog-categories section__padding section__margin">
        <div className="container">
          {blogCategories.map((category) => (
            <div key={category.id} className="blog-category-card" data-aos="fade-up">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h2>{category.title}</h2>
              </div>
              <p className="category-description">{category.description}</p>
              <ul className="article-list">
                {category.articles.map((article) => (
                  <li key={article.id}>
                    <Link to={`/blog/${article.slug}`} className="article-link">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to={`/blog/category/${category.id}`} className="btn btn-primary">
                View All {category.title} Articles
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="blog-cta section__padding">
        <div className="container">
          <h2>Need Personalized Guidance?</h2>
          <p>Our financial advisors can help you create a customized investment plan</p>
          <div className="blog-cta-buttons">
            <Link to="/contact" className="btn btn-primary">Talk to an Advisor</Link>
            <Link to="#portfolio-review" className="btn btn-secondary">Get Free Portfolio Review</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

