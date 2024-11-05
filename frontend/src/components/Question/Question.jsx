import { useState } from 'react';

import { media } from '../../utils/mediaConfig';
import { faqList } from '../../utils/faqList';
import QuestionItem from '../QuestionItem/QuestionItem';

import css from './Question.module.css';

export default function Question() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className={css.container}>
      <h2 className={css.title}>
        Найчастіші питання до
        <span className={css.span_title}> Tvorcha Lavka</span>
      </h2>
      <div className={css.contentbox}>
        <div className={css.imgbox}>
          <img
            src={`${media}/page/question_img.jpg`}
            alt="Doing creative work"
            className={css.img}
          />
        </div>

        <ul className={css.accordion}>
          {faqList?.map((faqItem, id) => (
            <QuestionItem
              key={id}
              faqItem={faqItem}
              onClick={() => (id === openId ? setOpenId(null) : setOpenId(id))}
              isOpen={id === openId}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
