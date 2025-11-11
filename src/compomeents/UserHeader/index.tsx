
import useUserInfo from '../../hooks/useUserInfo'
import styles from './index.module.less'

interface IProps {
    className?: string;
    children?: any;
}

export default function UserHeader(props: IProps) {
    const { userInfo } = useUserInfo();
    console.log(props)
    return <div className={`${styles.box} ${props.className || ''}`}>
        <div className={styles.otherChildren}>
            {props.children}
        </div>
        <div className={styles.userBox}>
            <span className={styles.UserName}>{userInfo?.userName?.toUpperCase()}</span>
            <div className={styles.userMenu}>
                <div className={styles.userMenuContent}>
                    <div className={styles.menuitem}>
                        test
                    </div>

                </div>

            </div>
        </div>
    </div>
}