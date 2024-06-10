import React, { useState } from "react";
import { Text, View, TextInput } from "@/components/Themed";
import { Alert, SafeAreaView, Button, StyleSheet, ActivityIndicator, Pressable, Image, Platform, KeyboardAvoidingView } from "react-native";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { ScreenContainer } from "react-native-screens";

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

    const { login } = useAuth();

  const discovery = AuthSession.useAutoDiscovery(oktaConfig.issuerUrl);
  const redirectUri = AuthSession.makeRedirectUri({
    // For usage inbare and standalone
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

      const email = userInfo._email; 
      const name = userInfo._name;
      const car = userInfo._car;
      const admin = userInfo._admin;
      const licensePlate = userInfo._licensePlate;
      const pfp = userInfo._pfp;
      const theme = userInfo._theme;

      console.log("\n---- User data ---");
      console.log("Car: ", car);
      console.log("Admin: ", admin);
      console.log("License Plate: ", licensePlate);

      login(id, email, name, licensePlate, admin, pfp, theme);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = async () => {
    // Perform login with email and password
    // Add your login logic here
    if (!email || !password || email === "" || password === "") {
      Alert.alert(
        'Login failed',
        'Please enter both email and password',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
      return;
    }else{
      setIsLoading(true);
      try{
        const fetchUserInfo = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/get-user?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const userInfo = await fetchUserInfo.json();
        console.log(userInfo)

        if(!userInfo){
          Alert.alert(
            'Login failed',
            'The email is incorrect',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
          return;
        }else if(userInfo._password !== password){
          Alert.alert(
            'Login failed',
            'The password or email is incorrect',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          );
          return;
        }else{
          login(userInfo._idOkta, userInfo._email, userInfo._name, userInfo._licensePlate, userInfo._admin, userInfo._pfp, userInfo._theme);
        }
      }
      catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                    <Text style={styles.profileHeader}>Login</Text>
                    <View style={styles.container3}>
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
                            onChangeText={setEmail}
                            onSubmitEditing={() => {
                              if (email.trim() === "") {
                                Alert.alert("Error", "Email cannot be empty");
                              }
                            }}
                            onBlur={() => {
                              if (email.trim() === "") {
                                Alert.alert("Error", "Email cannot be empty");
                              }
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password..."
                            placeholderTextColor="#A9A9A9" // Dark gray color
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onSubmitEditing={() => {
                              if (password.trim() === "") {
                                Alert.alert("Error", "Password cannot be empty");
                              }
                            }}
                            onBlur={() => {
                              if (password.trim() === "") {
                                Alert.alert("Error", "Password cannot be empty");
                              }
                            }}
                        />
                        <Pressable style={styles.button} onPress={loginWithEmail}>
                            <Text style={styles.buttonText}>Login with Email</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
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
}
});

if (Platform.OS === 'android' || Platform.OS === 'ios') {
styles = StyleSheet.create({
    ...styles,
    image: {
        width: 300,
        height: 125,
        marginTop: 200,
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
    }
});
}