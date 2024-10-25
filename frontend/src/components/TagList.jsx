import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import axios from 'axios';

const TagList = () => {
  const [allTags, setAllTags] = useState([]);
  const [visibleTags, setVisibleTags] = useState([]);
  const [hiddenTags, setHiddenTags] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tags y su configuración de visibilidad
  const loadTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const [tagsResponse, visibilityResponse] = await Promise.all([
        axios.get('/api/tags/'),
        axios.get('/api/tags/visibility/')
      ]);

      const tags = tagsResponse.data;
      const visibilityConfigs = visibilityResponse.data;

      // Crear un mapa de configuraciones para fácil acceso
      const visibilityMap = new Map(
        visibilityConfigs.map(config => [config.tag_id, config])
      );

      // Ordenar tags según la configuración
      const sortedTags = [...tags].sort((a, b) => {
        const orderA = visibilityMap.get(a.id)?.order ?? 0;
        const orderB = visibilityMap.get(b.id)?.order ?? 0;
        return orderA - orderB;
      });

      // Separar tags visibles y ocultos
      const visible = sortedTags.filter(tag => !visibilityMap.get(tag.id)?.is_hidden);
      const hidden = sortedTags.filter(tag => visibilityMap.get(tag.id)?.is_hidden);

      setAllTags(sortedTags);
      setVisibleTags(visible);
      setHiddenTags(hidden);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleTagVisibilityToggle = async (tagId) => {
    try {
      const isCurrentlyHidden = hiddenTags.some(tag => tag.id === tagId);
      
      await axios.post('/api/tags/toggle-visibility/', {
        tag_id: tagId,
        is_hidden: !isCurrentlyHidden
      });

      if (isCurrentlyHidden) {
        const tagToShow = hiddenTags.find(t => t.id === tagId);
        setHiddenTags(prev => prev.filter(t => t.id !== tagId));
        setVisibleTags(prev => [...prev, tagToShow]);
      } else {
        const tagToHide = visibleTags.find(t => t.id === tagId);
        setVisibleTags(prev => prev.filter(t => t.id !== tagId));
        setHiddenTags(prev => [...prev, tagToHide]);
      }
    } catch (error) {
      console.error('Error toggling tag visibility:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedTags = Array.from(visibleTags);
    const [movedTag] = reorderedTags.splice(result.source.index, 1);
    reorderedTags.splice(result.destination.index, 0, movedTag);

    try {
      await axios.post('/api/tags/reorder/', {
        tag_order: reorderedTags.map((tag, index) => ({
          tag_id: tag.id,
          order: index
        }))
      });

      setVisibleTags(reorderedTags);
    } catch (error) {
      console.error('Error reordering tags:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-gray-600">Cargando tags...</span>
      </div>
    );
  }

  return (
    <div className="tag-list space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tags</h2>
        <span className="text-sm text-gray-500">
          {visibleTags.length} visible / {allTags.length} total
        </span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tags">
          {(provided) => (
            <ul 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-2"
            >
              {visibleTags.map((tag, index) => (
                <Draggable 
                  key={tag.id.toString()} 
                  draggableId={tag.id.toString()} 
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center justify-between p-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span {...provided.dragHandleProps}>
                          <GripVertical className="text-gray-400 cursor-grab" size={16} />
                        </span>
                        <span>{tag.nombre}</span>
                        <span className="text-xs text-gray-500">
                          ({tag.respuestas_count})
                        </span>
                      </div>
                      <button 
                        onClick={() => handleTagVisibilityToggle(tag.id)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        title="Ocultar tag"
                      >
                        <EyeOff size={16} />
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={() => setShowHidden(!showHidden)}
        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        {showHidden ? 'Ocultar' : 'Mostrar'} tags ocultos ({hiddenTags.length})
      </button>

      {showHidden && hiddenTags.length > 0 && (
        <ul className="space-y-2 mt-4">
          {hiddenTags.map(tag => (
            <li 
              key={tag.id}
              className="flex items-center justify-between p-2 bg-gray-50 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span>{tag.nombre}</span>
                <span className="text-xs text-gray-500">
                  ({tag.respuestas_count})
                </span>
              </div>
              <button
                onClick={() => handleTagVisibilityToggle(tag.id)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Mostrar tag"
              >
                <Eye size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagList;