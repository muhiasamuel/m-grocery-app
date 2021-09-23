//import liraries
import React, { Component,useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import "firebase/storage";
import 'firebase/firestore';
import * as Linking from 'expo-linking';
import Firebase from '../../../firebaseConfig';
import { AuthenticatedUserContext } from '../../../AuthProvider/AuthProvider';

// create a component
const OrderDispatch = ({route}) => {
    const {AuthUserRole, setAuthUserRole} = useContext(AuthenticatedUserContext);
    const [order, setorder] = useState()

    useEffect(() => {
        let{item} = route.params
        setorder(item)
    }, [])
    return (
        <View style={styles.container}>
            <Text>OrderDispatc</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default OrderDispatch;
