
import { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { getProjectList, forceRefreshList as _forceRefreshList, runCom, stopCommand, getRunningList, getLogs } from '../../api';
import ToolHead from '../../compomeents/ToolHeader';
import { ApiOutlined, CloseCircleOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import GlobalScripts from '../../compomeents/GlobalScripts';
// const mockData = [
//   { label: 'test1', value: '111', path: '/test/test/test/test/test/test', scripts: [{ label: 'dev', value: 'dev', command: 'npm run dev' }] },
// ];

interface IProjectData {
  projectList: {
    label: string;
    value: string;
    path: string;
    hasRunning?: boolean;
    scripts: {
      label: string;
      value: string;
      command?: string;
      checked?: boolean;
      running?: boolean;
      runningId?: string | number;
      connect?: boolean;
    }[];
    checked?: boolean;
  }[];
}

export default function Home() {
  const [projectData, setProjectData] = useState<IProjectData>({ projectList: [] });
  const projectList = projectData?.projectList?.map?.(_ => {
    return {
      ..._,
      hasRunning: _.scripts.some(__ => __.running),
      hasMask: _.scripts.some(__ => __.running !== undefined)
    }
  }) || [];
  const currentProjectIndex = projectList.findIndex(_ => _.checked);
  const currentProject = projectList?.[currentProjectIndex];
  const currentCommandIndex = currentProject?.scripts?.findIndex?.(_ => _.checked);
  const currentCommand = currentProject?.scripts?.[currentCommandIndex];
  const logRef = useRef<any>({});
  const [refCount, setRefCount] = useState(1);
  const logs: any[] = logRef.current?.[currentProject?.value]?.[currentCommand?.value]?.logs || []
  const commandBoxRef = useRef<HTMLDivElement>(null);
  console.log(logs)
  const init = async () => {
    const { success: projectSuccess, data: projectData } = await getProjectList();
    const { success: runningSuccess, data: runningList } = await getRunningList();
    if (runningSuccess) {
      projectData?.forEach((_: any) => {
        if (runningList?.[_?.value]) {
          _?.scripts?.forEach?.((__: any) => {
            if ((runningList?.[_.value] as string[])?.includes(__.value)) {
              __.running = true;
            }
          })
        }
      });
    }
    projectSuccess && setProjectData((prev: any) => ({ ...prev, projectList: projectData || [] }));
    const logResult = await getLogs();
    if (logResult) logRef.current = logResult.data || {};
  }
  const forceRefreshList = async () => {
    const data = await _forceRefreshList();
    setProjectData((prev: any) => ({ ...prev, projectList: data.data }))
  }
  const setProjectChecked = async (index: number) => {
    setProjectData(prev => {
      let nPrev = { ...prev };
      nPrev.projectList.forEach(_ => _.checked = false);
      nPrev.projectList[index].checked = true;
      return nPrev
    });
  }
  const setCommandRunning = (item: any) => {
    setProjectData(prev => {
      const nPrev = { ...prev };
      nPrev.projectList[currentProjectIndex].scripts?.forEach(_ => {
        _.checked = _.value === item.value;
        if (_.value === item.value) {
          _.running = true;
          _.connect = true;
        }
      });
      return nPrev
    });
  }
  const setCommandChecked = async (item: any) => {

    setProjectData(prev => {
      const nPrev = { ...prev };
      nPrev.projectList[currentProjectIndex].scripts?.forEach(_ => _.checked = _.value === item.value);
      return nPrev
    });
  }
  const runCommand = async (item: any) => {
    if (!currentProject) {
      return
    }
    if (currentProject?.scripts?.[item.value]?.running && item.connect) {
      return
    }
    if (!logRef.current?.[currentProject?.value]) {
      logRef.current[currentProject?.value] = {};
    }
    if (!logRef.current[currentProject?.value][item.value]) {
      logRef.current[currentProject?.value][item.value] = {
        logs: [],
        key: `${currentProject.value}:${item.value}`,
        event: undefined,
      }
    }

    logRef.current[currentProject?.value][item.value].event = function (data: string | boolean) {
      if (data === true) {
        const [project, command] = (this as string).split(":")
        const currentProjectIndex = projectList.findIndex(_ => _.value === project);
        const currentProject = projectList?.[currentProjectIndex];
        const currentCommandIndex = currentProject?.scripts?.findIndex?.(_ => _.value === command);
        setProjectData(prev => {
          let nPrev = { ...prev };
          nPrev.projectList[currentProjectIndex].scripts[currentCommandIndex].running = false;
          return nPrev;
        })
        setRefCount(prev => prev <= 10000 ? prev + 1 : 1);
        return
      }
      let text = (data as string).replace(/^\r?\n|\r?\n$/g, '');
      const error = text.includes('[[E]]');
      if (error) text = text.slice(5);
      logRef.current[currentProject?.value][item.value].logs.push({ text, type: error ? 'error' : undefined });
      setRefCount(prev => prev <= 10000 ? prev + 1 : 1);
    }

    runCom({
      ...item,
      project: currentProject.value,
      path: currentProject?.path
    },
      logRef.current[currentProject?.value][item.value].event.bind(`${currentProject.value}:${item.value}`)
    );
    setCommandRunning(item);
  }
  const stop = async (item: any) => {
    const data = await stopCommand({
      ...item,
      project: currentProject.value,
      path: currentProject?.path
    });
    if (!data.success) {
      return
    }
    setProjectData(prev => {
      const nPrev = { ...prev };
      nPrev.projectList[currentProjectIndex].scripts?.forEach(_ => {
        if (_.value === item.value) {
          _.running = false;
          _.checked = false
        }
      });
      return nPrev
    });

  }

  const close = async (item: any) => {
    if (item.running) {
      const data = await stopCommand({
        ...item,
        project: currentProject.value,
        path: currentProject?.path
      });
      if (!data.success) {
        return
      }
    }
    setProjectData(prev => {
      const nPrev = { ...prev };
      nPrev.projectList[currentProjectIndex].scripts?.forEach(_ => {
        if (_.value === item.value) {
          _.running = undefined;
          _.checked = false
        }
      });
      return nPrev
    });

  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (commandBoxRef.current) {
      const el = commandBoxRef.current;
      el?.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth', // 可选：平滑滚动
      });
    }
  }, [refCount])


  return <div className={styles.box}>
    <ToolHead forceRefreshList={() => { forceRefreshList() }} />
    <div className={styles.contentBox}>
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
      <div className={styles.content}>
        <div className={styles.contentHeadButton}>
          <GlobalScripts className={styles.comButton} item={{ path: currentProject?.path, }} />
          {currentProject?.scripts?.filter?.(_ => _?.running === undefined)?.map((_: any) => {
            return <div key={_.value} className={`${styles.comButton} ${_?.checked ? styles.comButtonChecked : ''}`} onClick={() => runCommand(_)}>{_?.label}</div>
          })}
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
      </div>
      <div className={styles.list}>
        <p>正在运行中的</p>
        {currentProject?.scripts?.filter?.(_ => _?.running !== undefined)?.map(_ => {
          return <div key={_.value} className={`${styles.itemBox} ${styles.runningItemBox} ${_?.checked ? styles.checkedItem : ''}`} onClick={() => { setCommandChecked(_) }}>
            <span>{_.label}</span>
            <div>
              {_.running && !_.connect && <ApiOutlined onClick={() => runCommand(_)} />}
              {_.running ? <PauseCircleOutlined onClick={(e) => { e.stopPropagation(); stop(_) }} /> : <PlayCircleOutlined onClick={(e) => { e.stopPropagation(); runCommand(_) }} />}
              <CloseCircleOutlined onClick={(e) => { e.stopPropagation(); close(_) }} />

            </div>

          </div>
        })}
      </div>
    </div>
  </div>
}