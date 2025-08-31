import React, {useEffect, useState} from "react";
import "./style.less"
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {Conversations} from '@ant-design/x';
import type {ConversationsProps} from '@ant-design/x';
import {GetProp, message, theme} from 'antd';
import {delSession, queryAllSessions} from "../../../api/chat/chat";

const HistorySession: React.FC = () => {
    const { token } = theme.useToken();
    const [items, setItems] = useState<GetProp<ConversationsProps, 'items'>>([]);
    const style = {
        width: "100%",
        background: "#fafafa",
        borderRadius: token.borderRadius,
    };
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
                <Conversations defaultActiveKey="item1" menu={menuConfig} items={items} style={style}/>
            </div>
        </>
    );
}

export default HistorySession;