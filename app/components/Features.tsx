import { View, Text, Image } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Features = () => {
  return (
    <View style = {{height: hp(60)}} className='gap-y-4'>
      <Text style={{fontSize: wp(6.5)}} className='font-semibold text-gray-700'>Features</Text>
      <View className='bg-emerald-200 p-4 rounded-xl gap-y-2'>
        <View className='flex-row items-center gap-x-1 '>
            <Image source={(require('../../assets/images/chatgpticon.png'))} style={{height: hp(4), width: hp(4), borderRadius: 8, marginRight: 10, marginBottom: 5}} />
            <Text style = {{fontSize: wp(6)}} className='font-semibold text-gray-700'>ChatGPT</Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className='text-gray-700 font-medium'>
          ChatGPT can provide you with instant and knowledgeable responses, assist you with creative ideas on a wide range of topics
        </Text>
      </View>
      <View className='bg-purple-200 p-4 rounded-xl gap-y-2'>
        <View className='flex-row items-center gap-x-1 '>
            <Image source={(require('../../assets/images/dalleicon.png'))} style={{height: hp(4), width: hp(4), borderRadius: 8, marginRight: 10, marginBottom: 5}} />
            <Text style = {{fontSize: wp(6)}} className='font-semibold text-gray-700'>DALL-E</Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className='text-gray-700 font-medium'>
          DALL-E can generate imaginative and diverse images from textual descriptions, expanding the boundaries of visual creativity
        </Text>
      </View>
      <View className='bg-cyan-200 p-4 rounded-xl gap-y-2'>
        <View className='flex-row items-center gap-x-1 '>
            <Image source={(require('../../assets/images/smartaiIcon.png'))} style={{height: hp(4), width: hp(4), borderRadius: 8, marginRight: 10, marginBottom: 5}} />
            <Text style = {{fontSize: wp(6)}} className='font-semibold text-gray-700'>Smart AI</Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className='text-gray-700 font-medium'>
          A powerful voice assistant with the abilities of ChatGPT and Dell-E, providing you the best of both worlds.
        </Text>
      </View>
    </View>
  )
}

export default Features