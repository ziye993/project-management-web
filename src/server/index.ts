import message from "../UiComponents/Modal/message";

const baseUrl = 'http://127.0.0.1:30000/api';
export const upload = async (url: string, formData: FormData) => {
    // 如果文件存在，使用 FormData 发送数据


    // 发送请求
    const res = await fetch(baseUrl + url, {
        method: 'POST',
        body: formData,  // 使用 FormData
    });

    // 检查响应状态
    if (!res.ok) {
        console.log(res, 'res');
        message.error({ content: "服务器错误" });
        throw new Error(`请求失败：${res.status}`);
    }

    // 解析响应 JSON 数据
    const jsonData = await res.json();
    console.log(jsonData);

    // 检查返回的数据状态
    if (jsonData.code !== 0 && !jsonData.success) {
        message.error({ content: jsonData?.msg });
        throw new Error(`请求失败 code ：${jsonData.code}`);
    }

    return jsonData;
}
export async function post(url: string, data = {}) {
    const res = await fetch(baseUrl + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        console.log(res, 'res')
        message.error({ content: "服务器错误" })
        throw new Error(`请求失败：${res.status}`)
    };
    const jsonData = await res.json();
    console.log(jsonData)
    if (jsonData.code !== 0 && !jsonData.success) {
        message.error({ content: jsonData?.msg })
        throw new Error(`请求失败 code ：${jsonData.code}`)
    }
    return jsonData
}

export async function fetchStream(url: string, params: any, event: (data: any) => void) {
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