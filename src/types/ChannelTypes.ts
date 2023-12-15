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
    subscriber: number,
    createdAt?: Date,
    updatedAt?: Date
}