import { post } from ".";

const basePath = "/config"

export const setPicUploadPath = async (param: { picUploadPath: string }) => {
    return await post(basePath + '/setPicUploadPath', param);
}
export const setMovUploadPath = async (param: { movUploadPath: string }) => {
    return await post(basePath + '/setMovUploadPath', param);
}
export const setFileUploadPath = async (param: { fileUploadPath: string }) => {
    return await post(basePath + '/setFileUploadPath', param);
}