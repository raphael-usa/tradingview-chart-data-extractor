// import React, { useState, useEffect } from 'react';

// const FloatingMovableContainer = (props) => {
//     // You can access the child component (ContentStuff) through props.children
//     const { children, topInit, leftInit } = props;

//     const [dragging, setDragging] = useState(false);
//     const [position, setPosition] = useState({ top: topInit, left: leftInit });//inital position
//     const [startPos, setStartPos] = useState({ x: 0, y: 0 });

//     const handleMouseDown = (e) => {
//         setDragging(true);
//         setStartPos({ x: e.clientX, y: e.clientY });
//     };

//     const handleMouseMove = (e) => {
//         if (!dragging) return;
//         const deltaX = e.clientX - startPos.x;
//         const deltaY = e.clientY - startPos.y;

//         setPosition({
//             top: position.top + deltaY,
//             left: position.left + deltaX,
//         });

//         setStartPos({ x: e.clientX, y: e.clientY });
//     };

//     const handleMouseUp = () => {
//         setDragging(false);
//     };

//     return (
//         <React.Fragment>
//             <div
//                 style={{
//                     position: 'fixed',
//                     zIndex: 1000,
//                     backgroundColor: 'rgba(241, 241, 241, 0.63)',
//                     textAlign: 'center',
//                     border: '1px solid #d3d3d3',
//                     top: position.top,
//                     left: position.left,
//                     userSelect: 'none',
//                     padding: '5px'
//                 }}
//             >
//                 <div
//                     style={{
//                         padding: '10px',
//                         cursor: 'move',
//                         zIndex: 1001,
//                         backgroundColor: '#2196F3',
//                         color: '#fff',
//                     }}
//                     onMouseDown={handleMouseDown}
//                 >
//                     move
//                 </div>

//                 <p>{children}</p>

//                 {dragging && (
//                     <div
//                         style={{
//                             position: 'fixed',
//                             top: 0,
//                             left: 0,
//                             width: '100%',
//                             height: '100%',
//                             cursor: 'grabbing',
//                             zIndex: 1002,
//                         }}
//                         onMouseMove={handleMouseMove}
//                         onMouseUp={handleMouseUp}
//                     />
//                 )}
//             </div>
//         </React.Fragment>
//     );
// };

// export default FloatingMovableContainer;


import React, { useState, useEffect } from 'react';

const FloatingMovableContainer = (props) => {
  const { children, top, left, bottom, right, collapsible } = props;

  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ top, left, bottom, right });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const [display, setDisplay] = useState(true);
  const toggleDisplay = () => {
    console.debug("CLICKED TOGGLE DISPLAY")
    setDisplay(!display);
  };

  useEffect(() => {
    setPosition({ top, left, bottom, right });
  }, [top, left, bottom, right]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    setPosition((prevPosition) => ({
      top: prevPosition.top !== undefined ? prevPosition.top + deltaY : undefined,
      left: prevPosition.left !== undefined ? prevPosition.left + deltaX : undefined,
      bottom: prevPosition.bottom !== undefined ? prevPosition.bottom - deltaY : undefined,
      right: prevPosition.right !== undefined ? prevPosition.right - deltaX : undefined,
    }));

    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition({ top, left, bottom, right });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [top, left, bottom, right]);

  return (
    <React.Fragment>
      <div
        style={{
          position: 'fixed',
          zIndex: 1000,
          backgroundColor: 'rgba(241, 241, 241, 0.63)',
          textAlign: 'center',
          border: '1px solid rgb(255, 0, 239)',
          top: position.top,
          left: position.left,
          bottom: position.bottom,
          right: position.right,
          userSelect: 'none',
          padding: '5px',
        }}
      >

        <div>
          <div
            style={{
              padding: '10px',
              cursor: 'move',
              zIndex: 1001,
              backgroundColor: '#2196F3',
              color: '#fff',
            }}
            onMouseDown={handleMouseDown}
          >
            move

          </div>

          <div>{collapsible && <span onClick={toggleDisplay} style={{ position: 'relative', float: 'right', cursor:'pointer' }}>toggle</span>}</div>

        </div>

        <div style={{ font: "normal 12px/1 Arial, Helvetica, sans-serif", color: "black", textShadow: "1px 1px 2px rgba(255,0,238,0.91)", display: display ? 'block' : 'none' }}>
          {children}
        </div>

        {dragging && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: 'grabbing',
              zIndex: 1002,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default FloatingMovableContainer;
