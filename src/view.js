import onChange from 'on-change';

const render = (elements) => (path, state) => {
  const { input, submitButton } = elements.feedForm;

  if (path !== 'form.processState') {
    return;
  }

  if (state.form.valid) {
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
  }

  if (state.form.processState === 'sending') {
    input.readOnly = true;
    submitButton.disabled = true;
  } else {
    input.readOnly = false;
    submitButton.disabled = false;
  }

  if (state.form.processState === 'filling') {
    input.focus();
  }

  if (state.form.processState === 'finished') {
    input.value = '';
    input.focus();
  }
};

const initView = (state, elements) => onChange(state, (path) => render(elements)(path, state));

export default initView;
