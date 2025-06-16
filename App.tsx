import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraShow, setIsCameraShow] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrText, setQrText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  const resetScanner = () => {
    setScanned(false);
    setQrText(null);
    setIsLoading(false);
    setIsCameraShow(false);
  };

  const handleQrScanned = (scanningResult: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      const qrData = scanningResult?.data;
      const isURL = /^https?:\/\/.+/.test(qrData);

      if (isURL) {
        setIsLoading(true);
        setTimeout(() => {
          Linking.openURL(qrData);
          resetScanner();
        }, 1000);
      } else {
        setQrText(qrData);
        setIsCameraShow(false);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {isCameraShow ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleQrScanned}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>
                <Icon name="camera-outline" size={30} color="#4F8EF7" />
              </Text>
            </TouchableOpacity>
            <Button
              title="Kamerayı Kapat"
              onPress={() => setIsCameraShow(false)}
            />
          </View>
        </CameraView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.message}>Camera is not visible</Text>
          <View>
            <Button title="Show Camera" onPress={() => setIsCameraShow(true)} />
            {isLoading && (
              <View style={styles.loadingBox}>
                <Text style={styles.loadingText}>
                  Bağlantıya yönlendiriliyor...
                </Text>
              </View>
            )}
          </View>
          {qrText && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>QR İçeriği:</Text>
              <Text style={styles.resultText}>{qrText}</Text>
            </View>
          )}

          <Button title="Sayfayı Yenile" onPress={resetScanner} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  message: {
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
  },

  camera: {
    flex: 1,
    width: "100%",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 30,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3, // Android için gölge
    shadowColor: "#000", // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  loadingBox: {
    marginTop: 20,
    backgroundColor: "#dff0d8",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },

  loadingText: {
    color: "#3c763d",
    fontSize: 16,
    fontWeight: "bold",
  },

  resultBox: {
    marginTop: 25,
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },

  resultText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },

  // İstersen buraya reset butonu için de stil ekleyebilirsin
});
