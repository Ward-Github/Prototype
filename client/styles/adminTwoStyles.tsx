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
    button: {
      backgroundColor: '#21304f',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      height: '90%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      color: '#21304f',
    },
    closeButton: {
      padding: 10,
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#21304f',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
    },
    reservationList: {
      paddingHorizontal: 20,
    },
    reservationItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    reservationDetails: {
      flex: 1,
    },
    reservationText: {
      fontSize: 16,
      color: '#333',
    },
    trashIcon: {
      padding: 10,
    },
    imageModalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    imageModalContent: {
      width: '90%',
      height: '40%',
      backgroundColor: 'white',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonImage: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
    fullSizeImage: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    feedbackList: {
      paddingHorizontal: 20,
    },
    feedbackItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    feedbackImage: {
      width: 50,
      height: 50,
      borderRadius: 5,
      marginRight: 10,
    },
    feedbackContent: {
      flex: 1,
    },
    feedbackUser: {
      fontSize: 16,
      fontWeight: '600',
    },
    feedbackText: {
      fontSize: 14,
      color: '#666',
    },
    feedbackTime: {
      fontSize: 12,
      color: '#999',
    },
    resolveIcon: {
      padding: 10,
    },
    loadingText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    errorText: {
      fontSize: 18,
      textAlign: 'center',
      color: 'red',
      marginTop: 20,
    },
    listItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    listText: {
      fontSize: 16,
      color: '#333',
    },
    userDetails: {
      flex: 1,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    listContainer: {
      paddingHorizontal: 20,
    },
    searchInput: {
      fontSize: 16,
      padding: 10,
      marginBottom: 5,
      marginHorizontal: 20,
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      color: '#A9A9A9',
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
      marginHorizontal: 20,
    },
    button: {
      backgroundColor: '#21304f',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#121212',
      padding: 20,
      height: '90%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      color: '#fff',
    },
    closeButton: {
      padding: 10,
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    modalTitle: {
      fontSize: 20,
      color: '#fff',
      fontWeight: '700',
    },
    reservationList: {
      paddingHorizontal: 20,
    },
    reservationItem: {
      borderBottomColor: '#eee',
      paddingVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1E1E1E',
      padding: 20,
      marginVertical: 5,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    reservationDetails: {
      flex: 1,
    },
    reservationText: {
      fontSize: 16,
      color: '#fff',
    },
    trashIcon: {
      padding: 10,
    },
    imageModalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    imageModalContent: {
      width: '90%',
      height: '40%',
      backgroundColor: 'white',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonImage: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
    fullSizeImage: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    feedbackList: {
      paddingHorizontal: 20,
    },
    feedbackItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    feedbackImage: {
      width: 50,
      height: 50,
      borderRadius: 5,
      marginRight: 10,
    },
    feedbackContent: {
      flex: 1,
    },
    feedbackUser: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    feedbackText: {
      fontSize: 14,
      color: '#666',
    },
    feedbackTime: {
      fontSize: 12,
      color: '#999',
    },
    resolveIcon: {
      padding: 10,
    },
    loadingText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    errorText: {
      fontSize: 18,
      textAlign: 'center',
      color: 'red',
      marginTop: 20,
    },
    listItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    listText: {
      fontSize: 16,
      color: '#fff',
    },
    userDetails: {
      flex: 1,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    listContainer: {
      paddingHorizontal: 20,
    },
    searchInput: {
      fontSize: 16,
      padding: 10,
      marginBottom: 5,
      marginHorizontal: 20,
      backgroundColor: '#1E1E1E',
      borderRadius: 5,
      borderWidth: 1,
      color: '#A9A9A9',
    }
  });