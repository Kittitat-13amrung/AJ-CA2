import React from 'react'
import { Image, StyleSheet } from 'react-native';

const Avatar: React.FC<{ avatar: string, avatarSize?: number }> = ({ avatar, avatarSize }) => {
    const [size, setSize] = React.useState({ width: avatarSize, height: avatarSize });

    return (
        <Image style={[styles.avatar, size]} source={{ uri: avatar }} />
    )
}

Avatar.defaultProps = {
    avatarSize: 40
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 100,
    }
});

export default Avatar;