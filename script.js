(() => {
  const storageKey = 'effectiveCommunicationBookmarks';
  const modal = document.getElementById('bookmarkModal');
  const savedList = document.getElementById('savedList');
  const count = document.getElementById('bookmarkCount');
  const toast = document.getElementById('toast');
  let toastTimer;

  const getSaved = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
    catch (_) { return []; }
  };
  const setSaved = (items) => {
    localStorage.setItem(storageKey, JSON.stringify(items));
    render();
  };
  const cards = () => [...document.querySelectorAll('.content-card[data-title]')];
  const cardFor = id => cards().find(card => card.id === id);

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
  }
  function render() {
    const saved = getSaved();
    count.textContent = saved.length;
    document.querySelectorAll('.save-btn').forEach(button => {
      const active = saved.includes(button.dataset.bookmark);
      button.classList.toggle('saved', active);
      button.innerHTML = `${active ? '★' : '☆'} <span>${active ? 'Saved' : 'Save'}</span>`;
      button.setAttribute('aria-pressed', String(active));
    });
    savedList.replaceChildren();
    const valid = saved.map(cardFor).filter(Boolean);
    if (!valid.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No bookmarks yet. Save a topic and it will show up here.';
      savedList.append(empty);
      return;
    }
    valid.forEach(card => {
      const item = document.createElement('div');
      item.className = 'saved-item';
      const info = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = card.dataset.title;
      const category = document.createElement('small');
      category.textContent = card.dataset.category;
      info.append(title, category);
      const actions = document.createElement('div');
      const open = document.createElement('button');
      open.type = 'button';
      open.textContent = 'Open →';
      open.addEventListener('click', () => {
        modal.hidden = true;
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => setSaved(getSaved().filter(id => id !== card.id)));
      actions.append(open, remove);
      item.append(info, actions);
      savedList.append(item);
    });
  }
  function openModal() {
    render();
    modal.hidden = false;
    document.getElementById('closeBookmarks').focus();
  }
  function closeModal() { modal.hidden = true; }

  document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.bookmark;
      const saved = getSaved();
      if (saved.includes(id)) {
        setSaved(saved.filter(item => item !== id));
        notify('Removed from bookmarks');
      } else {
        setSaved([...saved, id]);
        notify('Added to bookmarks');
      }
    });
  });
  document.getElementById('openBookmarks').addEventListener('click', openModal);
  document.getElementById('heroBookmarks').addEventListener('click', openModal);
  document.getElementById('closeBookmarks').addEventListener('click', closeModal);
  document.getElementById('clearBookmarks').addEventListener('click', () => {
    setSaved([]);
    notify('Bookmarks cleared');
  });
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.top-links');
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  render();
})();