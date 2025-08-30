import React, {useEffect, useState} from "react";
import "quill/dist/quill.snow.css";
import "./style.less"
import {message} from "antd";
import {Sender, XStream} from "@ant-design/x";
import { Msg, ChatWinProps} from "@/types";

const ChatText: React.FC<ChatWinProps> = (props) => {
    const {session,setSession} = props
    const [value, setValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const sendMsg = async (v: string) => {
        const msg: Msg = {
            id: Date.now(), // 随机生成id
            content: v,
            time: new Date().toLocaleTimeString(),
            type: "self",
            placement: "end",
            sender: {
                name: "self"
            }
        }
        setSession({
            ...session,
            userMsgList: [...session.userMsgList, msg]
        })

    }

    return (
        <div className="chat-text">
            <Sender
                loading={loading}
                value={value}
                rootClassName={'chat-text-sender'}
                onChange={(v) => {
                    setValue(v);
                }}
                onSubmit={async (v) => {
                    await sendMsg(v)
                    setValue("");
                    // setLoading(true);
                }}
                onCancel={() => {
                    setLoading(false);
                    message.error('Cancel sending!');
                }}
                // onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>)=>{enter(e)}}
                autoSize={{minRows: 6, maxRows: 6}}
            />
        </div>
    )
}

export default ChatText;