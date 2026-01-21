import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { processImage } from '@/utils/ocr';

export default function ScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !processing) {
        setProcessing(true);
        try {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo) {
                 const result = await processImage(photo.uri);
                 // Navigate to result with params.
                 // Note: passing objects in params is not ideal in expo-router/deep linking,
                 // so we pass the ID and re-fetch or find the object in the next screen.
                 router.replace({
                     pathname: "/result",
                     params: { medicationId: result.id }
                 });
            }
        } catch (error) {
            console.error(error);
            setProcessing(false);
        }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      <View style={styles.overlay}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                <FontAwesome name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
                <FontAwesome name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
        </View>

        <View style={styles.topOverlay}>
            <Text style={styles.overlayText}>Align medication packaging within frame</Text>
        </View>

        <View style={styles.middleOverlay}>
            <View style={styles.scanFrame}>
              <View style={styles.frameCornerTopLeft} />
              <View style={styles.frameCornerTopRight} />
              <View style={styles.frameCornerBottomLeft} />
              <View style={styles.frameCornerBottomRight} />
            </View>
        </View>

        <View style={styles.bottomOverlay}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={processing}>
                {processing ? (
                    <ActivityIndicator size="large" color="#000" />
                ) : (
                    <View style={styles.captureInner} />
                )}
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 50,
      paddingHorizontal: 20,
  },
  closeButton: {
      padding: 10,
  },
  flipButton: {
      padding: 10,
  },
  topOverlay: {
      alignItems: 'center',
      marginTop: 20,
  },
  overlayText: {
      color: '#fff',
      fontSize: 16,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 10,
      borderRadius: 5,
  },
  middleOverlay: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
  },
  scanFrame: {
      width: 280,
      height: 280,
      justifyContent: 'space-between',
  },
  frameCornerTopLeft: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 40,
      height: 40,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderColor: '#4cd137',
  },
  frameCornerTopRight: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 40,
      height: 40,
      borderTopWidth: 4,
      borderRightWidth: 4,
      borderColor: '#4cd137',
  },
  frameCornerBottomLeft: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 40,
      height: 40,
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderColor: '#4cd137',
  },
  frameCornerBottomRight: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 40,
      height: 40,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: '#4cd137',
  },
  bottomOverlay: {
      alignItems: 'center',
      marginBottom: 50,
  },
  captureButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
  },
  captureInner: {
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 2,
      borderColor: '#000',
      backgroundColor: '#fff',
  },
});
