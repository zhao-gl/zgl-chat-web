
export interface Session {
    id: number;
    title: string;
    userMsgList: Msg[];
    aiMsgList: Msg[];
}

export interface Msg {
    id: number;
    content: string;
    time: string;
    type: string; // 0 普通消息 1 系统消息
    placement: "start" | "end";
    sender: UserSlice
}

export interface ChatWinProps {
    session: Session
    setSession?: (session: Session) => void
}
export interface ChatWinProps {
    session: Session
    setSession: (session: Session) => void
}