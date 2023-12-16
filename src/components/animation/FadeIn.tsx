import React from 'react'
import { Animated, Pressable } from 'react-native'

type Props = {
    children: React.ReactElement | string | number
}

const FadeIn: React.FC<Props> = (props: Props) => {
    const [fadeAnim, setFadeAnim] = React.useState(new Animated.Value(0))  // Initial value for opacity: 0
    const [isClicked, setIsClicked] = React.useState(false)  // Initial value for opacity: 0


    React.useCallback(() => {
        if (isClicked) {
            console.log(true)
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 10000,
                    useNativeDriver: true,
                }
            ).start();

            setIsClicked(false);
            setFadeAnim(new Animated.Value(0));
        }
    }, [isClicked])
    return (
        <Animated.Text
            style={{
                opacity: fadeAnim,
            }}
            onPress={() => setIsClicked(true)}
        >
            {props.children}
        </Animated.Text>
    )
}

export default FadeIn