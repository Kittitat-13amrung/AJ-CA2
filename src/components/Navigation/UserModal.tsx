import React from 'react';
import { Modal, StyleSheet, Text, Pressable, View, Image, Button, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useSession } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import Avatar from '../channel/Avatar';

const UserModal = () => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const { session, signOut } = useSession();
    const [channel, setChannel] = React.useState<{
        _id: string,
        email: string,
        username: string,
        password: string,
        avatar?: string,
    }>();

    React.useEffect(() => {
        if(session) {
            const credentials = JSON.parse(session);
            console.log(credentials);

            setChannel(credentials);
        }
    }, []);

    // handle sign out btn clicked
    // redirect to login page
    const handleSignOutButton = async () => {
        signOut();

        router.replace('/channel/login');

        setModalVisible(!modalVisible);
    };

    // conditional rendering sign in if user has not logged in
    const shouldRenderSignIn = !channel ? (
        <View style={{ marginRight: 10 }}>
            <Button title="Sign In" color={'#282828'} onPress={() => router.push('/channel/login')} />
        </View>
    ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', columnGap: 12 }}>
            <Button title='upload' onPress={() => router.push('/channel/upload')} />

            <View style={styles.container}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.centeredView}
                        onPressOut={() => setModalVisible(!modalVisible)}
                    >
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                {/* <Text style={styles.modalText}>Hello World!</Text> */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: 10, marginBottom: 10, columnGap: 20, borderBottomColor: '#404040', borderBottomWidth: 1 }}>
                                    <Avatar avatar={channel.avatar} />
                                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>@{channel.username}</Text>
                                </View>

                                {/* Channel */}
                                <View style={{ flex: 1, flexDirection: 'column', rowGap: 10, alignItems: 'flex-end' }}>
                                    <Pressable
                                        onPress={() => router.push(`/channel/${channel._id}` as any)}>
                                        <Text style={styles.textStyle}>Your Channel</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => router.push(`/channel/${channel._id}/edit` as any)}>
                                        <Text style={styles.textStyle}>Channel Setting</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={handleSignOutButton}>
                                        <Text style={styles.textStyle}>Sign Out</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>
                <Pressable
                    style={styles.modal}
                    onPress={() => setModalVisible(true)}>
                    <Avatar avatar={channel?.avatar} />
                </Pressable>
            </View>
        </View>
    );

    return shouldRenderSignIn;
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 30
    },
    userLogo: {
        borderRadius: 100,
        aspectRatio: '1',
        width: 35
    },
    modal: {
        flex: 1,
        alignItems: 'flex-end',
        backgroundColor: '#292929',
        borderRadius: 20,
        // width: 100,
        padding: 2.5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginTop: 46,
        zIndex: -10
    },
    modalView: {
        margin: 20,
        backgroundColor: '#242424',
        borderRadius: 20,
        padding: 35,
        alignItems: 'flex-end',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 20,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: '600',
    },
    modalText: {
        marginBottom: 15,
        color: 'white',
        textAlign: 'center',
    },
});

export default UserModal;