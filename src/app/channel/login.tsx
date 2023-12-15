import React from 'react'
import LoginForm from '../../components/channel/LoginForm';
import { StyleSheet, View } from 'react-native';


const login = () => {
    return (
        <View style={styles.container}>
            <LoginForm />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#161616'
    }
});

export default login;