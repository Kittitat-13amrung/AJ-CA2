import { Stack, router, useNavigation } from 'expo-router';
import { Button, Image, Pressable, Text, View } from 'react-native';
import UserModal from '../components/Navigation/UserModal';
import { SessionProvider } from '../contexts/AuthContext';

export function LogoTitle(props: React.PropsWithChildren) {

  // go to home screen
  const handleLogoClick = () => {
    router.replace('/');
  }

  // logo component
  return (
    <View style={{ flex: 0, flexWrap: "wrap", justifyContent: 'center', columnGap: 100 }}>
      <Pressable style={{ flex: 1, flexWrap: "wrap", justifyContent: 'center', columnGap: 10 }} onPress={handleLogoClick}>
        <Image
          style={{ width: 35, height: 25 }}
          source={{ uri: 'https://advanced-js.s3.eu-west-1.amazonaws.com/download+(1).png' }}
        />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>YouTube</Text>
      </Pressable>
      {/* <NavSearch /> */}
    </View>
  );
}

export default function Layout() {
  return (
    <SessionProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#181818' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: props => <LogoTitle {...props} />,
          headerRight: props => <UserModal {...props} />,
        }}
      />
    </SessionProvider>
  );
}
