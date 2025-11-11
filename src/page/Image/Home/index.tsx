import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import UserHeader from '../../../compomeents/UserHeader'
import styles from './index.module.less'
import Button from "../../../UiComponents/Button";
import Modal from '../../../UiComponents/Modal';
import Upload from '../../../UiComponents/Upload';




export default function ImageHome() {



  return <div className={styles.box}>
    <UserHeader className={styles.userHeader}>
      <Button><UploadOutlined onClick={() => { }} /></Button>
    </UserHeader>
    <div className={styles.content}>

    </div>
    <Modal open={true} title="上传图片" onOK={() => {

    }} onClose={() => {

    }}>
      {/* <Upload accept="image/*,video/*" /> */}
      <Upload multiple/>
    </Modal>
  </div>
}