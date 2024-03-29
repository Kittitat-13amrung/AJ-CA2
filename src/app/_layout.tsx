import { Stack, router, useNavigation } from 'expo-router';
import { Button, Image, Pressable, Text, View } from 'react-native';
import { SessionProvider } from '../contexts/AuthContext';
import { PaperProvider } from 'react-native-paper';
import UserModal from '../components/Navigation/UserModal';

export function LogoTitle(props: React.PropsWithChildren) {

  // go to home screen
  const handleLogoClick = () => {
    router.push('/');
  }

  // logo component
  return (
    <View style={{ flex: 0, flexWrap: "wrap", justifyContent: 'center', columnGap: 100 }}>
      <Pressable style={{ flex: 1, flexWrap: "wrap", justifyContent: 'center' }} onPress={handleLogoClick}>
        <Image
          style={{ width: 70, height: 70 }}
          source={{ uri: 'https://advanced-js.s3.eu-west-1.amazonaws.com/youtube-logo-png-46016.png' }}
        />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>YouTube</Text>
      </Pressable>
    </View>
  );
}

export default function Layout() {
  return (
    <SessionProvider>
      <PaperProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#181818' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitle: props => <LogoTitle {...props} />,
            headerRight: props => <UserModal />,
          }}
        />
      </PaperProvider>
    </SessionProvider>
  );
}
