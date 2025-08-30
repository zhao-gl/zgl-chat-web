import React, {useEffect, useState} from "react";
import "./style.less"
import {Msg, Session} from "@/types"
import ChatWin from "./chatWin/ChatWin";
import ChatText from "./chatText/ChatText";
import eventBus from "@/utils/eventBus";
import {XStream} from "@ant-design/x";

const Chat:React.FC = () => {
    const [session, setSession] = useState<Session>()


    async function queryQwen(content) {
        const data = {
            type: "qwen",
            role: "user",
            content: content,
            model: "qwen-turbo"
        }
        console.log("userMsgList 2",session.userMsgList)
        const response = await fetch("http://localhost:3000/chat/ask",{method: "POST", body: JSON.stringify(data)})
        let accumulatedContent = "";
        const msgId = Date.now();
        for await (const chunk of XStream({
            readableStream: response.body,
        })) {
            console.log("userMsgList 3",session.userMsgList)
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
            const existIndex = session.aiMsgList.findIndex(item => item.id === msgId);

            if (existIndex !== -1) {
                // 更新现有消息
                const updatedMsgList = [...session.aiMsgList];
                updatedMsgList[existIndex] = newMsg;
                console.log("updatedMsgList",updatedMsgList)
                setSession({
                    ...session,
                    aiMsgList: updatedMsgList
                });
            } else {
                // 添加新消息
                setSession({
                    ...session,
                    aiMsgList: [...session.aiMsgList, newMsg]
                });
            }
        }
    }

    // 接收新会话
    eventBus.on("addSession", (newSession: Session) => {
        setSession({
            ...newSession,
            userMsgList: newSession.userMsgList || [],
            aiMsgList: newSession.aiMsgList || []
        })
    })

    useEffect(() => {
        console.log("session",session)
    }, [session]);

    useEffect(() => {
        if (!session?.userMsgList || session.userMsgList.length === 0) return;

        const lastUserMsg = session.userMsgList[session.userMsgList.length - 1];
        // 确保这是新消息且不是AI消息
        if (lastUserMsg && lastUserMsg.type === "self") {
            queryQwen(lastUserMsg.content);
        }
    }, [session?.userMsgList]);

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