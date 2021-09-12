import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Users() {
    return (
        <View style={styles.center}>
         <Text>This is the Users screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      },
})
