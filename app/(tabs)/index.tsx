import { Text, View,Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from "expo-router";
 

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
      <View className="space-y-2">
        <Text style={{fontSize: wp(10)}} className="text-center font-bold text-gray-700">
          Jarvis
        </Text>
        <Text style={{fontSize: wp(4)}} className="text-center tracking wider text-gray-600 font-semibold">
          The Future is here, powered by AI.
        </Text>
      </View>
      <View className="flex-row justify-center">
        <Image source={require('../../assets/images/welcome.png')} style={{width: wp(75),height: wp(75)}}/>
      </View>
      <TouchableOpacity className="bg-emerald-600 mx-5 p-4 rounded-full" onPress={() => router.push("./home")}>
        <Text style={{fontSize: wp(6)}}className='text-center font-bold text-white '>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
