export interface CommentProps {
    _id: string,
    body: string,
    likes: number,
    dislikes: number,
    children: string[],
    _channel_id: {
        _id: string,
        avatar: string,
        username: string,
    },
    updatedAt: Date
}