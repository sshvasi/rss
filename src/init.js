import * as yup from 'yup';
import i18next from 'i18next';

import initView from './view/index.js';
import { listenForNewPosts, fetchRss } from './utils/api.js';
import validate from './utils/validator.js';
import processStates from './utils/constants.js';
import resources from './locales/index.js';

const DEFAULT_LANGUAGE = 'en';

const init = async () => {
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
      viewedPostsIds: new Set(),
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
    lng: DEFAULT_LANGUAGE,
    resources: { en: resources.en },
  });

  const state = initView(initialState, elements, i18nextInstance);

  elements.containers.posts.addEventListener('click', (event) => {
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
    state.form.processStateError = null;
    state.form.processState = processStates.sending;
    const validateError = validate(rssUrl, state.rssUrls);
    if (validateError) {
      state.form.valid = false;
      state.form.processStateError = validateError.message;
      state.form.processState = processStates.failed;
      return;
    }
    fetchRss(rssUrl, state);
  });

  listenForNewPosts(state);
};

export default init;
