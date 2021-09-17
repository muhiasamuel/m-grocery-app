import { COLORS, FONTS, images, SIZES } from '../constants/Index'
const initialCurrentLocation= {
    streetName:"Kilifi",
    gps: {
        latitude: 1.8927728829928,
        longitude: 123.7836353424
    }
}


const categoryData = [
   { id: 1,
    name: "vegetables",
    icon: images.food11
    } ,
   { id: 2,
    name: "fruits",
    icon: images.fruit2
   },
   { id: 3,
    name: "spices",
    icon: images.food6
    }, 
   { id: 4,
    name: "whiteMeat",
    icon: images.food2
    }, 
    {id: 5,
    name: "redMeat",
    icon: images.fruit3
    }, 
   { id: 6,
    name: "Drinks",
    icon: images.food13
    }, 
    {id: 7,
    name: "Snacks",
    icon: images.fruit5
    }, 
   { id: 8,
    name: "Shusi",
    icon: images.food9
    },
   { id: 9,
    name: "Desserts",
    icon: images.fruit7
    },
   { id: 11,
    name: "Drinks",
    icon: images.food1
    } ,
    { id: 12,
    name: "Drinks",
    icon: images.fruit6
    },
    { id: 13,
    name: "Drinks",
    icon: images.fruit11
    },
    { id: 14,
    name: "Drinks",
    icon: images.food1
    },
    { id: 10,
    name: "Drinks",
    icon: images.food8
    }    


]
//price
const affordable = 1
const fairPrice = 2
const expensive =3

const restaurantData = [
{
    id: 1,
    name : "Samtec",
    rating :4.2,
    categories: [1,2,3,4,5,6,7,8,9,10],
    priceRating: affordable,
    photo: images.food9,
    duration:"20 - 30 min",
    location: {
        latitude: 1.5674534252637,
        longitude: 122.123254252526,
    },
    courier: {
        avatar: images.food3,
        name: "any",
    }, 
    storeProducts:[1,2,3,4,5,6,7,8,11,10,13,9,14],
    menu: [
        {
              menuId: 1,
              categoryId: 6,
              name: "Crispy Chicken burger",
              photo: images.food10,
              description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
              calories: 250,
              price : 150,
          },
          {
            menuId: 2,
            categoryId: 1,
            name: "Crispy Chicken burger with honey Mustard",
            photo: images.food9,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
            calories: 250,
            price : 180,
        },
        {
            menuId: 3,
            categoryId: 6,
            name: "Crispy baked french fries",
            photo: images.food4,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
            calories: 250,
            price : 150,
        },
        {
            menuId: 4,
            categoryId: 9,
            name: "Crispy Chicken burger",
            photo: images.food5,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
            calories: 250,
            price : 150,
        },
        {
            menuId: 5,
            categoryId: 1,
            name: "Crispy Chicken burger",
            photo: images.food6,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
            calories: 250,
            price : 150,
        },
        {
            menuId: 6,
            categoryId: 4,
            name: "Crispy Chicken burger",
            photo: images.food7,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
            calories: 250,
            price : 150,
        },
        {
            menuId: 7,
            categoryId: 12,
            name: "Crispy Chicken burger",
            photo: images.food8,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
            calories: 250,
            price : 150,
        },

    ]
},
{
    id: 2,
    name : "Samtecurant reasta",
    rating :4.6,
    categories: [5,2, 7, 9, 1],
    priceRating: expensive,
    photo: images.fruit5,
    duration:"25 - 30 min",
    location: {
        latitude: 1.7674534252637,
        longitude: 122.123254252526,
    },
    courier: {
        avatar: images.fruit1,
        name: "any",
    }, 
    storeProducts:[11,12,13,14],
    menu: [
        {
            menuId: 11,
            categoryId: 3,
            name: "Crispy Chicken burger",
            photo: images.food5,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
            calories: 250,
            price : 150,
        },
        {
            menuId: 12,
            categoryId: 10,
            name: "Crispy Chicken burger",
            photo: images.food6,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
            calories: 250,
            price : 150,
        },
        {
            menuId: 13,
            categoryId: 13,
            name: "Crispy Chicken burger",
            photo: images.food7,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
            calories: 250,
            price : 150,
        },
        {
            menuId: 14,
            categoryId: 1,
            name: "Crispy Chicken burger",
            photo: images.food8,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
            calories: 250,
            price : 150,
        },

    ]
},
{
    id: 4,
    name : "Samtecurant sushi",
    rating :4.8,
    categories: [2,3,8,10],
    priceRating: fairPrice,
    photo: images.food11,
    duration:"10 - 30 min",
    location: {
        latitude: 1.4674534252637,
        longitude: 122.023254252526,
    },
    courier: {
        avatar:images.fruit2,
        name: "any",
    }, 
    
    storeProducts:[8,9,10,11,12],
    menu: [
        {
            menuId: 8,
            categoryId: 8,
            name: "Crispy Chicken burger",
            photo: images.food5,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
            calories: 250,
            price : 150,
        },
        {
            menuId: 9,
            categoryId: 5,
            name: "Crispy Chicken burger",
            photo: images.food6,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
            calories: 250,
            price : 150,
        },
        {
            menuId: 10,
            categoryId: 9,
            name: "Crispy Chicken burger",
            photo: images.food7,
            description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
            calories: 250,
            price : 150,
        },
    ]
},

]
const products = [
    {
        id: 1,
        categoryId: 1,
        name: "Crispy Chicken burger",
        photo: [images.food10, images.food1, images.fruit3, images.fruit7],
        description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
        calories: 250,
        price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
    },
    {
        id: 2,
      categoryId: 1,
      name: "Crispy Chicken burger with honey Mustard",
      photo: [images.food9,images.fruit3,images.fruit7, images.food13],
      description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.Crispy Chicken burger with honey",
      calories: 250,
      price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
  },
  {
    id: 3,
      categoryId: 1,
      name: "Crispy baked french fries",
      photo:  [images.food4, images.fruit1],
      description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
      calories: 250,
      price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
  },
  {
    id: 4,
      categoryId: 1,
      name: "Crispy Chicken burger",
      photo: [images.food5, images.fruit11],
      description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
      calories: 250,
      price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
  },
  {
    id: 5,
      categoryId: 1,
      name: "Crispy Chicken burger",
      photo: [images.food2, images.food5],
      description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
      calories: 250,
      price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
  },
  {
    id: 6,
      categoryId: 4,
      name: "Crispy Chicken burger",
      photo: [images.food1, images.fruit6],
      description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
      price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
  },
  {
    id: 7,
      categoryId: 12,
      name: "Crispy Chicken burger",
      photo: [images.food8, images.fruit2],
      description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
      calories: 250,
      price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
  },
    {
        id: 8,
        categoryId: 1,
        name: "Crispy Chicken burger",
        photo: [images.food5,images.food9],
        description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.",
        calories: 250,
        price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
    },
    {
        id: 9,
        categoryId: 5,
        name: "Crispy Chicken burger",
        photo: [images.food6, images.food13],
        description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.", 
        calories: 250,
        price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
    },
    {
        id: 10,
        categoryId: 9,
        name: "Crispy Chicken burger",
        photo: [images.food7,images.fruit2],
        description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.Crispy dres derate wesysip",
        calories: 250,
        price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
    },
    {
        id: 11,
        categoryId: 3,
        name: "Crispy Chicken burger",
        photo: [images.food5, images.fruit1],
        description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.Crispy Chicken it rsbsf xxrb dy11",
        calories: 250,
        price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
    },
    {
        id: 12,
        categoryId: 11,
        name: "Crispy Chicken burger",
        photo: [images.food6, images.food10],
        description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.Crispy Chicken oytend[c yyyx xewrsamtec12",
        calories: 250,
        price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
    },
    {
        id: 13,
        categoryId: 13,
        name: "Crispy Chicken burger",
        photo: [images.food7, images.food3],
        description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.Crispy Chicken dtrew trew wasr tdred potred13",
        calories: 250,
        price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
    },
    {
        id: 14,
        categoryId: 1,
        name: "Crispy Chicken burger",
        photo: [images.food8,images.food1],
        description:"The rise of e-commerce paints a picture that 2021 may just deliver another revolution if the rapid transitioning of automatic teller machines (ATMs), virtual banking, online payments that have made seismic changes is anything to go by while reflecting how businesses have changed their transaction models over the past few decades.Crispy Chicken y6rnc ytre wred pnures serwbetyd14",
        calories: 250,
        price : [[150, '200ml'], [100, '5g'], [2000, '300g']]
    }
]
export {
    products,
    restaurantData,
    categoryData,
    initialCurrentLocation
}