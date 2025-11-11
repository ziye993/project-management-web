import { useState } from 'react'
import UserHeader from '../../compomeents/UserHeader'
import styles from './index.module.less'
import { AlignLeftOutlined, BarChartOutlined, CodeOutlined, DesktopOutlined, FileOutlined, FolderOpenOutlined, FundViewOutlined, PartitionOutlined } from '@ant-design/icons'
import { useNavigete } from '../../Router'

const _data = {
    data: [{
        id: 7,
        name: '代码管理',
        icon: <CodeOutlined />,
        code: 'codeMenege',
        path: '/project',
    }, {
        id: 2,
        name: '图像',
        code: 'image',
        icon: <FundViewOutlined />,
        path: '/image',
    }, {
        id: 3,
        name: '影视',
        icon: <DesktopOutlined />,
        code: 'television',
        path: '/television',
    }, {
        id: 4,
        name: '系统配置',
        icon: <AlignLeftOutlined />,
        code: 'config',
        path: '/config',
    }, {
        id: 5,
        name: '服务器状态信息',
        icon: <BarChartOutlined />,
        code: 'serverInfo',
        path: '/serverInfo',
    }, {
        id: 6,
        name: '局域网共享',
        icon: <PartitionOutlined />,
        code: 'LANSharing',
        path: '/LANSharing',
    }, {
        id: 1,
        name: '文件',
        code: 'file',
        path: '/file',
        icon: <FolderOpenOutlined />
    },]
}

export default function ZiyeHome() {
    const [data, setData] = useState(_data.data);
    const { push } = useNavigete();
    return <div className={styles.box}>

        <div className={styles.content}>
            <UserHeader />
            <div className={styles.fun}>
                {data.map((_, index) => {
                    return <div key={index} className={styles.funItem} onClick={() => { push(_.path) }}>
                        {_.icon}
                        <span>{_.name}</span>
                    </div>
                })}
            </div>
        </div>


    </div>
}