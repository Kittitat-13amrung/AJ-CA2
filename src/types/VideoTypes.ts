export interface VideoTypes {
    _id: string,
    key?: string,
    empty?: boolean,
    url: string,
    title: string,
    thumbnail: string,
    duration: number,
    description?: string,
    likes?: number,
    dislikes?: number,
    updatedAt: Date,
    createdAt: Date,
    views: number,
    comments?: [{
        _id: string,
        _channel_id: string,
        body: string,
        likes: number,
        dislikes: number,
    }],
    channel?: {
        _id: string,
        username: string,
        avatar: string
    }
}

export interface UploadFormTypes {
    title: string,
    description: string,
    tag: string,
    thumbnail?: Blob,
}