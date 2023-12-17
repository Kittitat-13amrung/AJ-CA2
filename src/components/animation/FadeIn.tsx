import React from 'react'
import { Animated } from 'react-native'

type Props = {
    style?: object,
    children: React.ReactElement | string | number
}

const FadeIn: React.FC<Props> = (props: Props) => {
    const [fadeAnim] = React.useState(new Animated.Value(0))  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    }, [])
    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim,         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    )
}

export default FadeIn