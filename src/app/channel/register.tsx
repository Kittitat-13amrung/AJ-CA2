import React from 'react'
import { View, StyleSheet } from 'react-native';
import RegisterForm from '../../components/channel/RegisterForm';

const register: React.FC = () => {
    return (
        <View style={styles.container}>
            <RegisterForm />
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

export default register;