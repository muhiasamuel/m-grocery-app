import { Dimensions } from "react-native"
const { width, height} = Dimensions.get('window')

export const COLORS = {
    primary: "#fC6D3F",
    secondary: "#CDCDD2",


    //colors
    backgroundColor:'#2c3e50',
    backgroundColor1:'rgb(27,58,73)',
    green:'rgb(19, 131, 4)',
    black: "#1E1F20",
    darkblue:'rgb(12,13,19)',
    white : "#FFF",
    lightgrey: "#f5f6f5",
    lightgrey2: "#f6f6f7",
    lightgrey3: "#f8f8f9",
    transparent: "transparent",
    darkgrey : "#898c95",
    darkgrey4 :"rgb(180, 180, 180)",
    darkgrey2 : "rgb(240, 240, 240)",
    darkgrey3 : ' rgb(255, 253, 180)',
    blackSecondary: 'rgb(12,13,18)',
    bluelight: 'rgb(12,170,243)'
};
 export const SIZES = {
     base: 8,
     font: 14, 
     radius: 30,
     padding: 10,
     padding2: 12,


     //fonts
     largeTitle: 45,
     h1: 28,
     h2: 22,
     h3: 21,
     h4: 18,
     h5: 15,
     h6: 12,
     body1: 30,
     body2: 20,
     body3: 16,
     body4: 14,
     body5: 12,


     width,
     height
 };

 export const FONTS = {
     largeTitle: { fontSize: SIZES.largeTitle,lineHeight:45
     },
     h1: { fontSize: SIZES.h1,lineHeight:36
    },
    h2: {
         fontSize: SIZES.h2,lineHeight:30
    },
    h3: {
       fontSize: SIZES.h3,lineHeight:22
    },
    h4: {
         fontSize: SIZES.h4,lineHeight:22
    },
    h5: {
        fontSize: SIZES.h5,lineHeight:22
   },
   h6: {
    fontSize: SIZES.h6,lineHeight:19
},
    body1: {
        fontSize: SIZES.body1,lineHeight:36
    },
    body2: {
        fontSize: SIZES.body2,lineHeight:30
    },
    body3: {
       fontSize: SIZES.body3,lineHeight:22
    },
    body4: {
         fontSize: SIZES.body4,lineHeight:22
    },
    body5: {
       fontSize: SIZES.body5,lineHeight:22
    },
 };

 const AppTheme = {COLORS, SIZES, FONTS};

 export default AppTheme;