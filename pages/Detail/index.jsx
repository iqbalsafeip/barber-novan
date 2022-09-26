import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  StatusBar,
  Linking,
} from "react-native";
import DateTime from "@react-native-community/datetimepicker";
import MapView from "react-native-maps";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CardLayanan from "../../component/CardLayanan";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { getTransaksi } from "../../utils/redux/actions";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

function Detail(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({
    tanggal: new Date(),
    jam: "",
    _tanggal: "",
  });

  const dispatch = useDispatch()
  const { id } = props.route.params
  const [isTanggal, setTgl] = useState(false);
  const [isJam, setJm] = useState(false);
  const [location, setLocation] = useState(null);
  const [current ,setCurrent] = useState({})
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const handleDateChange = (event, date) => {
    // setData({ date: date })

    const current = date || data.tanggal;
    setData({
      ...data,
      tanggal: current,
      _tanggal: new Date(current).toDateString(),
    });
    setTgl(false);
  };

  const handleJam = (event, date) => {
    const current = date || data.tanggal;
    const newDate = new Date(current);
    setData({ ...data, jam: newDate.getHours() + ":" + newDate.getMinutes() });
    setJm(false);
  };

  useEffect(() => {
    setLoading(true)
    dispatch(getTransaksi(id))
      .then(res => {
        setCurrent(res.data)
        setLoading(false)
        alert(JSON.stringify(current))
        // alert(JSON.stringify(res))
      })
      .catch(err => {
        setLoading(false)
        alert(JSON.stringify(err))
      })
      handleLokasi()
  }, []);

  const handleLokasi = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      Alert.alert("Permission to access location was denied");
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setLoading(false);

    setLocation(location);
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <ScrollView
          style={{
            backgroundColor: "white",
            width: width,
            minHeight: height,
          }}
        >
          <View
            style={[
              {
                width: "100%",
                minHeight: 60,
                backgroundColor: "pink",
              },
              styles.colCenter,
            ]}
          >
            <View
              style={[
                styles.container,
                {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <Pressable onPress={() => props.navigation.navigate("Riwayat")}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </Pressable>
              <Text style={[styles.heading, { color: "white" }]}>BARON</Text>
            </View>
          </View>
          <View
            style={[
              {
                borderBottomStartRadius: 25,
                borderBottomEndRadius: 25,
                backgroundColor: "pink",
                width: "100%",
                paddingVertical: 20,
              },
            ]}
          >
            <View style={styles.container}>
              <Text style={[styles.heading, { marginTop: 10 }]}>
                Detail Booking
              </Text>
            </View>
          </View>
          <View style={[styles.container, { marginBottom: 100 }]}>
            <View
              style={[
                styles.colCenter,
                {
                  justifyContent: "flex-start",
                  width: "100%",
                  marginVertical: 15,
                },
              ]}
            >
              <Text>Layanan yang dipesan : </Text>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Jasa Cukur
              </Text>
              <Text>Nama Pencukur : </Text>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Alex Rudrigo
              </Text>
              <Text>Tanggal Booking : {current.tanggal}</Text>
              <Text>Jam Booking : {current.waktu}</Text>
              <Text>Status : {current.status}</Text>
            </View>
            <View
              style={[
                styles.rowCenter,
                {
                  width: "100%",
                  justifyContent: "flex-start",
                  marginBottom: 10,
                },
              ]}
            >
              <Ionicons name="location-outline" size={18} color="black" />
              <Text>Lokasi</Text>
            </View>
            {!isLoading && (
              <MapView
                style={{ width: "100%", height: 300 }}
                initialRegion={{
                  latitude: current.latitude,
                  longitude: current.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                <MapView.Marker
                  coordinate={location?.coords}
                  title={"Lokasi Kamu Sekarang"}
                />
              </MapView>
            )}

            <View
              style={[
                styles.rowCenter,
                {
                  width: "100%",
                  justifyContent: "flex-start",
                  marginVertical: 10,
                },
              ]}
            >
              <Ionicons name="location-outline" size={18} color="black" />
              <Text>Detail Alamat : </Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: "#c7c7c7",
                borderRadius: 10,
              }}
            >
              <Text>{current.detail_alamat}</Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: "#bdd7ff",
                borderRadius: 10,
              }}
            >
              <View
                style={[
                  styles.rowCenter,
                  {
                    width: "100%",
                    justifyContent: "flex-start",
                    marginVertical: 5,
                  },
                ]}
              >
                <MaterialIcons name="payment" size={18} color="black" />
                <Text>Detail Pembayaran : </Text>
              </View>
              <View
                style={[
                  styles.colCenter,
                  {
                    justifyContent: "flex-start",
                    width: "100%",
                    marginVertical: 15,
                  },
                ]}
              >
                <Text>Layanan yang dipesan : </Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Jasa Cukur
                </Text>
                <Text>Harga Jasa : </Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Rp. {current?.servis?.harga_servis}
                </Text>
                <Text>Ongkos Transportasi Rp. 2000 /km : </Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Rp. {current.ongkir}
                </Text>
                <Text>Total Bayar : </Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Rp. {parseInt(current?.servis?.harga_servis) + parseInt(current.ongkir)}
                </Text>
              </View>
            </View>
            <Pressable
              style={[styles.button, styles.buttonPrimary, { marginTop: 15 }]}
              onPress={() => Linking.openURL("https://wa.me/62895801066893")}
            >
              <Text style={styles.textStyle}>Hubungi Pencukur</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonDanger, { marginTop: 15 }]}
            >
              <Text style={styles.textStyle}>Batalkan</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                ,
                { marginTop: 15, width: "100%" },
              ]}
            >
              <Text style={styles.textStyle}>Tandai Selesai</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { width: "90%", alignSelf: "center" },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  colCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#03fc73",
  },
  buttonDanger: {
    backgroundColor: "#fc034e",
  },
  buttonPrimary: {
    backgroundColor: "#5280ff",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Detail;
