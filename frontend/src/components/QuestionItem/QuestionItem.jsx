import { useRef } from 'react';

import { GoChevronDown } from 'react-icons/go';

import css from './QuestionItem.module.css';

export default function QuestionItem({ faqItem, onClick, isOpen }) {
  const itemRef = useRef(null);
  return (
    <li className={css.accordion_item}>
      <button
        className={isOpen ? `${css.question_open}` : `${css.question}`}
        onClick={() => onClick()}
      >
        {faqItem.q}
        <GoChevronDown
          className={isOpen ? `${css.icon_active}` : `${css.accordion_icon}`}
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
