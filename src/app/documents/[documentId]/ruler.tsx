import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

// Generate an array of numbers from 0 to 82 (inclusive) to represent the markers on the ruler.
const markers = Array.from({ length: 83 }, (_, i) => i);

export const Ruler = () => {
  const [leftMargin, setLeftMargin] = useState(56);
  const [rightMargin, setRightMargin] = useState(56);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  // This allows us to reference the DOM element directly later in the code.
  // When the user drags a marker, handleMouseMove uses the rulerRef to access the #ruler-container and measure its bounding rectangle.
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => {
    setIsDraggingLeft(true);
  };

  const handleRightMouseDown = () => {
    setIsDraggingRight(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const PAGE_WIDTH = 816; // Width of the ruler in pixels
    const MIN_SPACE = 100; // Minimum space between markers in pixels
    // Check if either the left or right marker is being dragged and if the ruler reference is set
    if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
      // Get the ruler container element using its ID
      const container = rulerRef.current.querySelector("#ruler-container");

      if (container) {
        // Get the bounding rectangle of the container to calculate positions
        const containerRect = container.getBoundingClientRect();
        // Calculate the relative X position of the cursor within the container
        const relativeX = e.clientX - containerRect.left;
        // Ensure the position stays within the container's bounds (0 to 816 pixels)
        const rawPosition = Math.max(0, Math.min(PAGE_WIDTH, relativeX));
        if (isDraggingLeft) {
          // Calculate the maximum allowed position for the left margin
          const maxLeftPosition = PAGE_WIDTH - rightMargin - MIN_SPACE; // Leave at least 100px space between markers
          // Set the new left margin, constrained by the max position
          const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
          setLeftMargin(newLeftPosition); // Update state for the left margin
        } else if (isDraggingRight) {
          // Calculate the maximum allowed position for the right margin
          const maxRightPosition = PAGE_WIDTH - leftMargin - MIN_SPACE; // Leave at least 100px space between markers
          // Calculate the new right margin constrained by the container bounds
          const newRightPosition = Math.max(PAGE_WIDTH - rawPosition, 0);
          // Ensure the right margin doesn't overlap the left margin
          const constrainedRightPosition = Math.min(
            newRightPosition,
            maxRightPosition
          );
          setRightMargin(constrainedRightPosition); // Update state for the right margin
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingLeft(false); // Disable dragging for the left marker
    setIsDraggingRight(false); // Disable dragging for the right marker
  };

  const handleLeftDoubleClick = () => {
    setLeftMargin(56); // Reset the left margin to the default value
  };

  const handleRightDoubleClick = () => {
    setRightMargin(56); // Reset the right margin to the default value
  };

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
    >
      {/* Outer container with defined max width and full height */}
      <div
        id="ruler-container"
        className="max-w-[816px] mx-auto w-full h-full relative"
      >
        <Marker
          // The current position of the marker, dynamically updated as the user drags it.
          position={leftMargin}
          isLeft={true}
          // Boolean to track whether the right marker is being dragged by the user.
          isDragging={isDraggingLeft}
          // Event handler to enable dragging for the marker when the mouse button is pressed down.
          onMouseDown={handleLeftMouseDown}
          // Event handler to reset the right margin to its default position when double-clicked.
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />
        {/* Absolute container for placing ruler markers */}
        <div className="absolute inset-x-0 bottom-0 h-full">
          {/* Map through the markers array to render each marker */}
          <div className="relative h-full w-[816px]">
            {markers.map((marker) => {
              // Calculate the horizontal position of each marker
              const position = (marker * 816) / 82;

              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {/* Major tick marks (every 10th marker) */}
                  {marker % 10 === 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}

                  {/* Medium tick marks (every 5th marker not divisible by 10) */}
                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                  )}

                  {/* Minor tick marks (all other markers) */}
                  {marker % 5 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Define the props for the Marker component
interface MarkerProps {
  position: number; // The position of the marker in pixels
  isLeft: boolean; // Determines if the marker is on the left side
  isDragging: boolean; // Indicates whether the marker is currently being dragged
  onMouseDown: () => void; // Event handler for mouse down
  onDoubleClick: () => void; // Event handler for double click
}

// Marker component implementation
const Marker = ({
  position, // Position of the marker
  isLeft, // Is the marker positioned on the left side
  isDragging, // Is the marker being dragged
  onMouseDown, // Function triggered on mouse down
  onDoubleClick, // Function triggered on double click
}: MarkerProps) => {
  return (
    <div
      // Styling the marker container
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{
        // Dynamically set the position based on whether it's left or right
        [isLeft ? "left" : "right"]: `${position}px`,
      }}
      onMouseDown={onMouseDown} // Attach mouse down event
      onDoubleClick={onDoubleClick} // Attach double click event
    >
      {/* Add a visual indicator inside the marker */}
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
      {/* creates a visual guide line that appears while the user is dragging a marker */}
      <div
        // positioned absolutely relative to the marker container. left-1/2 places the div horizontally at the center of the marker.
        // -translate-x-1/2 shifts the div to the left by half of its width, centering it on the marker.
        className="absolute left-1/2 top-4 transform -translate-x-1/2"
        // scaleX(0.5) - Scales the div horizontally by half its normal width, making the line thinner than 1px for a cleaner appearance
        style={{
          height: "100vh",
          width: "1px",
          transform: "scaleX(0.5)",
          backgroundColor: "#3b72f6",
          display: isDragging ? "block" : "none",
        }}
      />
    </div>
  );
};
