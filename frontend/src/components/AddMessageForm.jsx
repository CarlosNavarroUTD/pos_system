import React, { useState } from 'react';

function AddMessageForm({ onAddMessage, onClose, existingTags }) {
  const [newMessage, setNewMessage] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMessage(newMessage, newTag);
    setNewMessage('');
    setNewTag('');
    onClose(); // Close the form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="p-2 border rounded"
        placeholder="Enter your message"
        required
      />
      <div className="flex space-x-2">
        <input
          list="tags"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="p-2 border rounded flex-grow"
          placeholder="Add or select a tag"
        />
        <datalist id="tags">
          {existingTags.map((tag, index) => (
            <option key={index} value={tag} />
          ))}
        </datalist>
      </div>
      <button type="submit" className="p-2 bg-green-500 text-white rounded-lg">
        Add Message
      </button>
    </form>
  );
}

export default AddMessageForm;