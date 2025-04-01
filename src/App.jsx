import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import REACT_LOGO from "./assets/react.svg";

function App() {
  const [angle, setAngle] = useState(0);
  const [rotationDirection, setRotationDirection] = useState(0.5);
  const [iconSize, setIconSize] = useState(120);
  const [stationaryTime, setStationaryTime] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(10);
  const [rotateEnabled, setRotateEnabled] = useState(true);
  const [rotationLabel, setRotationLabel] = useState(false);
  const [sizeEnabled, setSizeEnabled] = useState(true);
  const [stationaryEnabled, setStationaryEnabled] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mouseLeftWindow, setMouseLeftWindow] = useState(false);

  const lastMouseMoveRef = useRef(Date.now());

  // Continuous rotation
  useEffect(() => {
    if (!rotateEnabled) return;
    const interval = setInterval(() => {
      setAngle((prev) => prev + rotationDirection * (rotationSpeed / 10));
    }, 10);
    return () => clearInterval(interval);
  }, [rotationDirection, rotateEnabled, rotationSpeed]);

  // Timer for mouse stationary
  useEffect(() => {
    if (!stationaryEnabled) return;
    const interval = setInterval(() => {
      setStationaryTime(Date.now() - lastMouseMoveRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [stationaryEnabled]);

  // Handle mouse movement for size and timer reset
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouseLeftWindow(false);
      if (stationaryEnabled) {
        lastMouseMoveRef.current = Date.now();
        setStationaryTime(0);
      }
      if (sizeEnabled) {
        const { clientX, clientY } = event;

        // Find the middle of the screen as is where the icon is located
        const screenMiddleX = window.innerWidth / 2;
        const screenMiddleY = window.innerHeight / 2;

        // Calculate the distance from the cursor to the center of the screen
        const distance = Math.sqrt(
          Math.pow(clientX - screenMiddleX, 2) +
            Math.pow(clientY - screenMiddleY, 2)
        );

        // Calculate the maximum possible distance (corner to center)
        const maxDistance = Math.sqrt(
          Math.pow(screenMiddleX, 2) + Math.pow(screenMiddleY, 2)
        );

        // Map the distance to a reasonable size range (e.g., 50 to 200)
        const newSize = 50 + (distance / maxDistance) * 150;
        setIconSize(newSize);
      }
    };
    const handleMouseLeave = (event) => {
      // When there is no related target, the mouse left the document
      if (!event.relatedTarget) {
        setMouseLeftWindow(true);
        setStationaryTime(0);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [sizeEnabled, stationaryEnabled]);

  // Reverse rotation on click
  const handleIconClick = () => {
    if (rotateEnabled) {
      setRotationDirection((prev) => -prev);
    }
  };

  return (
    <div className="main-container">
      <div className="sidebar-toggle-container">
        <button
          className="sidebar-toggle-button"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          {sidebarVisible ? "Hide" : "Show"} Settings
        </button>
      </div>

      {sidebarVisible && (
        <div className="sidebar-main-container">
          <div className="sidebar-container">
            <h2 className="sidebar-title">Settings</h2>
            <div className="sidebar-option">
              <label>
                <input
                  type="checkbox"
                  checked={rotateEnabled}
                  onChange={() => setRotateEnabled((prev) => !prev)}
                />
                Rotate Icon
              </label>
              <br />
              <label>Rotate speed: {rotationSpeed}</label>
              <input
                type="range"
                min="1"
                max="100"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseInt(e.target.value))}
              />
            </div>

            <div className="sidebar-option">
              <label>
                <input
                  type="checkbox"
                  checked={sizeEnabled}
                  onChange={() => setSizeEnabled((prev) => !prev)}
                />
                Adjust Icon Size
              </label>
            </div>
            <div className="sidebar-option">
              <label>
                <input
                  type="checkbox"
                  checked={stationaryEnabled}
                  onChange={() => setStationaryEnabled((prev) => !prev)}
                />
                Show Stationary Timer
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="content-container">
        {rotationLabel && rotateEnabled && (
          <div className="rotationLabel">
            Click to reverse direction and spin from the opposite side. 🔄
          </div>
        )}
        <img
          className="react-logo"
          src={REACT_LOGO}
          alt="React Logo"
          onClick={handleIconClick}
          style={{
            width: iconSize,
            height: iconSize,
            transform: `rotate(${angle}deg)`,
          }}
          onMouseEnter={() => {
            setRotationLabel(true);
            setSizeEnabled(false);
          }}
          onMouseLeave={() => {
            setRotationLabel(false);
            setSizeEnabled(true);
          }}
        />

        {stationaryEnabled && (
          <p className="timer-display">
            {mouseLeftWindow ? (
              <>
                The mouse has moved outside the application window.
                <br /> Please return it to the view to continue interacting with
                the app.
              </>
            ) : (
              `Stationary: ${(stationaryTime / 1000).toFixed(1)} s`
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
