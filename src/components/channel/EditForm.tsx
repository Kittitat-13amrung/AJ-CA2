import React from 'react'

import { View, Image, TextInput, Text, StyleSheet, Button, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { UpdateFormTypes } from '../../types/ChannelTypes';
import { useProfileState } from '../../hooks/useProfileState';

const EditForm: React.FC = () => {
    // login session
    const clientChannel = useProfileState();
    const { channelId } = useLocalSearchParams();

    const [form, setForm] = React.useState<UpdateFormTypes>({
        email: '',
        username: '',
        password: '',
    });
    const [imagePreview, setImagePreview] = React.useState('');
    const [errors, setErrors] = React.useState('');

    React.useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/channels/${channelId}`, {
            method: "GET"
        })
            .then(async (data) => {
                const response = await data.json();

                if (data.ok) {
                    return response;
                }

                throw response;
            })
            .then(res => {
                console.log(res.email);

                setForm({
                    email: res.email,
                    username: res.username,
                    password: res.password,
                });

                setImagePreview(res.thumbnail);
            })
            .catch(err => {
                console.error(err);
            });

    }, []);

    const handleInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>, title: string) => {
        setForm(prevState => ({
            ...prevState,
            [title]: event.nativeEvent.text
        }));
    }

    const handleSubmit = () => {
        if (!clientChannel) return;

        if(Object.keys(form).length < 1) return;

        const formData = new FormData();

        Object.keys(form).forEach(key => formData.append(key, form[key]));

        fetch('https://aj-ca-1.vercel.app/api/channels/update', {
            method: 'POST',
            body: formData,
        })
            .then(async (data) => {
                const response = await data.json();

                if (data.ok) {
                    return response;
                }

                throw response
            })
            .then(res => {
                router.push({
                    pathname: '/channel/[id]',
                    params: {
                        id: clientChannel._id
                    }
                });
                console.log(res)
            })
            .catch(err => {
                console.error(err)

                setErrors(err.message);
            })
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);

        const avatar = await fetchImageFromUri(result.assets[0].uri);

        if (!result.canceled) {
            setForm(prev => ({
                ...prev,
                avatar: avatar
            }));

            console.log(avatar)

            setImagePreview(result?.assets[0].uri)
        }
    }

    const fetchImageFromUri = async (uri:string) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log(blob)
        return blob;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.signIn}>Register</Text>
            <Text style={styles.inputTitle}>Email:</Text>
            <TextInput
                id={'email'}
                textContentType={'emailAddress'}
                autoComplete={'email'}
                style={styles.input}
                placeholder='email'
                value={form?.email}
                onChange={(e) => handleInputChange(e, "email")}
            />

            <Text style={styles.inputTitle}>Username:</Text>
            <TextInput
                id={'username'}
                textContentType={'name'}
                autoComplete={'username'}
                style={styles.input}
                placeholder='username'
                value={form?.username}
                onChange={(e) => handleInputChange(e, "username")}
            />

            <Text style={styles.inputTitle}>Password:</Text>
            <TextInput
                id={'password'}
                secureTextEntry={true}
                textContentType={'password'}
                autoComplete={'password'}
                style={styles.input}
                placeholder='password'
                value={form?.password}
                onChange={(e) => handleInputChange(e, "password")}
            />

            <Text style={styles.inputTitle}>Profile Picture:</Text>
            <Image 
            source={{ uri: imagePreview }}
            style={form?.avatar ? { width: 232, height: 231, marginVertical: 12 } : { marginVertical: 12 }}
            />
            <Button onPress={pickImage} title='Pick your profile picture' />

            <Text style={{ marginVertical: 12 }}>{errors}</Text>

            <Button
                onPress={handleSubmit}
                title="Update"
                color="#262626"
                accessibilityLabel="Submit form"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    signIn: {
        marginBottom: 40,
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    inputTitle: {
        color: 'white'
    },
    container: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#212121',
        width: '50%'
    },
    input: {
        backgroundColor: '#fff',
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default EditForm;