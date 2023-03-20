import React from 'react'
import { faqsData } from '../../data';

import Faq from './Faq';
const Faqs = () => {
    return (
        <section className="faqs" id='faqs'>
            <h1>FAQs</h1>

            <div className="faqs__container section__padding" >
                {
                    faqsData.map(({ id, question, answer }) => {
                        return <Faq key={id} question={question} answer={answer} />

                    })
                }

            </div>
        </section>

    )
}

export default Faqs