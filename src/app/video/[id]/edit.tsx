import React from 'react'
import { View, StyleSheet } from 'react-native';
import EditForm from '../../../components/video/EditForm';

const edit: React.FC = () => {

    return (
        <View style={styles.container}>
            <EditForm />
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

export default edit;