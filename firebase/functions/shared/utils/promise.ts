import pLimit from 'p-limit';

const CONCURRENCY = {
  PAGE_REQUESTS: 3,
};

export const limit = pLimit(CONCURRENCY.PAGE_REQUESTS);
