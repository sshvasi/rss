import onChange from 'on-change';
import renderForm from './form.js';
import renderFeeds from './feeds.js';
import renderPosts from './posts.js';
import renderFeedback from './feedback.js';
import renderModal from './modal.js';

const initView = (state, elements, i18nextInstance) => {
  const { feedForm, postPreviewModal } = elements;

  const renderMapping = {
    processState: () => renderFeedback(state, elements, i18nextInstance),
    feeds: () => renderFeeds(state, elements, i18nextInstance),
    posts: () => renderPosts(state, elements, i18nextInstance),
    'uiState.viewedPostsIds': () => renderPosts(state, elements, i18nextInstance),
    'uiState.previewPostId': () => renderModal(state, postPreviewModal, i18nextInstance),
    'form.processState': () => {
      renderForm(state, feedForm, i18nextInstance);
      renderFeedback(state, elements, i18nextInstance);
    },
  };

  return onChange(state, (path) => {
    renderMapping[path]?.();
  });
};

export default initView;
