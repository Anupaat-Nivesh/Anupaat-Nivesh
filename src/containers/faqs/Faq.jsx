import React, { useState } from 'react'
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";


const Faq = ({ question, answer }) => {
    const [show, setShow] = useState(false);/*faqs*/
    return (

        <article className='faq' onClick={() => setShow(prev => !prev)}>
            <div>

                <span className="faqs__icon">
                    {
                        show ? <AiOutlineMinus /> : <AiOutlinePlus className='icon' />
                    }
                </span>
            </div>

            <div className="faq_question-answer" >
                <h4 className="faq_question">{question}</h4>

                {show && <p className="faq_answer">{answer}</p>}
            </div>
        </article>

    )
}

export default Faq

