import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, SafeAreaView, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PillScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    Animated.loop(
      Animated.timing(scanAnimation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [scanAnimation]);

  const handleScan = () => {
    router.push('/analysis-result');
  };

  const handleFocus = () => {
    if (cameraRef.current) {
        cameraRef.current.focus();
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.permissionText}>No access to camera</Text>
            <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>Open Settings</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
  }

  const scanTranslateY = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="arrow-back-ios-new" size={20} color="white" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <MaterialIcons name="medical-services" size={18} color="#0fbdbd" />
                <Text style={styles.title}>RxVerify</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="help-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanTranslateY }] }]} />
            </View>
            <View style={styles.statusContainer}>
                <View style={styles.statusPill}>
                    <View style={styles.liveDot} />
                    <Text style={styles.statusText}>ANALYZING TEXT...</Text>
                </View>
            </View>
            <View style={styles.helperTextContainer}>
                <View style={styles.matchTag}>
                    <MaterialIcons name="check-circle" size={14} color="#102222" />
                    <Text style={styles.matchText}>98% MATCH</Text>
                </View>
                <Text style={styles.helperText}>Align pill within frame</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.focusButton} onPress={handleFocus}>
                <MaterialIcons name="center-focus-weak" size={18} color="white" />
                <Text style={styles.focusText}>TAP TO FOCUS</Text>
            </TouchableOpacity>
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton}>
                <View style={styles.controlButtonInner}>
                    <MaterialIcons name="photo-library" size={24} color="white" />
                </View>
                <Text style={styles.controlText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shutterButton} onPress={handleScan}>
                <View style={styles.shutterButtonInner}>
                  <MaterialIcons name="filter-center-focus" size={36} color="#102222" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <View style={styles.controlButtonInner}>
                    <MaterialIcons name="flash-on" size={24} color="white" />
                </View>
                <Text style={styles.controlText}>Flash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Camera>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102222',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 32,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#0fbdbd',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopLeftRadius: 16,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopRightRadius: 16,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 16,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomRightRadius: 16,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(15, 189, 189, 0.4)',
  },
  statusContainer: {
    position: 'absolute',
    top: '15%',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: 'rgba(15, 189, 189, 0.3)',
    borderWidth: 1,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0fbdbd',
    marginRight: 8,
  },
  statusText: {
    color: '#0fbdbd',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  helperTextContainer: {
    position: 'absolute',
    bottom: '15%',
    alignItems: 'center',
  },
  matchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0fbdbd',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  matchText: {
    color: '#102222',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  helperText: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 4,
    borderRadius: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(16, 34, 34, 0.45)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'center',
  },
  focusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
  },
  controlButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginTop: 4,
  },
  shutterButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
  },
  shutterButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0fbdbd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#0fbdbd',
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
