import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { performOCR } from '../../services/ocr';
import { findMedication, Medication } from '../../services/verification';
import { addToHistory } from '../../services/storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScannerScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(CameraType.back);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Medication | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const cameraRef = useRef<Camera>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4 text-lg">We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-blue-500 p-4 rounded-lg">
           <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
        setLoading(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
            setImageUri(photo.uri);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
  };

  const handleVerify = async () => {
    if (!imageUri) return;
    setAnalyzing(true);
    setScanError(null);
    try {
        const texts = await performOCR(imageUri);

        if (texts.length === 0) {
           setScanError("No text detected. Please ensure the image is clear and well-lit.");
           setResult(null);
           setShowResult(true);
           return;
        }

        const med = findMedication(texts);
        if (med) {
            setResult(med);
            addToHistory(med);
        } else {
            setScanError("Medication not found in database. Please try scanning the brand name directly.");
            setResult(null);
        }
        setShowResult(true);
    } catch (e) {
        setScanError("An error occurred during verification.");
        setShowResult(true);
    } finally {
        setAnalyzing(false);
    }
  };

  const retake = () => {
    setImageUri(null);
    setShowResult(false);
    setResult(null);
    setScanError(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      {imageUri ? (
        <View className="flex-1">
            <Image source={{ uri: imageUri }} className="flex-1" resizeMode="contain" />

            {analyzing && (
                <View className="absolute inset-0 bg-black/50 justify-center items-center">
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text className="text-white mt-4 font-bold text-lg">Analyzing...</Text>
                </View>
            )}

            {!analyzing && (
                <View className="absolute bottom-10 w-full flex-row justify-center gap-4">
                    <TouchableOpacity onPress={retake} className="bg-gray-500 p-4 rounded-full px-8">
                        <Text className="text-white font-bold">Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleVerify} className="bg-green-500 p-4 rounded-full px-8">
                        <Text className="text-white font-bold">Verify</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={showResult} animationType="slide" presentationStyle="pageSheet">
                <View className="flex-1 bg-white">
                    <View className="p-4 flex-row justify-end">
                        <TouchableOpacity onPress={() => setShowResult(false)} className="p-2">
                            <Text className="text-blue-500 text-lg">Close</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6">
                        {result ? (
                            <View>
                                <View className="bg-green-100 p-6 rounded-xl border border-green-300 mb-6 items-center">
                                    <Text className="text-green-800 text-3xl font-bold mb-2">Safe to Use</Text>
                                    <Text className="text-green-700 text-center">Medication Verified: {result.names[0]}</Text>
                                </View>

                                <Text className="text-2xl font-bold mb-2">{result.names.join(' / ')}</Text>
                                <Text className="text-gray-600 mb-6 text-lg">{result.description}</Text>

                                <View className="mb-6">
                                    <Text className="text-xl font-bold mb-2 text-blue-800">Dosage</Text>
                                    <View className="bg-blue-50 p-4 rounded-lg">
                                        <Text className="text-gray-800 text-lg">{result.dosage}</Text>
                                    </View>
                                </View>

                                <View className="mb-6">
                                    <Text className="text-xl font-bold mb-2 text-red-800">Interactions & Warnings</Text>
                                    <View className="bg-red-50 p-4 rounded-lg border border-red-100">
                                        <Text className="font-bold text-red-700 mb-2">Do not mix with:</Text>
                                        {result.interactions.map((interaction, idx) => (
                                            <Text key={idx} className="text-red-600 mb-1">• {interaction}</Text>
                                        ))}
                                        <Text className="mt-4 font-bold text-red-700">Warning:</Text>
                                        <Text className="text-red-600">{result.warnings}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View className="items-center justify-center mt-20">
                                <View className="bg-red-100 p-6 rounded-full mb-6">
                                    <Text className="text-4xl">⚠️</Text>
                                </View>
                                <Text className="text-2xl font-bold text-red-600 mb-2">Not Identified</Text>
                                <Text className="text-center text-gray-600 text-lg">{scanError}</Text>
                                <TouchableOpacity onPress={() => setShowResult(false)} className="mt-8 bg-gray-800 p-4 rounded-lg px-8">
                                    <Text className="text-white font-bold">Try Again</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>
        </View>
      ) : (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                className="flex-1 justify-end items-center pb-10"
            >
                 <View className="absolute top-20 w-full items-center">
                    <Text className="text-white text-lg bg-black/50 px-4 py-1 rounded-full overflow-hidden">Scan Medicine Package</Text>
                 </View>
                <TouchableOpacity onPress={takePicture} disabled={loading} className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 items-center justify-center">
                    {loading && <ActivityIndicator color="#000" />}
                </TouchableOpacity>
            </LinearGradient>
        </Camera>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
