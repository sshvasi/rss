import { differenceWith, isEmpty, uniqueId } from 'lodash';
import axios from 'axios';

import parseRss from './parser.js';
import processStates from './constants.js';

const PROXY_URL = 'https://allorigins.hexlet.app';
const POSTS_REQUEST_TIMER = 5000;

const normalizeUrl = (url) => {
  const normalizedUrl = new URL('/get', PROXY_URL);
  normalizedUrl.searchParams.set('disableCache', 'true');
  normalizedUrl.searchParams.set('url', url);
  return normalizedUrl.toString();
};

const normalizeFeed = (feed) => ({
  id: uniqueId(),
  ...feed,
});

// prettier-ignore
const normalizePosts = (posts, options = {}) => posts.map((post) => ({
  id: uniqueId(),
  ...post,
  ...options,
}));

const loadFeed = async (url) => {
  const normalUrl = normalizeUrl(url);
  const response = await axios.get(normalUrl);
  return parseRss(response.data.contents);
};

const loadPosts = async (state) => {
  const feedPromises = state.rssUrls.map((url) => loadFeed(url));
  const results = await Promise.all(feedPromises);
  return results.flatMap(({ posts }, index) => {
    const currentFeed = state.feeds[index];
    return normalizePosts(posts, { feedId: currentFeed.id });
  });
};

const listenForNewPosts = async (state) => {
  try {
    const posts = await loadPosts(state);
    const uniquePosts = differenceWith(
      posts,
      state.posts,
      (newPost, oldPost) => newPost.title === oldPost.title,
    );
    if (isEmpty(uniquePosts)) return;
    state.posts = [...uniquePosts, ...state.posts];
  } finally {
    setTimeout(() => listenForNewPosts(state), POSTS_REQUEST_TIMER);
  }
};

const fetchRss = async (url, state) => {
  try {
    const { title, description, posts } = await loadFeed(url);
    const normalizedFeed = normalizeFeed({ title, description });
    const normalizedPosts = normalizePosts(posts, {
      feedId: normalizedFeed.id,
    });
    state.processStateError = null;
    state.processState = processStates.finished;
    state.rssUrls = [url, ...state.rssUrls];
    state.feeds = [normalizedFeed, ...state.feeds];
    state.posts = [...normalizedPosts, ...state.posts];
    state.form.processState = processStates.finished;
  } catch (error) {
    if (error.isAxiosError) {
      state.processStateError = 'errors.app.network';
    } else if (error.isParseError) {
      state.processStateError = 'errors.app.rssParser';
    } else {
      state.processStateError = 'errors.app.unknown';
      console.error(`Unknown error type: ${error.message}.`);
    }
    state.processState = processStates.failed;
    state.form.processState = processStates.initial;
  }
};

export { listenForNewPosts, fetchRss };
