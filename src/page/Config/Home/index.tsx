import UserHeader from '../../../compomeents/UserHeader'
import styles from './index.module.less'
import FileSelect from '../../../compomeents/FileSelect';
import { useEffect, useRef, useState } from 'react';
import message from '../../../UiComponents/Modal/message';
import { setFileUploadPath, setMovUploadPath, setPicUploadPath } from '../../../server/setConfig';


export default function ConfigHome() {
  const [selectFileOpen, setSelectFileOpen] = useState(false);
  const apiFun = useRef<any>(async () => { });

  const onOK = async (pathInfo: any) => {
    console.log(pathInfo.path)
    if (!pathInfo.path) {
      message.info("请选择文件或路径")
      return
    }
    const res = await apiFun.current({ uploadPath: pathInfo.path });
    if (!res.success) return
    message.success
  }



  useEffect(() => {
    // message.show({ type: 'success', content: "1234567890" })
  }, [])

  return <div className={styles.box}>
    <UserHeader className={styles.userHeader} />
    <FileSelect open={selectFileOpen} onClose={() => setSelectFileOpen(false)} onOK={onOK} />
    <div className={styles.content}>
      <div className={styles.configItemBox}>
        <span className={styles.configItemTitle}>上传路径</span>
        <div className={styles.configItemContent}>
          <ul>
            <li onClick={() => { setSelectFileOpen(true); apiFun.current = setPicUploadPath }}><span>照片上传路径</span><span className={styles.value}>未设置</span></li>
            <li onClick={() => { setSelectFileOpen(true); apiFun.current = setMovUploadPath }}><span>影视上传路径</span><span className={styles.value}>未设置</span></li>
            <li onClick={() => { setSelectFileOpen(true); apiFun.current = setFileUploadPath }}><span>文件上传路径</span><span className={styles.value}>未设置</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
}