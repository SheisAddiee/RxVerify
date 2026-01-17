import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
// Note: We are using 'CameraView' which is the modern standard for Expo SDK 50+

// SAFETY CHECK: These imports will fail until Member 3 creates their files.
// For now, we will comment them out so you can see the UI working first.
// import { scanImageForText } from '../utils/ocrService'; 
// import { analyzeDrugText } from '../utils/drugSearch'; 

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState(null);
  const cameraRef = useRef(null);

  // 1. Permission Check
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', color: 'white', marginBottom: 20 }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. The Core Logic
  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        // Take picture
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        
        console.log(photo); // <--- ADD THIS LINE to fix the error

        // --- TEMPORARY DEMO MODE ---
        setTimeout(() => {
            setResult({
                status: 'success',
                data: { brand_name: 'Panadol (Demo)', description: 'Pain relief.', warning: 'Safe.' }
            });
            setModalVisible(true);
            setLoading(false);
        }, 1500);

      } catch (_error) { // Ensure this is _error as we fixed before
        Alert.alert("Error", "Camera failed.");
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        
        {/* The "Future Health" Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.scanText}>Align Medicine Name within Frame</Text>
        </View>

        {/* Capture Button */}
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#00FFC2" />
          ) : (
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>

      {/* Result Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {result && (
              <>
                <View style={[styles.statusHeader, { backgroundColor: result.status === 'success' ? '#d4edda' : '#f8d7da' }]}>
                  <Text style={[styles.statusText, { color: result.status === 'success' ? '#155724' : '#721c24' }]}>
                    {result.status === 'success' ? '✔ VERIFIED SAFE' : '⚠ WARNING'}
                  </Text>
                </View>

                <Text style={styles.drugName}>{result.data ? result.data.brand_name : "Unknown"}</Text>
                <Text style={styles.description}>
                  {result.data ? result.data.description : "No description."}
                </Text>

                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeBtnText}>Scan Next Item</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 3. Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  button: { backgroundColor: '#00FFC2', padding: 15, borderRadius: 10 },
  text: { fontWeight: 'bold' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  scanFrame: { width: 280, height: 200, borderWidth: 0, position: 'relative' },
  corner: { width: 40, height: 40, borderColor: '#00FFC2', position: 'absolute', borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanText: { color: 'white', marginTop: 20, fontSize: 16, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 5 },
  buttonContainer: { position: 'absolute', bottom: 50, alignSelf: 'center' },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, minHeight: 350 },
  statusHeader: { padding: 10, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 15 },
  statusText: { fontWeight: 'bold', fontSize: 14 },
  drugName: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
  closeBtn: { backgroundColor: '#000', padding: 18, borderRadius: 15, alignItems: 'center' },
  closeBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});