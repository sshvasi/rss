import onChange from 'on-change';
import processStates from './constants.js';

const render = (state, elements, i18nextInstance) => (path) => {
  const { input, submitButton } = elements.feedForm;

  submitButton.textContent = i18nextInstance.t('buttons.addFeed');

  if (path !== 'form.processState') {
    return;
  }

  if (state.form.valid) {
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
  }

  if (state.form.processState === processStates.sending) {
    input.readOnly = true;
    submitButton.disabled = true;
  } else {
    input.readOnly = false;
    submitButton.disabled = false;
  }

  if (state.form.processState === processStates.initial) {
    input.focus();
  }

  if (state.form.processState === processStates.finished) {
    input.value = '';
    input.focus();
  }
};

const initView = (state, elements, i18nextInstance) =>
  onChange(state, render(state, elements, i18nextInstance));

export default initView;
