export const API_URL = 'https://tracker.desired-techs.com/api';
export const API_URL2 = 'https://desired-techs.com/ExpenseManager/Api';
export const IMG_URL = 'https://tracker.desired-techs.com';
export const ARTICLES_URL = 'https://www.desired-techs.com/job-bank/images/articles';
export const TIP_URL = 'https://www.desired-techs.com/job-bank/images/tips_and_tricks';

export const convertToSlug = (text) => {
    return text
        .toLowerCase()                      // Convert the text to lowercase
        .trim()                             // Remove any leading or trailing whitespace
        .replace(/[\s-]+/g, '-')            // Replace spaces and hyphens with a single hyphen
        .replace(/[^a-z0-9-]/g, '')         // Remove all non-alphanumeric characters except hyphens
        .replace(/--+/g, '-')               // Replace multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, '');           // Remove hyphens from the start and end
};