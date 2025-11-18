import { useEffect, useState } from "react";
import Modal from "../../UiComponents/Modal";
import { getFileList } from "../../server/file";
import styles from './index.module.less';
import { FileOutlined, FolderOpenOutlined } from "@ant-design/icons";


function sortFilesAndFolders(items: any[]) {
    return items.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
    });
}


export default function FileSelect(props: any) {
    const [list, setList] = useState<any[]>([]);
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [checkItem, setCheckItem] = useState<any>();
    const getList = async (_path?: string) => {
        const path = _path?.split(/[\\/:]/).filter(Boolean);
        const res = await getFileList({ path });
        setList(sortFilesAndFolders(res.data || []));
        setCurrentPath(path || []);
        setCheckItem(null)
    }
    useEffect(() => {

    }, []);

    const getLastPath = async () => {
        const cp = currentPath.slice(0, currentPath.length - 1);
        const res = await getFileList({ path: cp });
        setList(sortFilesAndFolders(res.data || []));
        setCurrentPath(cp || [])
    }

    useEffect(() => {
        if (!props.open) {
            setList([]);
            setCurrentPath([]);
        } else {
            getList()
        }
    }, [props.open])

    return <Modal width={"50vw"} title="选择路径" open={props.open} onClose={props?.onClose} onOK={() => props?.onOK(checkItem)}>
        <div className={styles.box} style={{ maxHeight: "60vh" }}>
            <ul>
                <li key={-1} className={styles.value} onDoubleClick={() => { getLastPath() }}><FolderOpenOutlined /> <span>上级 {currentPath}</span></li>
                {list.map((_, index) => {
                    return <li key={index} className={`${styles.value} ${checkItem?.index === index ? styles.checkItem : ''}`} onClick={() => { setCheckItem({ ..._, index }) }} onDoubleClick={() => { _.isDirectory ? getList(_.path) : null }}>{_.isDirectory ? <FolderOpenOutlined /> : <FileOutlined />} <span>{_.name}</span></li>
                })}
            </ul>
        </div>
    </Modal>
}