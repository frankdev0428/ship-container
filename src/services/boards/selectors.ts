import { AelerBoard, NexxiotBoard, Board, KizyBoard, MostBoard } from './types'

export const dummy = () => 0

export const mapAelerBoard = (board: AelerBoard, provider: string): Board => ({
  boardId: board.boardId,
  provider: provider,
  hasGps: board.hasGps || false,
  hasShock: board.hasShock || false,
  hasTempExt: board.hasTempExt || false,
  hasTempInt: board.hasTempInt || false,
  hasPressureExt: board.hasPressureExt || false,
  hasPressureInt: board.hasPressureInt || false,
  hasHumInt: board.hasHumInt || false,
  hasHumExt: board.hasHumExt || false,
  hasGases: board.hasGases || false,
  hasLightInt: board.hasLightInt || false,
  hasLightExt: board.hasLightExt || false,
  hasDoor: board.hasDoor || false,
  hasRFID: board.hasRFID || false,
  ...board.gps?.position && {
    healthGps: {
      geometry: board.gps?.position,
      updatedAt: board.gps?.updatedAt,
    },
  },
  healthSensors: board.sensors,
  powerBudget: board.powerBudget,
  latestMessage: board.latestMessageDate,
  boardBatteryStatus: board.boardBatteryStatus,
})

export const mapNexxiotBoard = (board: NexxiotBoard, provider: string): Board => ({
  boardId: board.boardId,
  provider: provider,
  hasGps: board.hasGps || false,
  hasShock: board.hasShock || false,
  hasTempExt: board.hasTempExt || false,
  hasTempInt: board.hasTempInt || false,
  hasPressureExt: board.hasPressureExt || false,
  hasPressureInt: board.hasPressureInt || false,
  hasHumInt: board.hasHumInt || false,
  hasHumExt: board.hasHumExt || false,
  hasGases: board.hasGases || false,
  hasLightInt: board.hasLightInt || false,
  hasLightExt: board.hasLightExt || false,
  hasDoor: board.hasDoor || false,
  hasRFID: board.hasRFID || false,
  ...board.asset?.location.geometry && {
    healthGps: {
      geometry: board.asset?.location.geometry,
      updatedAt: board.asset?.updatedAt,
    },
  },
  ...board.device?.internalTemperature && {
    healthSensors: {
      temperature: board.device?.internalTemperature.celsius,
      updatedAt: board.device?.updatedAt,
    },
  },
})

export const mapKizyBoard = (board: KizyBoard, provider: string): Board => ({
  boardId: board.boardId,
  provider: provider,
  hasGps: board.hasGps || false,
  hasShock: board.hasShock || false,
  hasTempExt: board.hasTempExt || false,
  hasTempInt: board.hasTempInt || false,
  hasPressureExt: board.hasPressureExt || false,
  hasPressureInt: board.hasPressureInt || false,
  hasHumInt: board.hasHumInt || false,
  hasHumExt: board.hasHumExt || false,
  hasGases: board.hasGases || false,
  hasLightInt: board.hasLightInt || false,
  hasLightExt: board.hasLightExt || false,
  hasDoor: board.hasDoor || false,
  hasRFID: board.hasRFID || false,
  healthGps: board.gps,
  healthSensors: {
    ...board.sensors,
    temperature: board.sensors?.internalTemperature,
    humidity: board.sensors?.internalHumidity,
  },
  // battery: board.battery,
})

export const mapMostBoard = (board: MostBoard, provider: string): Board => ({
  boardId: board.boardId,
  provider: provider,
  hasGps: board.hasGps || false,
  hasShock: board.hasShock || false,
  hasTempExt: board.hasTempExt || false,
  hasTempInt: board.hasTempInt || false,
  hasPressureExt: board.hasPressureExt || false,
  hasPressureInt: board.hasPressureInt || false,
  hasHumInt: board.hasHumInt || false,
  hasHumExt: board.hasHumExt || false,
  hasGases: board.hasGases || false,
  hasLightInt: board.hasLightInt || false,
  hasLightExt: board.hasLightExt || false,
  hasDoor: board.hasDoor || false,
  hasRFID: board.hasRFID || false,
  ...board.location && {
    healthGps: {
      geometry: board.location?.location,
      updatedAt: board.location?.updatedAt,
    },
  },
  healthSensors: {
    ...board.sensors,
    temperature: board.sensors?.temperature,
    humidity: board.sensors?.humidity,
    centiLux: board.sensors?.luminance,
  },
})
