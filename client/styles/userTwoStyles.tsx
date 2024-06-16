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
    marginHorizontal: 20,
  },
  innerRectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sliderContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  rectangle: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectBox: {
    backgroundColor: '#f0f4f8',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
  },
  selectInput: {
    textAlign: 'center',
    color: '#333',
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: '#f0f4f8',
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#21304f',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: 'green',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#21304f',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
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
      marginHorizontal: 20,
    },
    innerRectangle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1E1E1E',
      padding: 20,
      marginVertical: 20,
      marginHorizontal: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    sliderContainer: {
      marginHorizontal: 20,
      marginVertical: 20,
    },
    sliderLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#888',
      marginBottom: 5,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    inputContainer: {
      marginHorizontal: 20,
      marginVertical: 10,
    },
    rectangle: {
      backgroundColor: '#1E1E1E',
      padding: 20,
      margin: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    selectBox: {
      backgroundColor: '#3A3A3A',
      borderWidth: 1,
      borderRadius: 5,
      height: 45,
  },
    selectInput: {
        textAlign: 'center',
        color: '#888',
        justifyContent : 'center',
    },
    dropdown: {
      backgroundColor: '#f0f4f8',
      borderColor: '#ddd',
  },
    button: {
      backgroundColor: '#21304f',
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 20,
      marginVertical: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonClose: {
      backgroundColor: 'red',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    modalHeader: {
      fontSize: 24,
      fontWeight: '700',
      color: '#21304f',
      marginTop: 20,
      marginHorizontal: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancelButton: {
      backgroundColor: 'red',
    },
  });
  