import type { IProjectListItem } from '../../../type';
import styles from './index.module.less';

interface IProps {
	projectList: IProjectListItem[];
	setProjectChecked: Function;
}

export default function Left(props: IProps) {
	const { projectList, setProjectChecked } = props;

	return (
		<div className={styles.list}>
			<p>已找到列表</p>
			{projectList.map((_: any, index: number) => {
				return <div key={_.value} className={`${styles.itemBox} ${_.checked ? styles.checkedItem : ''}`} onClick={() => { setProjectChecked(index) }}>
					<span className={`
              ${styles.hasRunningicon} 
              ${_.hasMask ? (_.hasRunning
							? styles.hasRunning : styles.maskHasPause) : styles.noMask}
              `}></span>
					<span className={styles.projectItemName}>{_.label}</span>
					<span className={styles.path} title={_.path}>{_.path}</span>
				</div>
			})}
		</div>
	)
}