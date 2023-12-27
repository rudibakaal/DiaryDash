document.getElementById('journal-form').addEventListener('submit', function(event) {
  event.preventDefault();

  var title = prompt('Enter a title for your entry:'); // Use a proper UI for this later
  var content = quill.root.innerHTML;

  fetch('/api/save-entry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: title, content: content }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // maybe perform actions after successfully saving the entry later
  })
  .catch(error => console.error('Error:', error));
});
