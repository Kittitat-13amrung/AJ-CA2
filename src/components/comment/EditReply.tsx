import React from 'react'
import { View, TextInput, Button, NativeSyntheticEvent, TextInputChangeEventData, NativeTouchEvent } from 'react-native';
import { useSession } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { CommentProps } from '../../types/CommentTypes';

type Props = {
    id: string,
    updateComments?: React.Dispatch<React.SetStateAction<CommentProps | undefined>>
    isEditing?: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const EditReply: React.FC<Props> = (props: Props) => {
    const [comment, setComment] = React.useState<{ body: string }>({
        body: ''
    });
    const [showBtn, setShowBtn] = React.useState<boolean>(true);

    // when input is focused
    const handleInputFocus = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        if (!session) return router.replace('/');

        setShowBtn(true);
    }

    // when input is blurred
    const handleInputBlur = () => {
        props.isEditing(false);
    }

    // login session
    const { session } = useSession();

    // fetch reply to db
    const handleOnReply = async() => {
        if (!session) return;

        try {
            const credentials = JSON.parse(session);

            // fetch reply
            const reply = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comments/${props.id}/update`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${credentials.token}`
                },
                body: JSON.stringify(comment)
            });

            const res = await reply.json();

            props.isEditing(false);

            const newComment = {
                ...res,
                _channel_id: {
                    _id: credentials._id,
                    avatar: credentials.avatar,
                    username: credentials.username
                }
            }

            setComment({body: ''});

            props.updateComments(newComment);

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

export default EditReply;