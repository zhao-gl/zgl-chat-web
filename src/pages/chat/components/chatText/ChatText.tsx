import React, {useState} from "react";
import "quill/dist/quill.snow.css";
import "./style.less"
import {message} from "antd";
import {Sender} from "@ant-design/x";
import { Msg, ChatWinProps} from "../../../../types";

const ChatText: React.FC<ChatWinProps> = (props) => {
    const {session,setSession} = props
    const [value, setValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const sendMsg = async (content: string) => {
        const msg: Msg = {
            id: Date.now(), // 随机生成id
            content: content,
            time: new Date().toLocaleTimeString(),
            type: "self",
            placement: "end",
            sender: {
                name: "self"
            }
        }
        setSession({
            ...session,
            msgList: [...session.msgList, msg]
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