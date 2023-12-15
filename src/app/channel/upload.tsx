import React from 'react';
import { View, StyleSheet } from 'react-native';
import UploadForm from '../../components/video/UploadForm';
import { Redirect } from 'expo-router';
import { useSession } from '../../contexts/AuthContext';

const upload: React.FC = () => {
    const {session} = useSession();

    if(!session) {
        return <Redirect href='/channel/login'/>
    }

    return (
        <View style={styles.container}>
            <UploadForm />
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

export default upload;