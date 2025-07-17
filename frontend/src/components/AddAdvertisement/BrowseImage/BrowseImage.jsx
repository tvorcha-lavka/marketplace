import { useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import { Oval } from 'react-loader-spinner';

import ModalBtnCross from '../../ButtonElements/ModalBtnCross/ModalBtnCross';
import showToast from '../../Toasts/showToast';

import { useImageUploader } from '../../../hooks/useImageUploader';

import css from './BrowseImage.module.css';

export default function BrowseImage() {
  const [selectedFiles, setSelectedFiles] = useState(() => {
    const saved = sessionStorage.getItem('ad_selectedFiles');
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.from({ length: 10 }, (_, i) => parsed[i] || undefined);
  });
  const [loadingStates, setLoadingStates] = useState(Array(10).fill(false));

  const { uploadFile, deleteFile } = useImageUploader();
  const maxFiles = 10;
  const fileInputsRef = useRef([]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileSelect = async (files, slotIndex) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length >= maxFiles) {
      showToast('Перевищено ліміт завантажень!', 'error');
      return;
    }

    if (validFiles.length !== fileArray.length) {
      showToast('Файл перевищує 5 МБ!', 'error');
      return;
    }

    const selectedFile = validFiles[0];
    if (!selectedFile) return;

    const updatedLoading = [...loadingStates];
    updatedLoading[slotIndex] = true;
    setLoadingStates(updatedLoading);

    try {
      await uploadFile(selectedFile, slotIndex);

      const base64Image = await fileToBase64(selectedFile);

      setTimeout(() => {
        const updatedFiles = [...selectedFiles];
        updatedFiles[slotIndex] = base64Image;
        setSelectedFiles(updatedFiles);
        sessionStorage.setItem(
          'ad_selectedFiles',
          JSON.stringify(updatedFiles)
        );

        updatedLoading[slotIndex] = false;
        setLoadingStates([...updatedLoading]);

        showToast('Зображення завантажено!', 'success');
      }, 1000);
    } catch (error) {
      updatedLoading[slotIndex] = false;
      setLoadingStates([...updatedLoading]);
    }
  };

  const handleClick = (index) => {
    fileInputsRef.current[index]?.click();
  };

  const handleDelete = (index) => {
    deleteFile(index, () => {
      const updatedFiles = [...selectedFiles];
      updatedFiles[index] = undefined; 
      setSelectedFiles(updatedFiles);
      sessionStorage.setItem('ad_selectedFiles', JSON.stringify(updatedFiles));
    });
  };

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Завантажте фото</h3>
      <p className={css.advertSpan}>
        ({selectedFiles.filter(Boolean).length} з {maxFiles} завантажено)
      </p>
      <ul className={css.fotoList}>
        {Array.from({ length: maxFiles }).map((_, index) => {
          const base64 = selectedFiles[index];
          const isFilled = Boolean(base64);
          const isLoading = loadingStates[index];

          return (
            <li
              className={css.fotoItem}
              key={index}
              onClick={() => handleClick(index)}
            >
              {isLoading ? (
                <Oval
                  visible={true}
                  height="79"
                  width="79"
                  strokeWidth={3}
                  strokeWidthSecondary={3}
                  color="var(--primary-yellow)"
                  secondaryColor="var(--primary-yellow-light)"
                  ariaLabel="oval-loading"
                />
              ) : isFilled ? (
                <div className={css.previewWrapper}>
                  <ModalBtnCross
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className={css.deleteBtn}
                    iconClassName={css.deleteIcon}
                  />
                  <img
                    src={base64}
                    alt={`Зображення ${index + 1}`}
                    className={css.previewImage}
                  />
                </div>
              ) : (
                <>
                  <FiCamera className={css.iconCamera} />
                  <p className={css.text}>Завантажте</p>
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
