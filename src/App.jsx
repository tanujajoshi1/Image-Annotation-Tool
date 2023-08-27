import React, { useState } from "react";
import { Stage, Layer, Group } from "react-konva";
import uuid from "react-uuid";
import ImageFromUrl from "./ImageFromUrl";
import Annotation from "./Annotation";
import img1 from './img/Image 1.jpg';
import img2 from './img/Image 2.jpg';
import img4 from './img/Image 4.jpg';
import img3 from './img/Image 3.webp'
import img5 from './img/Image5.jpg';

const initialAnnotations = [];

function App() {
  const images = [img1, img2, img3, img4, img5];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [selectedId, selectAnnotation] = useState(null);
  const [canvasMeasures, setCanvasMeasures] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });


  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
    resetAnnotations();
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex
    );
    resetAnnotations();
  };

  const resetAnnotations = () => {
    setAnnotations([]);
    setNewAnnotation([]);
    selectAnnotation(null);
  };
  const handleMouseDown = event => {
    if (selectedId === null && newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = uuid();
      setNewAnnotation([{ x, y, width: 0, height: 0, id }]);
    }
  };

  const handleMouseMove = event => {
    if (selectedId === null && newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = uuid();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          id
        }
      ]);
    }
  };

  const handleMouseUp = () => {
    if (selectedId === null && newAnnotation.length === 1) {
      annotations.push(...newAnnotation);
      setAnnotations(annotations);
      setNewAnnotation([]);
    }
  };

  const handleMouseEnter = event => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  const handleKeyDown = event => {
    if (event.keyCode === 8 || event.keyCode === 46) {
      if (selectedId !== null) {
        const newAnnotations = annotations.filter(
          annotation => annotation.id !== selectedId
        );
        setAnnotations(newAnnotations);
      }
    }
  };
  const convertAnnotationsToJSON = () => {
    const jsonAnnotations = {};
  
    annotations.forEach(annotation => {
      if (!jsonAnnotations[annotation.id]) {
        jsonAnnotations[annotation.id] = [];
      }
  
      jsonAnnotations[annotation.id].push({
        x1: annotation.x,
        y1: annotation.y,
        x2: annotation.x + annotation.width,
        y2: annotation.y + annotation.height,
      });
    });
  
    return JSON.stringify(jsonAnnotations, null, 2);
  };
  const handleSaveAnnotations = () => {
    const annotationsJSON = convertAnnotationsToJSON();
    
    const blob = new Blob([annotationsJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
    
    URL.revokeObjectURL(url);
  };
   
  const currentImageSrc = images[currentImageIndex];
  const annotationsToDraw = [...annotations, ...newAnnotation];
  return (
    <div >
      <div className="button-container">
      <button id='reset' onClick={resetAnnotations}>RESET</button>
      
      <button id='prev' onClick={handlePrevImage} disabled={currentImageIndex === 0}>❮PREVIOUS</button>
      <button id='next' onClick={handleNextImage} disabled={currentImageIndex === images.length - 1}>NEXT❯</button>
      <button id='save' onClick={handleSaveAnnotations}>SAVE</button>
      </div>
    <div className="container"  tabIndex={1} onKeyDown={handleKeyDown}>
      <Stage
        width={canvasMeasures.width}
        height={canvasMeasures.height}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
        <Group
            
            >
          <ImageFromUrl
            setCanvasMeasures={setCanvasMeasures}
            imageUrl={currentImageSrc}
            onMouseDown={() => {
              // deselect when clicked on empty area
              selectAnnotation(null);
            }}              
          
            className="custom-image-style"
     
          />
 
 </Group>
          {annotationsToDraw.map((annotation, i) => {
            return (
              <Annotation
                key={i}
                shapeProps={annotation}
                isSelected={annotation.id === selectedId}
                onSelect={() => {
                  selectAnnotation(annotation.id);
                }}
                onChange={newAttrs => {
                  const rects = annotations.slice();
                  rects[i] = newAttrs;
                  setAnnotations(rects);
                }} 
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
    </div>
  );
}
export default App