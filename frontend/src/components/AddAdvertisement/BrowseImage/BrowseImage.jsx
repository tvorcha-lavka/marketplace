import { useRef, useState, useEffect } from 'react';
import { FiCamera } from 'react-icons/fi';
import { GoAlert } from 'react-icons/go';
import { toast } from 'react-hot-toast';

import { useImageUploader } from '../../../hooks/useImageUploader';

import css from './BrowseImage.module.css';

export default function BrowseImage({ shouldReset }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { uploadFile } = useImageUploader();

  const maxFiles = 10;
  const fileInputsRef = useRef([]);

  const handleFileSelect = (files, slotIndex) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== fileArray.length) {
      toast.custom(() => (
        <div
          style={{
            backgroundColor: 'var(--error-light-red)',
            color: 'var(--default-black)',
            width: '279px',
            height: '64px',
            padding: '20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: 'var(--font-size-tiny)',
            fontWeight: 'var(--font-weight-bold)',
            borderLeft:
              'var(--border-width-biggest) var(--border-style) var(--primary-yellow)',
            boxShadow: 'var(--cart-shadow)',
          }}
        >
          <GoAlert style={{ fontSize: '32px' }} />
          Деякі файли перевищують 5MB і були пропущені.
        </div>
      ));
    }

    const selectedFile = validFiles[0];
    if (!selectedFile) return;

    const updatedFiles = [...selectedFiles];
    updatedFiles[slotIndex] = selectedFile;
    setSelectedFiles(updatedFiles);

    uploadFile(selectedFile, slotIndex);
  };

  const handleClick = (index) => {
    fileInputsRef.current[index]?.click();
  };

  useEffect(() => {
    if (shouldReset) {
      setSelectedFiles([]);
      fileInputsRef.current.forEach((input) => {
        if (input) input.value = '';
      });
    }
  }, [shouldReset]);

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Завантажте фото</h3>
      <p className={css.advertSpan}>
        ({selectedFiles.filter(Boolean).length} з {maxFiles} завантажено)
      </p>
      <ul className={css.fotoList}>
        {Array.from({ length: maxFiles }).map((_, index) => {
          const file = selectedFiles[index];
          const isFilled = Boolean(file);

          return (
            <li className={css.fotoItem} key={index}>
              {isFilled ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Зображення ${index + 1}`}
                  className={css.previewImage}
                />
              ) : (
                <>
                  <FiCamera className={css.iconCamera} />
                  <button
                    type="button"
                    className={css.btnFoto}
                    onClick={() => handleClick(index)}
                  >
                    Завантажте
                  </button>
                  <p className={css.textFoto}>
                    Фото товару в<br /> повному розмірі
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={(el) => (fileInputsRef.current[index] = el)}
                style={{ display: 'none' }}
                onChange={({ target }) => handleFileSelect(target.files, index)}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
