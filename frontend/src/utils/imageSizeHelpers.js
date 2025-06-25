export const getProcessedImages = (images = []) =>
  images.flatMap((image) => image?.processed_images || []);

export const filterImagesBySize = (images, width, height) =>
  images.filter((image) => image?.width === width && image?.height === height);

export const getSmallImages = (images) => filterImagesBySize(images, 150, 200);

export const getMediumImages = (images) => filterImagesBySize(images, 450, 600);
