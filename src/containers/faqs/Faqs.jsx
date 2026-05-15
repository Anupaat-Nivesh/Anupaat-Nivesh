import React from "react";
import { motion } from "framer-motion";
import { faqsData } from "../../data";
import "./faqs.css";
import Faq from "./Faq";

const Faqs = () => {
  return (
    <div className="faqs-page">
      <section className="faqs" aria-labelledby="faqs-main-heading">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="faqs__intro"
        >
          <h1 id="faqs-main-heading">Frequently asked questions</h1>
          <p className="faqs__lede">
            Straight answers on <strong>how we work</strong>, <strong>regulation</strong>,{" "}
            <strong>SIPs</strong>, <strong>MarketCompass</strong>, and <strong>risk</strong> — in plain
            language.
          </p>
        </motion.div>

        <div className="faqs__container section__padding">
          {faqsData.map(({ id, question, answer }) => (
            <Faq key={id} question={question} answer={answer} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Faqs;
