import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors, Divider, Title } from  'react-native-paper';
import { FONTS } from '../constants/themes';

const paymentInstructions = () => {
    return (
        <View>
            <Title style={{textAlign:'center', color:Colors.green900,...FONTS.h1, fontWeight:'bold'}}>Mpesa Payment Instructions</Title>
            <Divider/>
            <Text style={styles.textstyle}>1.  On the M-PESA Menu Go to "Lipa Na M-PESA</Text>
            <Divider/>
            <Text style={styles.textstyle}>2.  Select Buy Goods and Services; Enter <Text style={{fontWeight:'bold', color:Colors.lightGreenA500,...FONTS.body1}}> 783456 </Text> as the till no and press OK</Text>
            <Divider/>
            <Text style={styles.textstyle}>3.  Enter the Amount You Wish To Pay (The total Cost For All Products + Shipment Charges) and Press OK</Text>
            <Divider/>
            <Text style={styles.textstyle}>4.  Enter Your Mpesa Pin and Press OK</Text>
            <Divider/>
            <Text style={styles.textstyle}>5.  Confirm that all details are correct and press OK You will receive a confirmation SMS from M-PESA immediately.</Text>
            <Divider/>
            <Text style={styles.textstyle}>Note!<Text style={{fontWeight:'bold', color:Colors.greenA700,...FONTS.body4}}> You Should Only Pay After Your Order Has Been Delivered And Allow The Deliverly Person To Confirm Your Payment</Text> </Text>
        </View>
    )
}

export default paymentInstructions

const styles = StyleSheet.create({
    textstyle:{
        ...FONTS.h2,
        fontWeight:'bold',
        paddingVertical:8,
        color:Colors.green600
    }
})

