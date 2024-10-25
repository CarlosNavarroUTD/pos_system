// frontend/src/components/MessageList.jsx
import React from 'react';
import MessageItem from './MessageItem';

function MessageList({ messages, tags, onAddTag, onEditMessage, onDeleteMessage }) {
  // Agrupamos los mensajes por etiquetas
  const groupedMessages = messages.reduce((acc, message) => {
    // Si el mensaje no tiene etiquetas, lo agrupamos bajo "no_tags"
    if (message.tags.length === 0) {
      if (!acc['no_tags']) acc['no_tags'] = [];
      acc['no_tags'].push(message);
    } else {
      // Si el mensaje tiene etiquetas, lo añadimos a cada una de sus etiquetas
      message.tags.forEach(tag => {
        if (!acc[tag.nombre]) acc[tag.nombre] = [];
        acc[tag.nombre].push(message);
      });
    }
    return acc;
  }, {});

  // Mostramos los mensajes agrupados por etiquetas y los mensajes sin etiquetas
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {Object.entries(groupedMessages).map(([tag, tagMessages]) => (
        <div key={tag} id={`section-${tag}`} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{tag === 'no_tags' ? 'Messages without tags' : `${tag}`}</h2>
          {tagMessages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              tags={tags}
              onAddTag={onAddTag}
              onEditMessage={onEditMessage}
              onDeleteMessage={onDeleteMessage}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
