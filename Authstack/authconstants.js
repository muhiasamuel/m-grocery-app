const initialState = {
    email:'',
    password: '',
    isSubmitting: false,
    errorMessage: null,
    check_textInputChange:'',
    secureTextEntry: true
  };
  
  const[Data, setData] = React.useState(initialState);
  export function textInputChange(val){
      if(val.length != 0){
          setData({
              ...Data,
              email:val,
              check_textInputChange:true
          });
      } else{
          setData({
              ...Data,
              email:val,
              check_textInputChange:false
          });
      }
  }

  export function handlePasswordChange (val){
      setData({
          ...Data,
          password:val
      });
  }
  export function updateSecureTextEntry() {
      setData({
          ...Data,
          secureTextEntry: !Data.secureTextEntry
      });
  }
  const handleFormSubmit = async(email, password) => {
      let isMounted = true;
      setData({
        ...Data,
        isSubmitting: true,
        errorMessage: null
      });
      
     // fetch data from the server
     await axios.post('http://127.0.0.1:8000/api/login', {
          email,
          password,
      })
      .then(response =>{
          const userResponse = {
              user: response.data.user,
              email: response.data.user.email,
               token: response.data.token,
           }
          dispatch({
              type: "LOGIN",
              payload: userResponse,
              
      })
      .catch(error=>{
          console.log(error.response);
          
      })   
        })
        .catch(error => {
          setData({
            ...Data,
            isSubmitting: false,
            errorMessage: error.message || error.statusText
          });
        });
        return () => { isMounted = false }; 
     
    };

   export const doUserRegistration = async function () {

        setData({
            ...Data,
            isSubmitting: true,
          });
        // Note that these values come from state variables that we've declared before
        const usernameValue = Data.name;
        const passwordValue = Data.password;
        // Since the signUp method returns a Promise, we need to call it using await
        return await Parse.User.signUp(usernameValue, passwordValue)
          .then((createdUser) => {

            setData({
                ...Data,
                isSubmitting: false,
              })
            // Parse.User.signUp returns the already created ParseUser object if successful
            Alert.alert(
              "Success!",
              `User ${createdUser.get("username")} was successfully created!`
            );
            return true;
          })
          .catch((error) => {

            setData({
                ...Data,
                isSubmitting: false,
                errorMessage: error.message || error.statusText
              })
            // signUp can fail if any parameter is blank or failed an uniqueness check on the server
            Alert.alert("Error!", error.message);
            return false;
          });
      };