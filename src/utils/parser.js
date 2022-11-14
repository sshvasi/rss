const parseRss = (string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(string, 'text/xml');
  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParseError = true;
    throw error;
  }

  const channel = doc.querySelector('channel');
  const titleElement = channel.querySelector('title');
  const descriptionElement = channel.querySelector('description');
  const itemsElements = channel.querySelectorAll('item');
  const items = [...itemsElements].map((item) => {
    const itemTitle = item.querySelector('title');
    const itemLink = item.querySelector('link');
    const itemDescription = item.querySelector('description');

    return {
      title: itemTitle.textContent,
      link: itemLink.textContent,
      description: itemDescription.textContent,
    };
  });

  return {
    title: titleElement.textContent,
    description: descriptionElement.textContent,
    items,
  };
};

export default parseRss;
