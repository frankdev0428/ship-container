import { ContainerBoardPairingProfilePostInput } from '../../../../services/equipment/types'
import { isValidDate } from '../../shared/utils'

import { BoardProfile } from './PairingBoardProfiles'

export const validateBoardProfiles = (boards: BoardProfile[]): ContainerBoardPairingProfilePostInput[] => {
  return boards
    .filter(
      (b) =>
        b.boardId &&
        b.containerId &&
        b.boardSource &&
        b.installDate &&
        isValidDate(b.installDate) &&
        (b.removalDate ? isValidDate(b.removalDate) : true),
    )
    .map(board => ({
      containerId: board.containerId,
      boardId: board.boardId as string,
      boardSource: board.boardSource as string,
      installDate: board.installDate as Date,
      removalDate: board.removalDate as Date,
      installComments: board.installComments,
      removalComments: board.removalComments,
      installTechnicianId: board.installTechnicianId,
      removalTechnicianId: board.removalTechnicianId,
      installLocationId: board.installLocationId,
      removalLocationId: board.removalLocationId,
      installLocationName: board.installLocationName,
      removalLocationName: board.removalLocationName,
    }))
}
