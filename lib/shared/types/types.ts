import type { CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';

export interface GoodreadsExtractReviewTextParams {
  $: CheerioAPI;
  reviewId: string;
} 