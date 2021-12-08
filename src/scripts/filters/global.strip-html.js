export default {
  name: 'stripHtml',
  filter: value => {
    const div = document.createElement('div');
    div.innerHTML = value;
    const text = div.textContent || div.innerText || '';
    return text;
  }
}
