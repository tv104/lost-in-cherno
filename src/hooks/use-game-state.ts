import { useContext } from "react"
import { GameContext } from "../providers/game-context"

export const useGameState = () => {
    const context = useContext(GameContext)
    if (context === null) {
        throw new Error("useGameState must be used within a GameProvider")
    }
    return context
}