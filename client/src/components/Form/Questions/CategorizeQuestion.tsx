import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CategorizeQuestion as CategorizeQuestionType, Answer } from '../../../types';

interface CategorizeQuestionProps {
  question: CategorizeQuestionType;
  onAnswerChange: (answer: Answer) => void;
  isPreview?: boolean;
}

const CategorizeQuestion: React.FC<CategorizeQuestionProps> = ({
  question,
  onAnswerChange,
  isPreview = false
}) => {
  const [items, setItems] = useState<{ [categoryId: string]: typeof question.items }>({});

  useEffect(() => {
    // Initialize items in "unassigned" category
    const initialItems: { [categoryId: string]: typeof question.items } = {
      unassigned: [...question.items]
    };
    
    question.categories.forEach(category => {
      initialItems[category.id] = [];
    });

    setItems(initialItems);
  }, [question]);

  const handleDragEnd = (result: any) => {
    if (isPreview) return;
    
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceItems = Array.from(items[source.droppableId]);
    const destItems = destination.droppableId === source.droppableId ? sourceItems : Array.from(items[destination.droppableId]);
    
    const [draggedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, draggedItem);

    const newItems = {
      ...items,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems
    };

    setItems(newItems);

    // Create answer object
    const categorizedItems = Object.entries(newItems)
      .filter(([categoryId]) => categoryId !== 'unassigned')
      .flatMap(([categoryId, categoryItems]) => 
        (categoryItems as typeof question.items).map(item => ({
          itemId: item.id,
          categoryId: categoryId
        }))
      );

    const answer: Answer = {
      questionId: question.id,
      questionType: 'categorize',
      categorizedItems
    };

    onAnswerChange(answer);
  };

  return (
    <div className="p-6">
      {/* Question Title */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.title}</h3>
        {question.description && (
          <p className="text-gray-600 mb-4">{question.description}</p>
        )}
        {question.image && (
          <div className="mb-4">
            <img
              src={question.image}
              alt="Question"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Instructions:</strong> Drag and drop the items below into the correct categories.
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Unassigned Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Items to Categorize</h4>
            <Droppable droppableId="unassigned">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-32 p-4 border-2 border-dashed rounded-lg transition-colors ${
                    snapshot.isDraggingOver
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  {items.unassigned?.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isPreview}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 p-3 bg-white border rounded-lg shadow-sm cursor-move transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                          } ${isPreview ? 'cursor-default' : ''}`}
                        >
                          {item.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Category Dropzones */}
          {question.categories.map((category) => (
            <div key={category.id}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </h4>
              <Droppable droppableId={category.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-32 p-4 border-2 border-dashed rounded-lg transition-colors ${
                      snapshot.isDraggingOver
                        ? 'bg-opacity-20'
                        : 'border-gray-300'
                    }`}
                    style={{
                      borderColor: category.color,
                      backgroundColor: snapshot.isDraggingOver
                        ? `${category.color}20`
                        : 'transparent'
                    }}
                  >
                    {items[category.id]?.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isPreview}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 p-3 bg-white border rounded-lg shadow-sm cursor-move transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                            } ${isPreview ? 'cursor-default' : ''}`}
                            style={{
                              borderColor: category.color,
                            }}
                          >
                            {item.text}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isPreview && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Preview Mode:</strong> In the actual form, users will be able to drag and drop items into categories.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategorizeQuestion;
