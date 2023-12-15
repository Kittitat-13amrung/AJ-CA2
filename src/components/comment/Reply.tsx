import React from 'react'
import { View, TextInput, Button, NativeSyntheticEvent, TextInputChangeEventData, NativeTouchEvent } from 'react-native';
import Avatar from '../channel/Avatar';
import { useSession } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { CommentProps } from '../../types/CommentTypes';

type Props = {
    to: string,
    id: string,
    avatar: string,
    updateComments?: React.Dispatch<React.SetStateAction<CommentProps[] | undefined>>

}

const Reply: React.FC<Props> = (props: Props) => {
    const [comment, setComment] = React.useState<{ body: string }>({
        body: ''
    });
    const [showBtn, setShowBtn] = React.useState<boolean>(false);

    // when input is focused
    const handleInputFocus = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        if (!session) return router.replace('/');

        setShowBtn(true);
    }

    // when input is blurred
    const handleInputBlur = () => {
        setShowBtn(!showBtn);
    }

    // login session
    const { session } = useSession();

    // fetch reply to db
    const handleOnReply = async() => {
        if (!session) return;

        try {
            const channel = JSON.parse(session);

            // props.to to comment on - either video or comment
            const resource  = {
                video: 'https://aj-ca-1.vercel.app/api/comments/video/',
                comment: 'https://aj-ca-1.vercel.app/api/comments/'
            }

            const replyTo = props.to;

            // fetch reply
            const reply = await fetch(`${resource[replyTo as keyof typeof resource]}${props.id}/create`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${channel.token}`
                },
                body: JSON.stringify(comment)
            });

            const res = await reply.json();

            // console.log(res);
        } catch(err) {
            console.error(err)
        }
    }

    // control state
    const handleInputChange = (text:string) => {
        setComment({
            body: text
        });
    };

    return (
        <>
            {/* Reply Input  */}
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 20, columnGap: 20 }}>
                <Avatar avatar={props.avatar} />
                <TextInput onFocus={handleInputFocus} onChangeText={handleInputChange} style={{ color: 'white', borderBottomColor: 'white', borderBottomWidth: 1, width: '100%', paddingVertical: 20 }} value={comment?.body} placeholder='Add a comment..' />
            </View>

            {/* if reply input is focused */}
            {showBtn && (
                <View style={{ flex: 1, flexDirection: 'row', columnGap: 20, justifyContent: 'flex-end', minWidth: '100%', marginTop: 20 }}>
                    <Button title='Cancel' onPress={handleInputBlur} color={'#999999'} />
                    <Button title='Reply' onPress={handleOnReply}/>
                </View>
            )}
        </>
    )
}

export default Reply;