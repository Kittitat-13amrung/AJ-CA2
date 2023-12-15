import React from 'react'

import { View, TextInput, Text, StyleSheet, Button, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { useSession } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export interface LoginFormTypes {
    email: string,
    password: string
}

const LoginForm: React.FC = () => {
    const { signIn } = useSession();

    const [form, setForm] = React.useState<LoginFormTypes>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = React.useState('');

    const handleInputChange = (event: NativeSyntheticEvent<TextInputChangeEventData>, title: string) => {
        setForm(prevState => ({
            ...prevState,
            [title]: event.nativeEvent.text
        }));
    }

    const handleSubmit = () => {
        fetch('https://aj-ca-1.vercel.app/api/channels/login', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }

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

    return (
        <View style={styles.container}>
            <Text style={styles.signIn}>Sign In</Text>
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

            <Text>{errors}</Text>

            <Button
                onPress={handleSubmit}
                title="Login"
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

export default LoginForm;