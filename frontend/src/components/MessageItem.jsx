import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTag } from '@fortawesome/free-solid-svg-icons';
import Tooltip from './Tooltip';  // Asegúrate de importar el componente Tooltip

function MessageItem({ message, tags, onAddTag, onEditMessage, onDeleteMessage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.contenido);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const clickTimeoutRef = useRef(null);
  const tagInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (tagInputRef.current && !tagInputRef.current.contains(event.target)) {
        setShowTagInput(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (e) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setIsEditing(true);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        try {
          navigator.clipboard.writeText(message.contenido);
          setTooltipMessage('Copied to clipboard!');
          setTooltipPosition({ x: e.clientX, y: e.clientY });
          setTimeout(() => setTooltipMessage(''), 1500);
        } catch (error) {
          console.error('Failed to copy: ', error);
          setTooltipMessage('Unable to copy. Please try again.');
          setTooltipPosition({ x: e.clientX, y: e.clientY });
          setTimeout(() => setTooltipMessage(''), 1500);
        }
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      onEditMessage(message.id, editedContent);
      setIsEditing(false);
      setTooltipMessage('Message edited successfully');
      setTimeout(() => setTooltipMessage(''), 1500);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (newTag.trim() !== '') {
      try {
        await onAddTag(message.id, newTag.trim());
        setNewTag('');
        setShowTagInput(false);
        setTooltipMessage('Tag added successfully');
        setTimeout(() => setTooltipMessage(''), 1500);
      } catch (error) {
        console.error('Failed to add tag: ', error);
        setTooltipMessage('Failed to add tag. Please try again.');
        setTimeout(() => setTooltipMessage(''), 1500);
      }
    }
  };

  return (
    <div className="p-4 border rounded my-2 relative" onClick={handleClick}>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleEdit}
          className="w-full p-2 border rounded"
        />
      ) : (
        <p>{message.contenido}</p>
      )}

      {tooltipMessage && <Tooltip message={tooltipMessage} position={tooltipPosition} />}

      <div className="mt-2 flex flex-wrap gap-2">
        {message.tags && message.tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {tag.nombre}
          </span>
        ))}
      </div>

      <div className="absolute bottom-2 right-2 flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(!isEditing);
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteMessage(message.id);
            setTooltipMessage('Message deleted');
            setTooltipPosition({ x: e.clientX, y: e.clientY });
            setTimeout(() => setTooltipMessage(''), 1500);
          }}
          className="text-red-500 hover:text-red-700"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <div ref={tagInputRef}>
          {showTagInput ? (
            <form onSubmit={handleAddTag} className="inline-flex">
              <input
                list="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="p-1 border rounded text-sm"
                placeholder="Add tag"
                autoFocus
              />
              <datalist id="tags">
                {tags.map((tag, index) => (
                  <option key={index} value={tag.nombre} />
                ))}
              </datalist>
            </form>
          ) : (
            <button onClick={(e) => {
              e.stopPropagation();
              setShowTagInput(true);
            }} className="text-green-500 hover:text-green-700">
              <FontAwesomeIcon icon={faTag} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageItem;