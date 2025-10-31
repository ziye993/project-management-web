

const baseUrl = 'http://127.0.0.1:30000/project';

export async function post(url: string, data = {}) {
  const res = await fetch(baseUrl + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(`请求失败：${res.status}`);
  return await res.json();
}

async function fetchStream(url: string, params: any, event: (data: any) => void) {
  const response: any = await fetch(baseUrl + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      event(true)
      break
    };
    const text = decoder.decode(value);
    event(text)
  }
}

export const getProjectList = async () => {
  return await post("/getProjectList");
}

export const forceRefreshList = async () => {
  return await post('/forceRefreshList')
}

export const runCom = async (param: { path: string; com: string }, event: (data: any) => void) => {
  fetchStream('/runCommand', { ...param }, event);
}

export const stopCommand = async (param: { path: string; com: string }) => {
  return await post('/stopCommand', param)
}
// getRunningList
export const getRunningList = async () => {
  return await post('/getRunningList')
}


export const addProjectFolder = async () => {
  return await post('/addProjectFolder')
}

export const getLogs = async () => {
  return await post('/getLogs');
}

export const openInVscode = async (param: any) => {
  return await post('/openInVscode', param);
}