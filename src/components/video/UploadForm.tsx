import React from 'react'

import { View, Image, TextInput, Text, StyleSheet, Button, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSession } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { UploadFormTypes } from 'src/types/VideoTypes';

const UploadForm: React.FC = () => {
    const { signIn } = useSession();

    const [form, setForm] = React.useState<UploadFormTypes>({
        title: '',
        description: '',
        tag: '',
    });

    const [imagePreview, setImagePreview] = React.useState('');
    const [errors, setErrors] = React.useState('');

    const handleInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>, title: string) => {
        setForm(prevState => ({
            ...prevState,
            [title]: event.nativeEvent.text
        }));
    }

    const handleSubmit = () => {
        const formData = new FormData();

        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('tag', form.tag)
        
        if(form.thumbnail) {
            // console.log(newthumbnail)
            formData.append('thumbnail', form.thumbnail)
        }

        fetch('https://aj-ca-1.vercel.app/api/videos/create', {
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
                signIn(res);
                router.replace('/');
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

        if(!result.assets) return; 

        const thumbnail = await fetchImageFromUri(result.assets[0].uri);

        if (!result.canceled) {
            setForm(prev => ({
                ...prev,
                thumbnail: thumbnail
            }));

            console.log(thumbnail)

            setImagePreview(result?.assets[0].uri)
        }
    }

    const fetchImageFromUri = async (uri:string) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        return blob;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.signIn}>Upload</Text>
            <Text style={styles.inputTitle}>Title:</Text>
            <TextInput
                id={'title'}
                style={styles.input}
                placeholder='Title'
                value={form?.title}
                onChange={(e) => handleInputChange(e, "title")}
            />

            <Text style={styles.inputTitle}>Description:</Text>
            <TextInput
                id={'description'}
                style={styles.input}
                placeholder='Description'
                value={form?.description}
                onChange={(e) => handleInputChange(e, "description")}
            />

            <Text style={styles.inputTitle}>Tag:</Text>
            <TextInput
                id={'tag'}
                secureTextEntry={true}
                style={styles.input}
                placeholder='Tag'
                value={form?.tag}
                onChange={(e) => handleInputChange(e, "tag")}
            />

            <Text style={styles.inputTitle}>Thumbnail:</Text>
            <Image 
            source={{ uri: imagePreview }}
            style={form?.thumbnail ? { width: 232, height: 231, marginVertical: 12 } : { marginVertical: 12 }}
            />
            <Button onPress={pickImage} title='Upload your thumbnail' />

            <Text style={{ marginVertical: 12 }}>{errors}</Text>

            <Button
                onPress={handleSubmit}
                title="Upload"
                color="#262626"
                accessibilityLabel="Upload video"
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

export default UploadForm;