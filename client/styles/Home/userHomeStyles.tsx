import { StyleSheet } from "react-native";

export const lightTheme = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f4f8',
    },
    profileHeader: {
      fontSize: 24,
      fontWeight: '700',
      color: '#21304f',
      marginTop: 20,
      marginLeft: 20,
    },
    rectangle: {
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
    titleText: {
      fontSize: 32,
      color: '#21304f',
      fontFamily: 'Poppins-Bold',
    },
    subtitleText: {
      fontSize: 24,
      color: '#21304f',
      marginTop: 20,
    },
    circularProgress: {
      marginTop: 20,
      alignSelf: 'center',
    },
    progressContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressText: {
      fontSize: 14,
      color: '#21304f',
      marginTop: 5,
    },
    feedbackButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#FF4D4D',
      borderRadius: 5,
      alignItems: 'center',
    },
    feedbackButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 24,
      color: '#21304f',
      marginBottom: 20,
    },
    textInput: {
      width: '100%',
      borderColor: '#21304f',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    imagePicker: {
      alignItems: 'center',
    },
    imagePickerText: {
      color: '#21304f',
      textDecorationLine: 'underline',
    },
    imagePreview: {
      width: 100,
      height: 100,
      marginTop: 10,
      borderRadius: 5,
    },
    selectBox: {
      backgroundColor: '#f0f4f8',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      height: 45,
      marginBottom: 20,
    },
    selectInput: {
      textAlign: 'center',
      color: '#333',
      justifyContent : 'center',
    },
    dropdown: {
      backgroundColor: '#f0f4f8',
      borderColor: '#ddd',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    loadingIndicator: {
      marginTop: 20,
    },
    startButton: {
      backgroundColor: '#32CD32',
    }
  });

  export const darkTheme = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    profileHeader: {
      fontSize: 24,
      fontWeight: '700',
      color: '#fff',
      marginTop: 20,
      marginLeft: 20,
    },
    rectangle: {
      backgroundColor: '#1E1E1E',
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
    titleText: {
      fontSize: 32,
      color: '#fff',
      fontFamily: 'Poppins-Bold',
    },
    subtitleText: {
      fontSize: 24,
      color: '#fff',
      marginTop: 20,
    },
    circularProgress: {
      marginTop: 20,
      alignSelf: 'center',
    },
    progressContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressText: {
      fontSize: 14,
      color: '#fff',
      marginTop: 5,
    },
    feedbackButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#FF4D4D',
      borderRadius: 5,
      alignItems: 'center',
    },
    feedbackButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 24,
      color: '#21304f',
      marginBottom: 20,
    },
    textInput: {
      width: '100%',
      borderColor: '#21304f',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    imagePicker: {
      alignItems: 'center',
    },
    imagePickerText: {
      color: '#21304f',
      textDecorationLine: 'underline',
    },
    imagePreview: {
      width: 100,
      height: 100,
      marginTop: 10,
      borderRadius: 5,
    },
    selectBox: {
      backgroundColor: '#f0f4f8',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      height: 45,
      marginBottom: 20,
    },
    selectInput: {
      textAlign: 'center',
      color: '#333',
      justifyContent : 'center',
    },
    dropdown: {
      backgroundColor: '#f0f4f8',
      borderColor: '#ddd',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    loadingIndicator: {
      marginTop: 20,
    },
    startButton: {
      backgroundColor: '#32CD32',
    },
  });