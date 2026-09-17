export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const IMAGE_SIZES = {
    ORIGINAL: 'original',
    W500: 'w500',
    W300: 'w300',
};

export const getImageUrl = (size, imagePath) => {
    if (!imagePath) return null;
    return `${IMAGE_BASE_URL}${size}/${imagePath}`;
};
