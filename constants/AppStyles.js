import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';
import { COLORS } from './Index';

// screen sizing
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColums = 2;
// item size
const RECIPE_ITEM_HEIGHT = 110;
const RECIPE_ITEM_MARGIN = 5;

// 2 photos per width
export const RecipeCard = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: RECIPE_ITEM_MARGIN,
    marginTop: 5,
    width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
    height: RECIPE_ITEM_HEIGHT + 90,
    backgroundColor:  COLORS.white,
    borderColor: COLORS.darkgrey,
    borderWidth: 0.3,
    borderRadius: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  catContainer: {

  },
  catphoto: {

  },
  photo: {
    top:2,
    backgroundColor:Colors.grey900,
    width: (SCREEN_WIDTH - (recipeNumColums + 1) * (RECIPE_ITEM_MARGIN)) / recipeNumColums,
    height: RECIPE_ITEM_HEIGHT,
    borderRadius: 1,
    borderBottomLeftRadius: 10,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    borderBottomRightRadius: 10,
  },
  title: {
    flex:1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.darkgrey,
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
  },
  category: {
    marginRight: 5,
    marginBottom: 0,
    borderTopRightRadius:10,
    marginTop:-2
  }
});
