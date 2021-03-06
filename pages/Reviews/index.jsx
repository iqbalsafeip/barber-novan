import React, { useEffect, useState } from "react";
import { Button, TextInput, StyleSheet, View, Text, SafeAreaView, Dimensions, ScrollView, Pressable, Image, TouchableOpacity, Alert, Modal, StatusBar } from "react-native";
import DateTime from '@react-native-community/datetimepicker'
import MapView from "react-native-maps";
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'
import CardLayanan from "../../component/CardLayanan";
import * as Location from 'expo-location';
import CardReview from "../../component/CardReview";
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height

function Reviews(props) {

    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState({
        tanggal: new Date(),
        jam: '',
        _tanggal: ''
    })

    const [isTanggal, setTgl] = useState(false);
    const [isJam, setJm] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setLoading] = useState(false);


    const handleDateChange = (event, date) => {
        // setData({ date: date })

        const current = date || data.tanggal
        setData({ ...data, tanggal: current, _tanggal: new Date(current).toDateString() })
        setTgl(false)
    }

    const handleJam = (event, date) => {
        const current = date || data.tanggal
        const newDate = new Date(current)
        setData({ ...data, jam: newDate.getHours() + ":" + newDate.getMinutes() });
        setJm(false)
    }

    useEffect(() => {
        handleLokasi()
    }, [])

    const handleLokasi = async () => {
        setLoading(true)
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            Alert.alert('Permission to access location was denied')
            setLoading(false)
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log(location);
        setLoading(false)

        setLocation(location);
    }


    return (
        <>
            <StatusBar />
            <SafeAreaView>
                <ScrollView style={{
                    backgroundColor: 'white',
                    width: width,
                    minHeight: height
                }} >
                    <View style={[{
                        width: '100%',
                        minHeight: 60,
                        backgroundColor: 'pink',

                    }, styles.colCenter]} >
                        <View style={[styles.container, {
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }]}>
                            <Pressable onPress={() => props.navigation.navigate('Home')} >
                                <Ionicons name="arrow-back" size={30} color="black" />
                            </Pressable>
                            <Text style={[styles.heading, { color: 'white' }]} >BARON</Text>
                        </View>
                    </View>
                    <View style={[{
                        borderBottomStartRadius: 25,
                        borderBottomEndRadius: 25,
                        backgroundColor: 'pink',
                        width: '100%',
                        paddingVertical: 20
                    }]} >
                        <View style={styles.container} >
                            <Text style={[styles.heading, { marginTop: 10 }]} >Review Alex Rudrigo</Text>
                        </View>
                    </View>
                    <View style={[styles.container, { marginBottom: 100 }]} >
                        <CardReview />
                        <CardReview />
                        <CardReview />
                        <CardReview />
                        <CardReview />
                        <CardReview />

                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { width: '90%', alignSelf: 'center' },
    rowCenter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    colCenter: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 24,

    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: width * 0.9
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2
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

    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default Reviews;
