import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import initView from './view.js';
import processStates from './constants.js';
import validate from './validate.js';

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
      submitButton: document.querySelector('.rss-submit'),
    },
  };

  const i18nextInstance = i18next.createInstance();

  yup.setLocale(resources.yup);

  await i18nextInstance.init({
    lng: defaultLanguage,
    resources: { en: resources.en },
  });

  const state = initView(initialState, elements, i18nextInstance);

  elements.feedForm.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const rssUrl = formData.get('rss-input');

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

    // fetchRss(rssUrl, state);
  });

  // listenToNewPosts(state);
};

export default app;
