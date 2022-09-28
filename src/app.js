import initView from './view.js';
import validate from './validate.js';

const app = () => {
  const initialState = {
    rssUrls: [],
    feeds: [],
    posts: [],
    processStateError: null,
    processState: 'filling',
    form: {
      valid: true,
      processStateError: null,
      processState: 'filling',
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

  const state = initView(initialState, elements);

  elements.feedForm.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const rssUrl = formData.get('rss-input');

    state.processStateError = null;
    state.processState = 'filling';
    state.form.valid = true;
    state.form.processState = 'sending';
    state.form.processStateError = null;

    const validationError = validate(rssUrl, state.rssUrls);

    if (validationError) {
      state.form.valid = false;
      state.form.processState = 'failed';
      state.form.processStateError = validationError.message;
    }

    // fetchRss(rssUrl, state);
  });

  // listenToNewPosts(state);
};

export default app;
