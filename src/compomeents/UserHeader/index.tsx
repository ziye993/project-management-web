
import useUserInfo from '../../hooks/useUserInfo'
import styles from './index.module.less'

interface IProps {

}

export default function UserHeader(props: IProps) {
    const { userInfo } = useUserInfo();
    return <div className={styles.box}>
        <div className={styles.otherChildren}></div>
        <div className={styles.userBox}>
            <span>{userInfo?.userName}</span>
            <div className={styles.userMenu}>
                test
            </div>
        </div>
    </div>
}