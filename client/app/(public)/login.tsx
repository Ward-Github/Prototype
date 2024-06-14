import React, { useState } from "react";
import {SafeAreaView, Button, StyleSheet, ActivityIndicator, Pressable, Image, Platform, KeyboardAvoidingView, Text, View, TextInput, Modal } from "react-native";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Toast from 'react-native-toast-message';

WebBrowser.maybeCompleteAuthSession();

//configuration
const oktaConfig = {
    clientId: "0oagjykfldwWX5Cqt5d7",
    domain: "https://dev-58460839.okta.com",
    issuerUrl: "https://dev-58460839.okta.com/oauth2/default",
    callbackUrl: Platform.OS == "web" ? "http://localhost:8081/callback" : "com.okta.dev-58460839:/callback"
};

export default function login() {
  const [authState, setAuthState] = useState<AuthSession.AuthSessionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [hasCode, setHasCode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const discovery = AuthSession.useAutoDiscovery(oktaConfig.issuerUrl);
  const redirectUri = AuthSession.makeRedirectUri({
    path: "callback",
  });

  const loginWithOkta = async () => {
    setIsLoading(true);
    try {
      const request = new AuthSession.AuthRequest({
        clientId: oktaConfig.clientId,
        redirectUri: oktaConfig.callbackUrl,
        prompt: AuthSession.Prompt.SelectAccount,
        scopes: ["openid", "profile"],
        usePKCE: true,
        extraParams: {},
      });

      if (discovery === null) {
        throw new Error("Failed to fetch the discovery document");
      }
      
      let result: AuthSession.AuthSessionResult | null = null;
      if (Platform.OS === "web") {
        result = await request.promptAsync(discovery, { windowFeatures: { popup: false } });
      }
      else {
        result = await request.promptAsync(discovery);
      }

      const code = JSON.parse(JSON.stringify(result)).params.code;
      setAuthState(result);

      console.log(code);

      const tokenRequestParams = {
        code,
        clientId: oktaConfig.clientId,
        redirectUri: oktaConfig.callbackUrl,
        extraParams: {
          code_verifier: String(request?.codeVerifier),
        },
      };
      const tokenResult = await AuthSession.exchangeCodeAsync(
        tokenRequestParams,
        discovery,
      );

      const accessToken = tokenResult.accessToken;

      // make an HTTP direct call to the Okta User Info endpoint of our domain
      const usersRequest = `${oktaConfig.issuerUrl}/v1/userinfo`;
      const userPromise = await axios.get(usersRequest, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const id = userPromise.data["sub"];

      console.log("\nID:", id);

      const fetchUserInfo = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/get-user?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const userInfo = await fetchUserInfo.json();
      console.log(userInfo)

      login(id, userInfo._email, userInfo._name, userInfo._licensePlate, userInfo._admin, userInfo._pfp, userInfo._theme);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  


  const loginWithEmail = async () => {
    if (!email || !password || email === "" || password === "") {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Please provide both email and password',
        visibilityTime: 3000,
        topOffset: 60,
      });
      return;
    }else{
      setIsLoading(true);
      try{
        const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/login`, {
          method: 'POST', // Use POST method for login
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        if (response.ok) {
          const userInfo = await response.json(); // Get user data from response
          console.log(userInfo);
          login(userInfo._idOkta, userInfo._email, userInfo._name, userInfo._licensePlate, userInfo._admin, userInfo._pfp, userInfo._theme);
        } else {
          const errorData = await response.json();
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Error',
            text2: 'An error occurred while logging in',
            visibilityTime: 3000,
            topOffset: 60,
          });
          throw errorData.error;
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'An error occurred while logging in',
          visibilityTime: 3000,
          topOffset: 60,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
  };
    


  const sendResetPasswordEmail = async (Email: string) => {
    if (!Email || Email === "" || Email === null || Email.includes(" ")) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Please provide a valid email',
        visibilityTime: 3000,
        topOffset: 60,
      });
      setForgotEmail("");
      return;
    }
    console.log("Reset Password called with email: " + Email)
    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: Email }),
      });
      
      console.log("forgor response: "+response.status)
      if (!response.ok) {
        if(response.status === 404){
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Error',
            text2: 'No user found with that email',
            visibilityTime: 3000,
            topOffset: 60,
          })
          setForgotEmail("");
          setModalVisible(false);
          return;
        }
        throw new Error('HTTP error ' + response.status);
      }
      const data = await response.json();

      console.log(data.EmailSent);
      if (data.EmailSent) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Success',
          text2: 'Password reset email sent',
          visibilityTime: 3000,
          topOffset: 60,
        });
        setHasCode(true);
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'There was an error sending the password reset email',
          visibilityTime: 3000,
          topOffset: 60,
        });
        setModalVisible(false);
      }

    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'An error with the server occured :(',
        visibilityTime: 3000,
        topOffset: 60,
      });
      setModalVisible(false);
    }
  };

  const sendNewPassword = async (Email: string, Password: string) => {
    console.log(Email, Password);
    if (!Email || !Password || Email === "" || Password === "") {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Please provide a valid email and password',
        visibilityTime: 3000,
        topOffset: 60,
      });
      return;
    } else if (Password !== checkPassword) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Passwords do not match, please try again',
        visibilityTime: 3000,
        topOffset: 60,
      });
      console.log("Passwords don't match, please try again");
      return;
    } else {
      try {
        const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/change-password`, { // Call the change-password endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: Email, newPassword: Password, code: forgotCode }),
        });

        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        } else {
          const data = await response.json();
          if (data.PasswordUpdated) {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: 'Success',
              text2: 'Password reset successful',
              visibilityTime: 3000,
              topOffset: 60,
            });
            setEmail(forgotEmail);
            setPassword(forgotPassword); // Set the password in the login fields
            setForgotPassword("");
            setCheckPassword("");
            setForgotCode("");
            setForgotEmail("");
            setModalVisible(false);
          } else {
            Toast.show({
              type: 'Error',
              position: 'top',
              text1: 'Error',
              text2: 'Password reset has failed. Please contact support.',
              visibilityTime: 3000,
              topOffset: 60,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };


return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios'|| Platform.OS === 'android' ? 'padding' : 'height'}
        >
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loading}>Retrieving user info...</Text>
                    <ActivityIndicator size="large" color="#21304f" />
                </View>
            ) : authState ? (
                <Button title="Database connection failed." onPress={() => setAuthState(null)} />
            ) : (
                <View style={styles.main}>
                    <View style={styles.container3}>
                      <Image source={require("../../assets/images/logo.png")} style={styles.image} />
                        <Pressable style={styles.button} onPress={loginWithOkta}>
                            <Text style={styles.buttonText}>Login with Okta</Text>
                        </Pressable>
                        <View style={styles.dividerContainer}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.line} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Email..."
                            placeholderTextColor="#A9A9A9" // Dark gray color
                            value={email}
                            onChangeText={modalVisible ? () => { } : setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password..."
                            placeholderTextColor="#A9A9A9" // Dark gray color
                            value={password}
                            onChangeText={modalVisible ? () => { } : setPassword}
                            secureTextEntry
                            
                        />
                        <View style={styles.email}>
                          <Pressable style={styles.button} onPress={loginWithEmail} disabled={modalVisible}>
                              <Text style={styles.buttonText}>Login with Email</Text>
                          </Pressable>
                          <Pressable 
                              style={{backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent',}} 
                              onPress={() => setModalVisible(true)}
                              disabled={modalVisible}
                          >
                              <Text style={styles.buttonPWText}>Forgot Password?</Text>
                          </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          onShow={() => {setHasCode(false); setForgotEmail(''); setHasCode(false); }}
          style={{justifyContent: 'center', alignItems: 'center', maxWidth: 200}}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Reset Password</Text>
              {!hasCode ?(

                <View style={{width: '100%'}}>
                  <Text style={styles.modalText} numberOfLines={3} ellipsizeMode="tail">Enter your email address and we will send you a code to reset your password.</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#A9A9A9"
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                  />
                  
                  <View style={{flexDirection: 'row', columnGap: 10, width: '75%'}}>

                    <Pressable
                      style={[styles.button, styles.buttonClose, {width: '100%'}]}
                      onPress={() => sendResetPasswordEmail(forgotEmail)}
                    >
                      <Text style={styles.textStyle}>Submit</Text>
                    </Pressable>
                    
                  
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={[styles.textStyle, {height: 'auto'}]}>Close</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={{ backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent', }}
                    onPress={() => setHasCode(true)}
                  >
                    <Text style={styles.buttonPWText}>I allready have a code</Text>
                  </Pressable>
                </View>
              ):(
                <View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#A9A9A9"
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                  />
                  <TextInput
                  style={styles.modalInput}
                    placeholder="Enter your code"
                    placeholderTextColor="#A9A9A9"
                    value={forgotCode}
                    onChangeText={setForgotCode}
                  />
                  <TextInput
                  style={styles.modalInput}
                    placeholder="Enter your new password"
                    placeholderTextColor="#A9A9A9"
                    value={forgotPassword}
                    onChangeText={setForgotPassword}
                    secureTextEntry
                  />
                  <TextInput
                  style={styles.modalInput}
                    placeholder="Enter your new password again"
                    placeholderTextColor="#A9A9A9"
                    value={checkPassword}
                    onChangeText={setCheckPassword}
                    secureTextEntry
                  />
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => sendNewPassword(forgotEmail, forgotPassword)}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible); setHasCode(false); setForgotPassword("");
                    setCheckPassword("");
                    setForgotCode("");
                    setForgotEmail(""); }}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
                </View>
              )}
              
            </View>
          </View>
        </Modal>
        
    </SafeAreaView>
);
};

let styles = StyleSheet.create({
  profileHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#21304f',
    marginTop: 20,
    marginHorizontal: 20,
  },
  container2: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    textAlign: 'center',
  },
  container3: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  email: {
    backgroundColor: 'transparent',
  },
  main: {
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  button: {
    backgroundColor: '#21304f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: 350,
    height: 150,
    marginBottom: 20,
  },
  loading: {
    color: '#21304f',
    fontSize: 18,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    color: '#000', // Change text color to black
    borderColor: '#21304f', // Change border color to #21304f
    backgroundColor: 'transparent', // Remove blue background
  },
  modalInput: {
    height: 50,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    color: '#000', // Change text color to black
    borderColor: '#21304f', // Change border color to #21304f
    backgroundColor: 'transparent', // Remove blue background
    fontFamily: 'Poppins', // Use Poppins font
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#21304f',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#21304f',
    fontFamily: 'Poppins',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 500
  },
  buttonClose: {
    backgroundColor: "#21304f",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: '700',
    color: '#21304f',
  },
  buttonPWText: {
    color: '#21304f',
    fontSize: 12,
    fontWeight: '600',
  },
});

if (Platform.OS === 'android' || Platform.OS === 'ios') {
  styles = StyleSheet.create({
    ...styles,
    image: {
      width: 300,
      height: 125,
      marginBottom: 0,
    },
    input: {
      height: 50,
      width: 300,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 20,
      color: '#000', // Change text color to black
      borderColor: '#21304f', // Change border color to #21304f
      backgroundColor: 'transparent', // Remove blue background
      fontFamily: 'Poppins', // Use Poppins font
    },
    modalInput: {
      height: 50,
      width: 200,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 20,
      color: '#000', // Change text color to black
      borderColor: '#21304f', // Change border color to #21304f
      backgroundColor: 'transparent', // Remove blue background
      fontFamily: 'Poppins', // Use Poppins font
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: 350
    },
  });
}