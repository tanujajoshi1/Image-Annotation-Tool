import React, { useEffect } from "react";
import { Rect, Transformer } from "react-konva";

const Annotation = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const transformRef = React.useRef();

  useEffect(() => {
    if (isSelected) {
      transformRef.current.setNode(shapeRef.current);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const onMouseEnter = event => {
    event.target.getStage().container().style.cursor = "move";
  };

  const onMouseLeave = event => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  return (
    <React.Fragment>
      <Rect
        fill="transparent"
        stroke="red"
        onMouseDown={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDragEnd={event => {
          onChange({
            ...shapeProps,
            x: event.target.x(),
            y: event.target.y()
          });
        }}
        onTransformEnd={event => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
          });
        }}
      />
      {isSelected && <Transformer ref={transformRef} />}
    </React.Fragment>
  );
};

export default Annotation;
