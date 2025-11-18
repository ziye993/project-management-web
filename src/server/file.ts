import { post, upload } from ".";

const basePath = "/file"
export const uploadPic = async (param: any) => {
    console.log(param)
    return await upload('/upload/uploadPic', param);
}

export const getFileList = async (param: any) => {
    return await post(basePath + '/fileList', param);
}