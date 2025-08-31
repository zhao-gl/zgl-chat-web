import React, {useEffect} from "react";
import {ChatWinProps, Msg} from "../../../../types"
import {Bubble} from "@ant-design/x";
import "./style.less"
import {UserOutlined} from "@ant-design/icons";

const ChatWin: React.FC<ChatWinProps> = (props) => {
    const {session} = props
    const [msgList, setMsgList] = React.useState<Msg[]>([])

    const barAvatar: React.CSSProperties = {
        color: '#fff',
        backgroundColor: '#87d068',
    };

    // 滚动到聊天窗口底部
    const scrollToEnd = () => {
        const el = document.querySelector(".chat-win")
        el?.scrollTo(0, el.scrollHeight)
    }

    useEffect(() => {
        setMsgList(session.msgList)
        scrollToEnd()
    }, [session])

    return (
        <>
            <h3 style={{marginBottom: "10px"}}>{session.title}</h3>
            <div className="chat-win">
                {msgList.map((item): React.ReactNode => {
                    return (
                        item.placement === "start" ? (
                            <Bubble
                                key={item.id}
                                placement={"start"}
                                avatar={{icon: <UserOutlined/>, style: barAvatar}}
                                content={item.content}
                                typing={true}
                                style={{marginBottom: "10px"}}
                            />
                        ) : (
                            <Bubble
                                key={item.id}
                                placement={"end"}
                                avatar={{icon: <UserOutlined/>, style: barAvatar}}
                                content={item.content}
                                style={{marginBottom: "10px"}}
                            />
                        )

                    )
                })}
                {/*{session.userMsgList.map((item): React.ReactNode => {*/}
                {/*    return (*/}
                {/*        <Bubble*/}
                {/*            key={item.id}*/}
                {/*            placement={"end"}*/}
                {/*            avatar={{icon: <UserOutlined/>, style: barAvatar}}*/}
                {/*            content={item.content}*/}
                {/*            style={{marginBottom: "10px"}}*/}
                {/*        />*/}
                {/*    )*/}
                {/*})}*/}
                {/*{session.aiMsgList.map((item): React.ReactNode => {*/}
                {/*    return (*/}
                {/*        <Bubble*/}
                {/*            key={item.id}*/}
                {/*            placement={"start"}*/}
                {/*            avatar={{icon: <UserOutlined/>, style: barAvatar}}*/}
                {/*            content={item.content}*/}
                {/*            typing={true}*/}
                {/*            style={{marginBottom: "10px"}}*/}
                {/*        />*/}
                {/*    )*/}
                {/*})}*/}
            </div>
            {/*<Button onClick={queryQwen}>发送</Button>*/}
        </>
    )
}
export default ChatWin;