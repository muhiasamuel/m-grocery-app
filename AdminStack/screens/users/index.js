import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors,Headline } from 'react-native-paper'
import { COLORS, FONTS, SIZES } from '../../../constants/themes'
import Firebase from '../../../firebaseConfig'
import "firebase/storage";
import 'firebase/firestore';
const index = () => {
    const [users, setUsers] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [Loading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const roles = [
        'Admin',
        'storeAdmin',
        'deliverly-personalbar',
        'customer'
    ]
    useEffect(() => {
        getusers()
    }, [])
    const getusers = async() =>{
        setIsLoading(true);
        try{
          const dataArr = [];
            const response=Firebase.firestore().collection('users')
            const data= await response.get();
            data.docs.forEach(item=>{
              const {username, uid,role} = item.data();
              dataArr.push({
                key: item.id,
                role,
                uid,
                username
              });
              setUsers(dataArr)
              setIsLoading(false)
            })
        }
        catch(e){
          console.log(e);
        }
      }

      function editUsers(item){
          setCurrentUser(item)
          setModalVisible(!modalVisible);
      }

      function renderusers(){
        const renderItem = ({item}) =>(
                <View style={styles.mainview}> 
                <View style = {styles.centeredView}>
                 <Text style={{...FONTS.body3,paddingLeft:SIZES.padding2*2, width:SIZES.width*0.25 }} >{item?.username}</Text>  
                 <Text style={{...FONTS.body3,paddingLeft:SIZES.padding2*2, width:SIZES.width*0.35}} >{item?.role}</Text> 
                 <View style ={{flexDirection:'row', alignItems:'center', justifyContent:'space-around' , width:SIZES.width*0.35}}>
                <TouchableOpacity
                style={[styles.btnUpdateStore,{backgroundColor:Colors.grey200,paddingVertical:7,borderWidth:1,borderColor:Colors.blue900}]}
                onPress={() => editUsers(item)}
                >
                 <FontAwesome name='edit' size={27} color={Colors.blue800} />              
                </TouchableOpacity>
                <TouchableOpacity
                onPress = {() =>{deleteStore(item?.key)}}
                style={[styles.btnUpdateStore,{backgroundColor:Colors.grey200,paddingVertical:7,borderColor:Colors.red900,borderWidth:1 }]}
                >
                <MaterialCommunityIcons name="delete-circle" size={27} color={Colors.red900} />
                </TouchableOpacity>
                </View> 
                </View>                  
                </View>
            )
            return(
              <FlatList
                  data={users}
                  keyExtractor={item => `${item.key}`}
                  renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                    paddingBottom:25,
                    backgroundColor:COLORS.white
                  }}
              />
            )
            }

            function renderModal(){
   
                return(
                    <Modal 
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                         <Headline>Select Store Admin</Headline>
                         <View>
                             <Text>{currentUser?.username}</Text>
                         </View>
                         
                            {roles.map((data, index) => {
                               <View
                                key={{index}}
                               >
                                 <Text>23545566</Text>  
                               </View>     
                            })}
                         <View >
                            <TouchableOpacity
                              style={[styles.btnUpdateStore,{flexDirection:'row',width:100, justifyContent:'center', alignItems:'center'}]}
                              onPress={() => setModalVisible(!modalVisible)}
                            >
                              <Text style={{...FONTS.body2, color:Colors.red800}}>Ok</Text>
                            </TouchableOpacity>
                          
                          </View>
            
                        </View>
                      </View>   
            
                    </Modal>
                )
            }
        
    return (
        <View style= {styles.screen}>
            {Loading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', top:40 }}>
            <ActivityIndicator size='large' color={Colors.purple100} />
            </View>:
            <View></View>
            }
            {renderModal()}
            {renderusers()}
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:Colors.grey100,
      },
      centeredView: {
        flexDirection:'row',  
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:Colors.grey300,
      },
      mainview: {
        padding:5,

      },
      btnUpdateStore:{
        paddingHorizontal:SIZES.padding2,
        paddingVertical:SIZES.padding2,
        marginVertical:5,
        color:'#fff',
        ...FONTS.h6,
        backgroundColor:'skyblue',
        borderRadius:SIZES.radius*0.3
      },
})
