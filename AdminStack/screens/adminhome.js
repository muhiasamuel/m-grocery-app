import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Adminhome = ({navigation}) => {
    return (
        <View style={styles.center}>
        <Text>This is the home screen</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('users')}
        >
            <Text>press me</Text>
        </TouchableOpacity>
      </View>
    )
}

export default Adminhome

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      },
})
