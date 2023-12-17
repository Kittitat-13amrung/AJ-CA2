import { VideoTypes } from "./VideoTypes";

export interface RegisterFormTypes {
    email: string,
    username: string,
    password: string,
    avatar?: Blob,
}

export interface channelType {
    _id: string,
    username: string,
    email: string,
    avatar: string,
    videos: VideoTypes[],
    subscribers: number,
    liked?: string[],
    disliked?: string[],
    comment_liked?: string[],
    comment_disliked?: string[],
    createdAt?: Date,
    updatedAt?: Date
}