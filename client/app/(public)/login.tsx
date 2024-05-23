import React, { useState } from "react";
import { Text, View, TextInput } from "@/components/Themed";
import { Alert, SafeAreaView, Button, StyleSheet, ActivityIndicator, Pressable, Image, Platform } from "react-native";
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

      const fetchUserInfo = await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/getUser?userId=${userPromise.data["sub"]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(fetchUserInfo)

      const userInfo = await fetchUserInfo.json();

      console.log(userInfo)

      const car = userInfo.car;
      const admin = userInfo.admin;

      console.log("\nUser data:", userPromise.data);
      console.log("\nOkta Token: ", accessToken);
      console.log("\nCar: ", car);
      console.log("\nAdmin: ", admin);
      
      await fetch(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/addUserOkta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userPromise.data["sub"],
          email: userPromise.data["preferred_username"],
          name: userPromise.data["name"],
          car: car,
          admin: admin,
          accessToken: accessToken,
        }),
      });


      login(userPromise.data["sub"], userPromise.data["preferred_username"], userPromise.data["name"], car, admin, accessToken);
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
    setIsLoading(true);
    try{
      const fetchUserInfo = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL}:3000/getUserByEmail?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      login(fetchUserInfo.data["_userId"], fetchUserInfo.data["_email"], fetchUserInfo.data["_name"], fetchUserInfo.data["car"], fetchUserInfo.data["_admin"], fetchUserInfo.data["_accessToken"]);
    }
    catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        {isLoading ? (
            <View style={styles.loadingContainer}>
                <Text style={styles.loading}>Retrieving user info...</Text>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        ) : authState ? (
            <Button title="Logout" onPress={() => setAuthState(null)} />
        ) : (
            <View style={styles.main}>
                <Image source={require('../../assets/images/logo.png')} style={styles.image} />
                <View style={styles.container2}>
                  <Pressable style={styles.button} onPress={loginWithOkta}>
                      <Text style={styles.buttonText}>Login</Text>
                  </Pressable>
                  <View style={{ flexDirection: 'row', alignItems: 'center', margin: 35 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#fff' }} />
                    <Text style={{ width: 50, textAlign: 'center', color: '#fff' }}>OR</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#fff' }} />
                  </View>
                <View style={{ backgroundColor: '#041B2A', margin: 5 }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email..."
                      placeholderTextColor="#fff"
                      value={email}
                      onChangeText={setEmail}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password..."
                      placeholderTextColor="#fff"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                  <Pressable style={styles.button} onPress={loginWithEmail}>
                      <Text style={styles.buttonText}>Login with Email</Text>
                  </Pressable>
                </View>
            </View>
        )}
    </SafeAreaView>
  );
};


let styles = StyleSheet.create({
    container2: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#041B2A',
    },
    main: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#041B2A',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 20,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Azonix',
      },
      image: {
        width: 350,
        height: 150,
        marginTop: 20,
        marginBottom: 20,
    },
    loading: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Azonix',
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#041B2A',
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        color: '#fff',
        borderColor: '#007BFF',
        backgroundColor: '#',
        fontFamily: 'Azonix',
    }
});
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  styles = StyleSheet.create({
    ...styles,
    image: {
      width: 300,
      height: 125,
      marginTop: 200, // Add marginTop property
      marginBottom: 0, // Add marginBottom property
    },
    input: {
      height: 50,
      width: 300,
      margin: 12,
      borderWidth: 1,
      padding: 10, // Add padding property
      borderRadius: 20,
      color: '#fff',
      borderColor: '#007BFF',
      backgroundColor: 'transparent',
      fontFamily: 'Azonix',
    }
  });
}