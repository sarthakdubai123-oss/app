const STORAGE_KEY = 'minimal-reminders-v1';

const form = document.getElementById('reminder-form');
const input = document.getElementById('reminder-input');
const list = document.getElementById('reminder-list');
const emptyState = document.getElementById('empty-state');
const template = document.getElementById('reminder-item-template');

let reminders = loadReminders();
render();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  reminders.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  input.value = '';
  persistAndRender();
});

function loadReminders() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReminders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

function persistAndRender() {
  saveReminders();
  render();
}

function toggleReminder(id) {
  reminders = reminders.map((reminder) =>
    reminder.id === id ? { ...reminder, done: !reminder.done } : reminder
  );
  persistAndRender();
}

function deleteReminder(id) {
  reminders = reminders.filter((reminder) => reminder.id !== id);
  persistAndRender();
}

function render() {
  list.textContent = '';

  reminders.forEach((reminder) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector('input[type="checkbox"]');
    const text = item.querySelector('.text');
    const deleteButton = item.querySelector('.delete');

    checkbox.checked = reminder.done;
    checkbox.addEventListener('change', () => toggleReminder(reminder.id));

    text.textContent = reminder.text;

    if (reminder.done) {
      item.classList.add('done');
    }

    deleteButton.addEventListener('click', () => deleteReminder(reminder.id));

    list.appendChild(item);
  });

  emptyState.classList.toggle('hidden', reminders.length > 0);
}
