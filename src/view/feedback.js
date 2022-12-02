import processStates from '../utils/constants.js';

const renderFeedback = (state, elements, i18nextInstance) => {
  const { messages } = elements.containers;
  messages.textContent = '';
  messages.classList.remove('show', 'text-danger', 'text-success');

  if (state.processState === processStates.failed) {
    messages.textContent = i18nextInstance.t(`${state.processStateError}`);
    messages.classList.add('text-danger', 'show');
  }

  if (state.processState === processStates.finished) {
    messages.textContent = i18nextInstance.t('messages.app.addRSS');
    messages.classList.add('text-success', 'show');
  }

  if (state.form.processState === processStates.failed) {
    messages.textContent = i18nextInstance.t(`${state.form.processStateError}`);
    messages.classList.add('text-danger', 'show');
  }
};

export default renderFeedback;
