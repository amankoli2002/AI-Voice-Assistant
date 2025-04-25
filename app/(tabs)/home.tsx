import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import Features from "@/app/components/Features";
import { Audio } from "expo-av";
import {
  uploadToAssemblyAI,
  startTranscription,
  pollTranscriptionStatus,
} from "@/src/api/assemblyAI";
import { sendToCohere } from "@/src/api/cohereAI"
import * as Speech from 'expo-speech'
import  { Image as Img}  from 'expo-image';

interface Message {
  role: "USER" | "CHATBOT";
  message: string;
}

const home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false)
  const scrollViewRef = useRef<ScrollView | null>(null);

  const speak = (text: string) => {
    setSpeaking(true);
    Speech.speak(text,{
      language: 'en-US',
      pitch: 1.0,
      rate:1.0,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false)
    })
    
  }

  const stopSpeak = () => {
    Speech.stop();
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        console.log("Permission to access microphone denied");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
      stopSpeak();
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return null;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setLoading(true);
      setRecording(null);
      console.log("Recording stopped and stored at", uri);

      if (uri) {
        const uploadUrl = await uploadToAssemblyAI(uri);
        if (uploadUrl) {
          const transcriptionId = await startTranscription(uploadUrl);
          if (transcriptionId) {
            const transcriptionData = await pollTranscriptionStatus(transcriptionId);
            console.log("Transcription status:", transcriptionData.status);
            console.log("Transcription text:", transcriptionData.text);
            fetchResponse(transcriptionData.text);
          }
        }
      } else {
        console.log("Recording URI is null");
      }
    } catch (error) {
      console.log("error: ", error);
      return null;
    }
  };

  const fetchResponse = async(inputData: string) => {
    if (inputData.length > 0){
      let newMessages = [...messages];
      newMessages.push({role:'USER', message: inputData});
      setMessages([...newMessages]);
      updateScrollView();
      // Ai response fetching
      const response = await sendToCohere(messages,inputData);
      setLoading(false);
      if (response === "Something went wrong.") Alert.alert("Error Occur ")
      else {
        newMessages.push({role: "CHATBOT", message: response});
        setMessages([...newMessages]);
        speak(response);
        updateScrollView();
        
      }

    } 
  }
  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated:true})
    },200)
    
  }

  const clear = () => {
    stopSpeak();
    setMessages([]);
  };

  const stopSpeaking = () => {
    stopSpeak()
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5 mt-5">
        <View className="flex-row justify-center">
          <Image
            source={require("../../assets/images/bot.png")}
            style={{ height: hp(15), width: hp(15) }}
          />
        </View>
        {/* features || messages */}
        {messages.length > 0 ? (
          <View className="gap-y-2 flex-1">
            <Text
              style={{ fontSize: wp(7) }}
              className="text-gray-600 font-semibold ml-1"
            >
              Assistant
            </Text>
            <View
              style={{ height: hp(62) }}
              className="bg-neutral-200 rounded-3xl p-4"
            >
              <ScrollView
                ref={scrollViewRef}
                bounces={false}
                className="gap-y-4"
                showsVerticalScrollIndicator={false}
              >
                {messages.map((message, index) => {
                  if (message.role === "CHATBOT") {
                    if (message.message.includes("https")) {
                      // ai generated image
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="p-2 flex rounded-3xl bg-emerald-100 rounded-tl-none">
                            <Image
                              source={{ uri: message.message }}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{ height: wp(60), width: wp(60) }}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      // text response
                      return (
                        <View
                          key={index}
                          style={{ width: wp(70) }}
                          className="bg-emerald-100 rounded-xl p-2 mb-3 rounded-tl-none"
                        >
                          <Text style={{ fontSize: 18 }}>
                            {message.message}
                          </Text>
                        </View>
                      );
                    }
                  } else {
                    //user input
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{ width: wp(70) }}
                          className="bg-white rounded-xl p-2 mb-3 rounded-tr-none"
                        >
                          <Text style={{ fontSize: 18 }}>
                            {message.message}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}
        {/* recording, clear and stop buttons */}
        <View className="flex justify-center mb-10 items-center">
          {
            loading? (
                <Img
                  className="rounded-full bg-red-400"
                  source={require("../../assets/images/loading.gif")}
                  style={{ width: hp(10), height: hp(10) }}
                  contentFit="contain"
                />  
            ): 
            recording ? (
              <TouchableOpacity
                onPress={stopRecording}
              >
                {/** recording start button*/}
                <Img
                  className="rounded-full"
                  source={require("../../assets/images/voiceLoading.gif")}
                  style={{ width: hp(10), height: hp(10) }}
                  contentFit="contain"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={startRecording}>
                {/** recording start button*/}
                <Image
                  className="rounded-full"
                  style={{ width: hp(10), height: hp(10) }}
                  source={require("../../assets/images/recordingIcon.png")}
                />
              </TouchableOpacity>
            )
          }
          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-400 rounded-3xl p-2 absolute right-10"
            >
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}
          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-400 rounded-3xl p-2 absolute left-10"
            >
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default home;
