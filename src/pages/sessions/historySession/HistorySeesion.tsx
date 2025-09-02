import React, {useEffect, useState} from "react";
import "./style.less"
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {Conversations} from '@ant-design/x';
import type {ConversationsProps} from '@ant-design/x';
import {GetProp, message, theme} from 'antd';
import {createSession, delSession, queryAllSessions, querySessionById} from "../../../api/chat/chat";
import {CommonResponse, Session} from "../../../types";
import eventBus from "../../../utils/eventBus";

const HistorySession: React.FC = () => {
    const { token } = theme.useToken();
    const [items, setItems] = useState<GetProp<ConversationsProps, 'items'>>([]);
    const [activeKey, setActiveKey] = useState<ConversationsProps['activeKey']>(items[0]?.key);
    const style = {
        width: "100%",
        background: "#fafafa",
        borderRadius: token.borderRadius,
    };

    // 菜单配置
    const menuConfig: ConversationsProps['menu'] = (conversation) => ({
        items: [
            {
                label: '打开会话',
                key: '0',
                icon: <EditOutlined/>,
            },
            {
                label: '删除会话',
                key: '1',
                icon: <DeleteOutlined/>,
                danger: true,
            },
        ],
        onClick: (menuInfo) => {
            menuInfo.domEvent.stopPropagation();
            handleDelSession(conversation.key).then().catch(e=>{
                console.log("调用删除会话报错:",e)
            })
        },
    });

    // 获取所有会话
    const getAllSessions = async () => {
        const res = await queryAllSessions() as any
        const tempItems = res.data.map((item: any) => {
            return {
                key: item.id,
                label: item.title,
                timestamp: item.time,
                group: "",
                icon: "",
                disabled: false
            }
        })
        setItems(tempItems)
    }

    // 激活会话
    const handleActiveSession = async (id: string) => {
        const res = await querySessionById({id}) as CommonResponse<Session>
        if(res.code === 200){
            res.data.msgList = []
            eventBus.emit("activeSession", res.data)
        }else{
            message.warning(res.message)
        }
    }

    // 删除会话
    const handleDelSession = async (id: string) => {
        const res = await delSession({id}) as any
        if (res.code === 200) {
            message.success("删除成功")
            getAllSessions().then().catch(e=>{
                console.log("删除会话刷新列表报错:",e)
            })
        }
    }

    useEffect(() => {
        getAllSessions().then().catch(e=>{
            console.log("getAllSessions error",e)
        })
    }, []);

    return (
        <>
            <div className={"history"}>
                <Conversations
                    defaultActiveKey={items[0]?.key}
                    activeKey={activeKey}
                    menu={menuConfig}
                    items={items}
                    style={style}
                    onActiveChange={(key: string)=>{
                        setActiveKey(key)
                        handleActiveSession(key).then().catch(e=>{
                            console.log("激活会话报错:",e)
                        })
                    }}
                />
            </div>
        </>
    );
}

export default HistorySession;