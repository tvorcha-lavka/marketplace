import { useRef } from 'react';

import { GoChevronDown } from 'react-icons/go';

import css from './QuestionItem.module.css';

export default function QuestionItem({ faqItem, onClick, isOpen }) {
  const itemRef = useRef(null);
  return (
    <li className={css.accordionItem}>
      <button
        className={isOpen ? `${css.questionOpen}` : `${css.question}`}
        onClick={() => onClick()}
      >
        {faqItem.q}
        <GoChevronDown
          className={isOpen ? `${css.iconActive}` : `${css.accordionIcon}`}
        />
      </button>
      <div
        className={css.collapse}
        style={
          isOpen ? { height: itemRef.current.scrollHeight } : { height: '0' }
        }
      >
        <div className={css.answer} ref={itemRef}>
          {faqItem.a}
        </div>
      </div>
    </li>
  );
}
