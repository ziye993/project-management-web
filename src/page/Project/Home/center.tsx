import { useEffect, useRef } from 'react';
import GlobalScripts from '../../../compomeents/GlobalScripts';
import type { IProjectListItem, IProjectScript } from '../../../type';
import styles from './index.module.less';


interface IProps {
    currentProject: IProjectListItem,
    currentCommand: IProjectScript;
    refCount: number;
    runCommand: Function;
    logs: any[];
    commandBoxRef: React.RefObject<HTMLDivElement | null>;
}
export default function Center(props: IProps) {
    const { currentProject, currentCommand, refCount, runCommand, logs, commandBoxRef } = props;
    const boxRef = useRef<HTMLDivElement>(null);
    const buttonBoxRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (buttonBoxRef.current && boxRef.current) {
            if (buttonBoxRef.current.style) {
                buttonBoxRef.current.style.width = (boxRef.current?.clientWidth - 30) + "px";
            }
        }
    }, [])
    return (<div className={styles.content} ref={boxRef}>
        <div className={styles.contentHeadButton} ref={buttonBoxRef} style={{ width: "0px" }}>
            <GlobalScripts className={`${styles.comButton} ${styles.globalScripts}`} item={{ path: currentProject?.path, }} />
            {/* <div className={styles.contentHeadButtonCenter}> */}
            {currentProject?.scripts?.filter?.(_ => _?.running === undefined)?.map((_: any) => {
                return <div key={_.value} style={{ order: _.sortIndex }} className={`${styles.comButton} ${_?.checked ? styles.comButtonChecked : ''}`} onClick={() => runCommand(_)}>{_?.label}</div>
            })}
            {/* </div> */}
        </div>
        <div className={styles.commandBottonLine}></div>
        <div className={styles.cmdContent}>
            {currentCommand?.label && <code className={styles.commandName} >{currentCommand?.label} {`：`} {currentCommand?.command}</code>}
            <div className={styles.commandLogBox} ref={commandBoxRef} >
                {refCount && logs.map((_, index) => {
                    return <code key={index} className={styles.codeline} style={{ color: _.type === 'error' ? 'red' : '#333', margin: '2px 0' }}>
                        {_.text}
                    </code>
                })}
            </div>
        </div>
    </div>)
}