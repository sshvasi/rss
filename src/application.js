import * as yup from 'yup';
import i18next from 'i18next';
import initView from './view/index.js';
import { listenForNewPosts, fetchRss } from './services.js';
import validate from './validator.js';
import processStates from './constants.js';
import resources from './locales/index.js';

const app = async () => {
  const defaultLanguage = 'en';

  const initialState = {
    rssUrls: [],
    feeds: [],
    posts: [],
    processStateError: null,
    processState: processStates.initial,
    form: {
      valid: true,
      processStateError: null,
      processState: processStates.initial,
    },
    uiState: {
      viewedPostsIds: [],
      previewPostId: null,
    },
  };

  const elements = {
    feedForm: {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('.rss-input'),
      submitButton: document.querySelector('.rss-add'),
    },
    containers: {
      messages: document.querySelector('.rss-messages'),
      feeds: document.querySelector('.rss-feeds'),
      posts: document.querySelector('.rss-posts'),
    },
    postPreviewModal: {
      title: document.querySelector('.rss-modal-title'),
      body: document.querySelector('.rss-modal-body'),
      closeButton: document.querySelector('.rss-modal-close'),
      readMoreLink: document.querySelector('.rss-modal-more'),
    },
  };

  yup.setLocale(resources.yup);

  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: defaultLanguage,
    resources: { en: resources.en },
  });

  const state = initView(initialState, elements, i18nextInstance);

  elements.containers.posts.addEventListener('click', (event) => {
    event.preventDefault();
    const previewPostId = event.target.dataset.postId;
    if (!previewPostId) return;
    state.uiState.previewPostId = previewPostId;
    state.uiState.viewedPostsIds = state.uiState.viewedPostsIds.add(previewPostId);
  });

  elements.feedForm.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const rssUrl = formData.get('add-rss');
    state.processStateError = null;
    state.processState = processStates.initial;
    state.form.valid = true;
    state.form.processState = processStates.sending;
    state.form.processStateError = null;
    const validationError = validate(rssUrl, state.rssUrls);
    if (validationError) {
      state.form.valid = false;
      state.form.processState = processStates.failed;
      state.form.processStateError = validationError.message;
    }
    fetchRss(rssUrl, state);
  });

  listenForNewPosts(state);
};

export default app;
