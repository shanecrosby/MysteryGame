/**
 * CluesSidebar - Displays collected clues in a side panel
 * @param {Object} props
 * @param {Array} props.collectedClues - Array of collected clue objects
 * @param {Number} props.totalClues - Total number of clues to collect
 */
export default function CluesSidebar({ collectedClues = [], totalClues = 3 }) {
  return (
    <div className="fixed top-4 right-4 w-72 bg-gradient-to-br from-white/90 to-blue-50/90
      border-4 border-yellow-400 rounded-2xl p-4 shadow-2xl z-20
      backdrop-blur-sm">
      {/* Header */}
      <div className="mb-3 pb-2 border-b-2 border-yellow-400/50">
        <h2 className="text-xl font-black text-[#1a2847] text-center">
          Collected Clues
        </h2>
        <p className="text-sm font-semibold text-center text-[#2a3856] mt-1">
          {collectedClues.length} / {totalClues}
        </p>
      </div>

      {/* Clues list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {collectedClues.length === 0 ? (
          <div className="text-center py-6 text-gray-500 italic">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm">No clues collected yet.<br />Click on glowing objects!</p>
          </div>
        ) : (
          collectedClues.map((clue, index) => (
            <div
              key={clue.id}
              className="bg-white/60 border-2 border-yellow-400/60 rounded-lg p-3
                transform transition-all duration-300 hover:scale-105 hover:border-yellow-400
                animate-slideIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="text-3xl flex-shrink-0">
                  {clue.icon}
                </div>

                {/* Clue info */}
                <div className="flex-grow">
                  <h3 className="font-bold text-[#1a2847] text-sm leading-tight">
                    {clue.name}
                  </h3>
                  <p className="text-xs text-[#2a3856] mt-1 leading-snug">
                    {clue.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Progress indicator */}
      {totalClues > 0 && (
        <div className="mt-3 pt-3 border-t-2 border-yellow-400/50">
          <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full
                transition-all duration-500 ease-out"
              style={{ width: `${(collectedClues.length / totalClues) * 100}%` }}
            />
          </div>
          {collectedClues.length === totalClues && (
            <p className="text-center text-green-600 font-bold text-sm mt-2 animate-bounce">
              All clues found!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
