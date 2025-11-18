import { fetchStream, post } from ".";

const basePath = '/project'

export const getProjectList = async () => {
  return await post(basePath + "/getProjectList");
}

export const forceRefreshList = async () => {
  return await post(basePath + '/forceRefreshList')
}

export const runCom = async (param: { path: string; com: string }, event: (data: any) => void) => {
  fetchStream(basePath + '/runCommand', { ...param }, event);
}

export const stopCommand = async (param: { path: string; com: string }) => {
  return await post(basePath + '/stopCommand', param)
}
// getRunningList
export const getRunningList = async () => {
  return await post(basePath + '/getRunningList')
}


export const addProjectFolder = async () => {
  return await post(basePath + '/addProjectFolder')
}

export const getLogs = async () => {
  return await post(basePath + '/getLogs');
}

export const openInVscode = async (param: any) => {
  return await post(basePath + '/openInVscode', param);
}

