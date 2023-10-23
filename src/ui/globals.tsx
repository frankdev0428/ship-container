import Config from '../config.json'

export const ENABLE_DATAGRID = Config.FF_ENABLE_DATAGRID !== undefined && Config.FF_ENABLE_DATAGRID === 'true'
