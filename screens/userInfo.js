import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'

const userInfo = () => {
    const [userEmail, setUserEmail ] = React.useState('')
   
    return (
        <View>
          <View>
            <TextInput
            style={styles.input}
            value={username}
            placeholderTextColor="#fff"
            placeholder={"Username"}
            onChangeText={(text) => setUsername(text)}
            autoCapitalize={"none"}
         /> 
            </View>
            <View>
            {/*<Text style={styles.label}>Email Address:</Text>*/}
                <TextInput
                    style={styles.input}
                    value={userEmail}            
                    keyboardType="email-address"
                    placeholderTextColor="#fff"
                    placeholder={"Email"}
                    onChangeText={(text) => setUserEmail(text)}
                    autoCapitalize={"none"}
                /> 
            </View>
            <View>
            {/*<Text style={styles.label}>PhoneNumber:</Text>*/}
                <TextInput
                    style={styles.input}
                    value={UserPhoneNo}
                    keyboardType='phone-pad'
                    keyboardAppearance='light'            
                    placeholderTextColor="#fff"
                    placeholder={"phone Number"}
                    onChangeText={(text) => setUserPhoneNo(text)}
                    autoCapitalize={"none"}
                /> 
            </View>
        </View>
    )
}

export default userInfo

const styles = StyleSheet.create({})
