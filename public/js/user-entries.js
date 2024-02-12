
async function deleteEntry(entryId) {
  try {
    const url = `/api/delete-entry/${entryId}`;
    console.log('Delete URL:', url);

    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete entry: ${response.status} ${response.statusText}, ${errorText}`);
    }

    console.log('Entry deleted successfully.');

    // Refresh the left column after deleting an entry
    renderDiaryEntries();

    // Display the "Create New Entry" form in the right column
    showCreateNewForm();
  } catch (error) {
    console.error('Error deleting entry:', error);
  }
}



document.getElementById('diaryEntriesList').addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-entry-btn');
  if (deleteButton) {
    const entryId = deleteButton.getAttribute('data-entry-id');
    deleteEntry(entryId);
  }
});



// Function to render entries with delete button
function renderEntryWithDeleteButton(entry) {
  const entryLink = document.createElement('a');
  entryLink.href = '#';
  entryLink.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');
  entryLink.setAttribute('data-entry-id', entry._id);

  entryLink.innerHTML = `
    <span>${entry.title}</span>
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-warning" id="editButton">Edit</button>
      <button type="button" class="btn btn-danger delete-entry-btn" data-entry-id="${entry._id}">Delete</button>
    </div>
  `;

  entryLink.addEventListener('click', () => renderCurrentEntry(entry));

  return entryLink;
}


// Modify renderDiaryEntries to use the new rendering function
async function renderDiaryEntries() {
  const diaryEntriesList = document.getElementById('diaryEntriesList');

  const diaryEntries = await fetchDiaryEntries();

  // Reverse the order of entries
  const reversedEntries = diaryEntries.slice().reverse();

  // Clear the existing list
  diaryEntriesList.innerHTML = "";

  reversedEntries.forEach(entry => {
    const entryElement = renderEntryWithDeleteButton(entry);
    diaryEntriesList.appendChild(entryElement);
  });
}




let editQuillEditor = null;
let newQuillEditor = null;
let editingEntryId = null;



async function fetchDiaryEntries() {
  try {
    const response = await fetch('/api/user-entries');
    if (response.ok) {
      const data = await response.json();
      return data.entries;
    } else {
      console.error('Error response text:', await response.text());
      throw new Error('Failed to fetch diary entries');
    }
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return [];
  }
}

async function renderDiaryEntries() {
  const diaryEntriesList = document.getElementById('diaryEntriesList');

  const diaryEntries = await fetchDiaryEntries();

  // Reverse the order of entries
  const reversedEntries = diaryEntries.slice().reverse();

  // Clear the existing list
  diaryEntriesList.innerHTML = "";

  reversedEntries.forEach(entry => {
    const entryLink = document.createElement('a');
    entryLink.href = '#';
    entryLink.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-white'); // Add bg-dark and text-white classes here

    entryLink.textContent = entry.title;
    entryLink.setAttribute('data-entry-id', entry._id);

    entryLink.addEventListener('click', () => renderCurrentEntry(entry));

    diaryEntriesList.appendChild(entryLink);
  });


}

document.getElementById('diaryEntriesList').addEventListener('click', (event) => {
  console.log('Clicked on:', event.target);
});


async function renderCurrentEntry(entry) {
  const currentEntry = document.getElementById('currentEntry');
  const editEntryForm = document.getElementById('editEntryForm');
  const editTitleInput = document.getElementById('editTitle');

  let editingEntryId = entry._id;

  if (!editQuillEditor) {
    editQuillEditor = new Quill('#editQuillEditor', {
      theme: 'snow',
      placeholder: 'Start typing here...',
    });

    // Event listener for the Save button in the edit entry form
    document.getElementById('saveEditButton').addEventListener('click', async () => {
      await saveChanges(editingEntryId);
      renderDiaryEntries(); // Refresh the left column after saving changes
    });
  }

  currentEntry.innerHTML = `
    <h1>${entry.title}</h1>
    <p>${entry.content}</p>
    <div class="btn-group">
      <button type="button" class="btn btn-warning" id="editButton">Edit</button>
    </div>
  `;


  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add('btn', 'btn-danger', 'delete-entry-btn');
  deleteButton.setAttribute('data-entry-id', entry._id);
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteEntry(entry._id);
  });

  currentEntry.querySelector('.btn-group').appendChild(deleteButton);

  document.getElementById('cancelEditButton').addEventListener('click', () => {
    cancelEditEntry(); 
  });

  document.getElementById('editButton').addEventListener('click', () => {
    editTitleInput.value = entry.title;
    editQuillEditor.root.innerHTML = entry.content;

    currentEntry.style.display = 'none';
    editEntryForm.style.display = 'block';
  });
}


async function saveChanges(entryId) {
  const editTitleInput = document.getElementById('editTitle');
  const updatedEntry = {
    title: editTitleInput.value,
    content: editQuillEditor.root.innerHTML,
  };

  try {
    if (!entryId) {
      console.error('No entry selected for editing.');
      return;
    }

    console.log(`Attempting to save changes for entry: ${entryId}`);

    const response = await fetch(`/api/update-entry/${entryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEntry),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update entry: ${response.status} ${response.statusText}, ${errorText}`);
    }

    console.log('Editing complete.');

    // Reset the form and keep the current editingEntryId
    editTitleInput.value = '';
    editQuillEditor.root.innerHTML = '';

    // Refresh the left column after saving changes
    renderDiaryEntries();

    // Refresh the right column with the updated content
    renderCurrentEntry(updatedEntry);

    // Hide the edit form
    const currentEntry = document.getElementById('currentEntry');
    const editEntryForm = document.getElementById('editEntryForm');
    currentEntry.style.display = 'block';
    editEntryForm.style.display = 'none';
  } catch (error) {
    console.error('Error updating entry:', error);
  }
}

async function saveNewEntry() {
  const newTitleInput = document.getElementById('newTitle');
  const newEntry = {
    title: newTitleInput.value,
    content: newQuillEditor.root.innerHTML,
  };

  try {
    const response = await fetch('/api/save-entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
    });

    if (!response.ok) {
      throw new Error(`Failed to create entry: ${response.status} ${response.statusText}`);
    }

    // Call the cancelNewEntry function to hide the new entry form and display the current entry
    cancelNewEntry();

    // Refresh the left column after creating a new entry
    renderDiaryEntries();
  } catch (error) {
    console.error('Error creating new entry:', error);
  }
}

function showCreateNewForm() {
  const newEntryForm = document.getElementById('newEntryForm');
  const currentEntry = document.getElementById('currentEntry');

  if (editingEntryId) {
    saveChanges();
  }

  newEntryForm.style.display = 'block';
  currentEntry.style.display = 'none';

  if (!newQuillEditor) {
    newQuillEditor = new Quill('#newQuillEditor', {
      theme: 'snow',
      placeholder: 'Start typing here...',
    });
  }

  newQuillEditor.root.innerHTML = ''; // Clear Quill editor content for new entry
  editingEntryId = null; 
  currentEntryTitle.innerHTML = 'Create New Entry';

}

function clearNewEntryForm() {
  const newTitleInput = document.getElementById('newTitle');
  newTitleInput.value = '';
  newQuillEditor.root.innerHTML = '';
  editingEntryId = null;
}

function cancelNewEntry() {
  const newEntryForm = document.getElementById('newEntryForm');
  const currentEntry = document.getElementById('currentEntry');

  newEntryForm.style.display = 'none';
  currentEntry.style.display = 'block';
  clearNewEntryForm();
}

document.getElementById('newEntryButton').addEventListener('click', () => {
  showCreateNewForm();
});

document.getElementById('saveNewButton').addEventListener('click', async () => {
  await saveNewEntry();
});

document.getElementById('cancelNewButton').addEventListener('click', () => {
  cancelNewEntry();
});


function cancelEditEntry() {
  const currentEntry = document.getElementById('currentEntry');
  const editEntryForm = document.getElementById('editEntryForm');

  // Reset the form and set editingEntryId to null
  const editTitleInput = document.getElementById('editTitle');
  editTitleInput.value = '';
  editQuillEditor.root.innerHTML = '';
  editingEntryId = null;

  // Hide the edit form and display the current entry
  currentEntry.style.display = 'block';
  editEntryForm.style.display = 'none';
}

// Initial rendering of diary entries
renderDiaryEntries();