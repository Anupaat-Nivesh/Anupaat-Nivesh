import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const Faq = ({ question, answer }) => {
  const [show, setShow] = useState(false);

  return (
    <article className="faq-card">
      <button
        type="button"
        className="faq-trigger"
        aria-expanded={show}
        onClick={() => setShow((v) => !v)}
      >
        <span className="faq-trigger__icon" aria-hidden>
          {show ? <IoChevronUp size={24} /> : <IoChevronDown size={24} />}
        </span>
        <span className="faq-trigger__question">{question}</span>
      </button>
      <AnimatePresence initial={false}>
        {show ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="faq-panel-wrap"
          >
            <p className="faq-answer">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
};

export default Faq;
