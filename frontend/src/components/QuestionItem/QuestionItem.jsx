import { useRef } from 'react';
import PropTypes from 'prop-types';
import { GoChevronDown } from 'react-icons/go';
import styles from './QuestionItem.module.css';

export default function QuestionItem({ faqItem, onClick, isOpen }) {
  const itemRef = useRef(null);
  return (
    <li className={styles.accordion_item}>
      <button
        className={isOpen ? `${styles.question_open}` : `${styles.question}`}
        onClick={() => onClick()}
      >
        {faqItem.q}

        <GoChevronDown
          className={
            isOpen ? `${styles.icon_active}` : `${styles.accordion_icon}`
          }
        />

      </button>
      <div
        className={styles.collapse}
        style={
          isOpen ? { height: itemRef.current.scrollHeight } : { height: '0' }
        }
      >
        <div className={styles.answer} ref={itemRef}>
          {faqItem.a}
        </div>
      </div>
    </li>
  );
}

QuestionItem.propTypes = {
  faqItem: PropTypes.object,
  onClick: PropTypes.func,
  isOpen: PropTypes.bool,
};
