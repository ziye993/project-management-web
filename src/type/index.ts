
export interface IProjectScript {
    label: string;
    value: string;
    command?: string;
    checked?: boolean;
    running?: boolean;
    runningId?: string | number;
    connect?: boolean;
}
export interface IProjectListItem {
    label: string;
    value: string;
    path: string;
    hasRunning?: boolean;
    scripts: IProjectScript[];
    checked?: boolean;
}

export interface IProjectData {
    projectList: IProjectListItem[];
}