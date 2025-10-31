
import { SyncOutlined, PlusSquareOutlined } from '@ant-design/icons'
import styles from './index.module.less';
import { addProjectFolder } from '../../api';

export default function ToolHead(props: any) {

  const getFile = async () => {
    await addProjectFolder();

  }

  return <div className={styles.box}>
    <div className={styles.item} onClick={getFile}>
      <PlusSquareOutlined /> 新增工作文件夹
    </div>
    <div className={styles.item} onClick={() => { props?.forceRefreshList?.() }} >
      <SyncOutlined /> 同步配置
    </div>
  </div>
}