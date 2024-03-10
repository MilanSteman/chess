/**
 * Interface for a room (in which players will be assigned)
 */
interface Room {
  roomName: string;
  roomStatus: string;
  players: {
    [playerId: string]: {
      color: string;
      timeLeft: number;
    };
  };
  moves: [];
  fenString?: string;
  advantage?: number;
}

export { Room };
