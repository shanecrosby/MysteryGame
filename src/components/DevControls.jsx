import { useState } from 'react';

/**
 * DevControls - Development control panel for adjusting scene elements
 * Shows camera position, allows FOV adjustment, and provides controls for scene objects
 */
export default function DevControls({
  cameraPosition,
  cameraRotation,
  fov,
  onFovChange,
  objects = []
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('camera');

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg mb-2 w-full"
      >
        {isOpen ? 'Hide' : 'Show'} Dev Controls
      </button>

      {isOpen && (
        <div className="bg-gray-900 bg-opacity-95 text-white p-4 rounded-lg shadow-2xl max-h-[80vh] overflow-y-auto w-96">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('camera')}
              className={`px-3 py-2 ${activeTab === 'camera' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            >
              Camera
            </button>
            <button
              onClick={() => setActiveTab('objects')}
              className={`px-3 py-2 ${activeTab === 'objects' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            >
              Objects ({objects.length})
            </button>
          </div>

          {/* Camera Tab */}
          {activeTab === 'camera' && (
            <div>
              <h3 className="text-lg font-bold mb-3 text-purple-400">Camera Controls</h3>

              {/* Camera Position */}
              <div className="mb-4 p-3 bg-gray-800 rounded">
                <h4 className="font-semibold mb-2 text-sm text-gray-300">Position</h4>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-red-400">X:</span> {cameraPosition?.[0]?.toFixed(2) || 'N/A'}
                  </div>
                  <div>
                    <span className="text-green-400">Y:</span> {cameraPosition?.[1]?.toFixed(2) || 'N/A'}
                  </div>
                  <div>
                    <span className="text-blue-400">Z:</span> {cameraPosition?.[2]?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Camera Rotation */}
              <div className="mb-4 p-3 bg-gray-800 rounded">
                <h4 className="font-semibold mb-2 text-sm text-gray-300">Rotation (radians)</h4>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-red-400">X:</span> {cameraRotation?.[0]?.toFixed(2) || 'N/A'}
                  </div>
                  <div>
                    <span className="text-green-400">Y:</span> {cameraRotation?.[1]?.toFixed(2) || 'N/A'}
                  </div>
                  <div>
                    <span className="text-blue-400">Z:</span> {cameraRotation?.[2]?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>

              {/* FOV Control */}
              {onFovChange && (
                <div className="mb-4 p-3 bg-gray-800 rounded">
                  <h4 className="font-semibold mb-2 text-sm text-gray-300">Field of View</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="30"
                      max="120"
                      value={fov || 75}
                      onChange={(e) => onFovChange(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono w-12">{fov || 75}°</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Objects Tab */}
          {activeTab === 'objects' && (
            <div>
              <h3 className="text-lg font-bold mb-3 text-purple-400">Object Controls</h3>
              {objects.length === 0 ? (
                <p className="text-gray-400 text-sm">No objects configured</p>
              ) : (
                <div className="space-y-4">
                  {objects.map((obj) => (
                    <ObjectControl key={obj.name} {...obj} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
            <p className="mb-1">• Use OrbitControls to navigate</p>
            <p className="mb-1">• Left drag: rotate | Right drag: pan</p>
            <p>• Scroll: zoom in/out</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ObjectControl - Individual control for a scene object
 */
function ObjectControl({ name, position, rotation, scale, onChange }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800 rounded p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left font-semibold text-sm flex justify-between items-center"
      >
        <span>{name}</span>
        <span className="text-gray-500">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {/* Position Controls */}
          <div>
            <h5 className="text-xs text-gray-400 mb-2">Position</h5>
            <div className="space-y-1">
              <SliderControl
                label="X"
                value={position[0]}
                min={-50}
                max={50}
                step={0.1}
                color="red"
                onChange={(val) => onChange({ position: [val, position[1], position[2]] })}
              />
              <SliderControl
                label="Y"
                value={position[1]}
                min={-20}
                max={20}
                step={0.1}
                color="green"
                onChange={(val) => onChange({ position: [position[0], val, position[2]] })}
              />
              <SliderControl
                label="Z"
                value={position[2]}
                min={-50}
                max={50}
                step={0.1}
                color="blue"
                onChange={(val) => onChange({ position: [position[0], position[1], val] })}
              />
            </div>
          </div>

          {/* Rotation Controls */}
          <div>
            <h5 className="text-xs text-gray-400 mb-2">Rotation (degrees)</h5>
            <div className="space-y-1">
              <SliderControl
                label="X"
                value={(rotation[0] * 180) / Math.PI}
                min={-180}
                max={180}
                step={1}
                color="red"
                onChange={(val) => onChange({ rotation: [(val * Math.PI) / 180, rotation[1], rotation[2]] })}
              />
              <SliderControl
                label="Y"
                value={(rotation[1] * 180) / Math.PI}
                min={-180}
                max={180}
                step={1}
                color="green"
                onChange={(val) => onChange({ rotation: [rotation[0], (val * Math.PI) / 180, rotation[2]] })}
              />
              <SliderControl
                label="Z"
                value={(rotation[2] * 180) / Math.PI}
                min={-180}
                max={180}
                step={1}
                color="blue"
                onChange={(val) => onChange({ rotation: [rotation[0], rotation[1], (val * Math.PI) / 180] })}
              />
            </div>
          </div>

          {/* Scale Control */}
          <div>
            <h5 className="text-xs text-gray-400 mb-2">Scale</h5>
            <SliderControl
              label="Scale"
              value={scale}
              min={0.1}
              max={5}
              step={0.1}
              color="purple"
              onChange={(val) => onChange({ scale: val })}
            />
          </div>

          {/* Copy Values Button */}
          <button
            onClick={() => {
              const values = `position: [${position.map(v => v.toFixed(2)).join(', ')}]\nrotation: [${rotation.map(v => v.toFixed(2)).join(', ')}]\nscale: ${scale.toFixed(2)}`;
              navigator.clipboard.writeText(values);
              alert('Values copied to clipboard!');
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded"
          >
            Copy Values
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * SliderControl - Reusable slider with label and value display
 */
function SliderControl({ label, value, min, max, step, color, onChange }) {
  const colors = {
    red: 'text-red-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-mono w-8 ${colors[color]}`}>{label}:</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={() => onChange(0)}
        className="flex-1 cursor-pointer"
        title="Double-click to reset to 0"
      />
      <span className="text-xs font-mono w-16 text-right">{value.toFixed(2)}</span>
    </div>
  );
}
