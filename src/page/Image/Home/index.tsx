import { UploadOutlined } from '@ant-design/icons';
import UserHeader from '../../../compomeents/UserHeader';
import styles from './index.module.less';
import Button from "../../../UiComponents/Button";
import Modal from '../../../UiComponents/Modal';
import Upload from '../../../UiComponents/Upload';
import { useEffect, useRef, useState } from 'react';
import { uploadPic } from '../../../server/file';

export default function ImageHome() {
  // const formData = useRef<FormData>(new FormData());
  const [uploadModalOpen, setUploadOpen] = useState(false);

  useEffect(() => { }, []);

  return (
    <div className={styles.box}>
      <UserHeader className={styles.userHeader}>
        <Button onClick={() => { setUploadOpen(true); }}><UploadOutlined /></Button>
      </UserHeader>
      <div className={styles.content}></div>
      <Modal
        open={uploadModalOpen}
        title="上传图片"
        onOK={() => { setUploadOpen(false); }}
        onClose={() => { setUploadOpen(false); }}
      >
        <Upload
          multiple
          onChange={async (files: any[]) => {
            console.log(files, 'files')
            const formData = new FormData();
            files.forEach(file => {
              formData.append('files', file);  // 'files[]' 是字段名称，可以根据需要修改
            });
            // 上传图片
            await uploadPic(formData);
          }}
        />
      </Modal>
    </div>
  );
}