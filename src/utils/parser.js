const parseRss = (string) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(string, 'text/xml');
  const parseError = document.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParseError = true;
    throw error;
  }
  const channel = document.querySelector('channel');
  const titleElement = channel.querySelector('title');
  const descriptionElement = channel.querySelector('description');
  const postsElements = channel.querySelectorAll('item');
  const posts = [...postsElements].map((post) => {
    const postTitle = post.querySelector('title');
    const postLink = post.querySelector('link');
    const postDescription = post.querySelector('description');
    return {
      title: postTitle.textContent,
      link: postLink.textContent,
      description: postDescription.textContent,
    };
  });
  return {
    title: titleElement.textContent,
    description: descriptionElement.textContent,
    posts,
  };
};

export default parseRss;
