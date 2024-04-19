import React, { useState } from "react";
import { Text, View, TextInput } from "@/components/Themed";
import { Alert, SafeAreaView, Button, StyleSheet, ActivityIndicator, Pressable, Image } from "react-native";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

//configuration
const oktaConfig = {
    clientId: "0oagjykfldwWX5Cqt5d7",
    domain: "https://dev-58460839.okta.com",
    issuerUrl: "https://dev-58460839.okta.com/oauth2/default",
    callbackUrl: "com.okta.dev-58460839:/callback",
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

      const result = await request.promptAsync(discovery);

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

        const car = await fetch(`http://192.168.178.23:3000/getCar?userId=${userPromise.data["sub"]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const test = await car.text();


      console.log("\n\nUser data:", userPromise.data);
      console.log("\n\nOkta Token: ", accessToken);
      console.log("\n\nCar: ", test);

      login(userPromise.data["sub"], userPromise.data["preferred_username"], userPromise.data["name"], test, accessToken);
    } catch (error) {
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
                <Pressable style={styles.button} onPress={loginWithOkta}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});