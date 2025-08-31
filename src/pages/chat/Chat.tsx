import React, {useEffect, useState} from "react";
import "./style.less"
import {Msg, Session} from "@/types"
import ChatWin from "./components/chatWin/ChatWin";
import ChatText from "./components/chatText/ChatText";
import eventBus from "@/utils/eventBus";
import {XStream} from "@ant-design/x";
import {queryAllSessions} from "../../api/chat/chat";

const Chat:React.FC = () => {
    const [session, setSession] = useState<Session>()


    async function queryQwen(content) {
        const data = {
            type: "qwen",
            role: "user",
            content: content,
            model: "qwen-turbo"
        }
        console.log("before response",session.msgList)
        const response = await fetch("http://localhost:3000/chat/ask",{method: "POST", body: JSON.stringify(data)})
        let accumulatedContent = "";
        const msgId = Date.now();
        for await (const chunk of XStream({
            readableStream: response.body,
        })) {
            console.log("response",session.msgList)
            if(chunk.event === "end") return

            // 安全解析JSON数据
            let resData;
            try {
                resData = JSON.parse(chunk.data)
            } catch (e) {
                console.error("Failed to parse chunk data:", e);
                continue;
            }

            // 验证必要字段
            if (!resData.id) {
                console.warn("Message missing id field:", resData);
                continue;
            }
            // 安全访问嵌套属性
            try {
                resData.placement = "start"
                accumulatedContent += resData.content || "";
            } catch (e) {
                console.error("Failed to access content from choices:", e);
                resData.content = ""; // 设置默认值
            }

            // 创建或更新消息
            const newMsg: Msg = {
                id: msgId,
                content: accumulatedContent,
                time: new Date().toLocaleTimeString(),
                type: "ai",
                placement: "start",
                sender: {
                    name: "AI"
                }
            };

            // 检查消息是否已存在
            const existIndex = session.msgList.findIndex(item => item.id === msgId);

            if (existIndex !== -1) {
                // 更新现有消息
                const updatedMsgList = [...session.msgList];
                updatedMsgList[existIndex] = newMsg;
                console.log("updatedMsgList",updatedMsgList)
                setSession({
                    ...session,
                    msgList: updatedMsgList
                });
            } else {
                console.log("ai newMsg",newMsg)
                // 添加新消息
                setSession({
                    ...session,
                    msgList: [...session.msgList, newMsg]
                });
            }
        }
    }

    // 接收新会话
    eventBus.on("addSession", (newSession: Session) => {
        setSession({
            ...newSession,
            msgList: newSession.msgList || [],
        })
    })

    // 获取AI回复
    const queryAi = (ai: string,content: string)=>{
        switch (ai) {
            case "qwen":
                queryQwen(content).then().catch(e=>{
                    console.log("queryAi error",e)
                })
                break;
        }
    }

    // 监听列表最新消息
    useEffect(() => {
        // console.log("update session",session)
        if(session?.msgList.length > 0 && session?.msgList[session?.msgList.length - 1].type === "self"){
            const content = session?.msgList[session?.msgList.length - 1].content
            queryAi("qwen", content)
        }
    }, [session?.msgList]);

    return (
        <div className="chat">
            {session &&
                <>
                    <ChatWin session={session} setSession={setSession}></ChatWin>
                    <ChatText session={session} setSession={setSession}></ChatText>
                </>
            }
            {!session &&
                <div className="no-session">
                    点击新会话开始聊天
                </div>
            }
        </div>
    )
}

export default Chat;