import { differenceWith, isEmpty, uniqueId } from 'lodash';
import axios from 'axios';
import parseRss from './parser.js';
import processStates from './constants.js';

const getProxyUrl = (url) => {
  const baseUrl = 'https://allorigins.hexlet.app/get';
  const proxyUrl = new URL(baseUrl);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);

  return proxyUrl.toString();
};

const normalizeFeed = (feed) => ({
  ...feed,
  id: uniqueId(),
});

const normalizePosts = (posts, options = {}) => posts.map((post) => ({
  ...post,
  id: uniqueId(),
  ...options,
}));

const loadFeed = async (url) => {
  const proxyUrl = getProxyUrl(url);
  const response = await axios.get(proxyUrl);

  return parseRss(response.data.contents);
};

const loadPosts = async (state) => {
  const feedPromises = state.rssUrls.map((url) => loadFeed(url));
  const responses = await Promise.all(feedPromises);

  return responses.flatMap(({ items }, index) => {
    const currentFeed = state.feeds[index];
    return normalizePosts(items, { feedId: currentFeed.id });
  });
};

const listenForNewPosts = async (state) => {
  const timeoutMs = 5000;

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
    setTimeout(() => listenForNewPosts(state), timeoutMs);
  }
};

const fetchRss = async (url, state) => {
  try {
    const { title, description, items } = await loadFeed(url);
    const normalizedFeed = normalizeFeed({ title, description });
    const normalizedPosts = normalizePosts(items, {
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
