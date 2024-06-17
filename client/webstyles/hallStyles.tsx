import { StyleSheet } from 'react-native';

export const lightTheme = StyleSheet.create({
    container: {
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
    section: {
      marginBottom: 5,
    },
    line: {
      borderBottomColor: '#21304f',
      borderBottomWidth: 1,
      marginVertical: 10,
    },
    title: {
      fontSize: 24,
      color: '#21304f',
      fontFamily: 'Azonix',
      textAlign: 'center',
    },
    barelyReadableText: {
      fontSize: 10,
      color: '#21304f',
      marginBottom: 10,
      fontFamily: 'Azonix',
      textAlign: 'center',
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: '100%',    },
    item: {
      alignItems: 'center',
    },
    imageLarge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
    },
    imageSmall: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 3,
    },
    goldBorder: {
      borderColor: '#FFD700',
    },
    silverBorder: {
      borderColor: '#C0C0C0',
    },
    bronzeBorder: {
      borderColor: '#CD7F32',
    },
    itemText: {
      marginTop: 5,
      fontSize: 16,
      color: '#21304f',
      fontFamily: 'Azonix',
    },
    viewButton: {
      padding: 10,
      backgroundColor: '#21304f',
      borderRadius: 5,
      alignItems: 'center',
    },
    viewButtonText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Azonix',
    },
    noItemText: {
      fontSize: 16,
      color: '#21304f',
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 10,
      fontFamily: 'Azonix',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#21304f',
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
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#21304f',
      fontFamily: 'Azonix',
    },
    closeButton: {
      padding: 10,
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#21304f',
      fontFamily: 'Azonix',
    },
    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    indicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#C0C0C0',
      marginHorizontal: 5,
    },
    indicatorActive: {
      backgroundColor: '#21304f',
    },
    listTitle: {
      fontSize: 24,
      color: '#21304f',
      fontFamily: 'Azonix',
      textAlign: 'center',
      marginBottom: 10,
    },
    fullContainer: {
      width: '100%',
      padding: 20,
    },
    fullItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    fullImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      borderWidth: 3,
    },
    fullItemText: {
      fontSize: 16,
      color: '#21304f',
    },
  });

  export const darkTheme = StyleSheet.create({
    container: {
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
    section: {
      marginBottom: 5,
    },
    line: {
      borderBottomColor: '#fff',
      borderBottomWidth: 1,
      marginVertical: 10,
    },
    title: {
      fontSize: 24,
      color: '#fff',
      fontFamily: 'Azonix',
      textAlign: 'center',
    },
    barelyReadableText: {
      fontSize: 10,
      color: '#fff',
      marginBottom: 10,
      textAlign: 'center',
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: '100%'
    },
    item: {
      alignItems: 'center',
    },
    imageLarge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
    },
    imageSmall: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 3,
    },
    goldBorder: {
      borderColor: '#FFD700',
    },
    silverBorder: {
      borderColor: '#C0C0C0',
    },
    bronzeBorder: {
      borderColor: '#CD7F32',
    },
    itemText: {
      marginTop: 5,
      fontSize: 16,
      color: '#fff',
    },
    viewButton: {
      padding: 10,
      backgroundColor: '#21304f',
      borderRadius: 5,
      alignItems: 'center',
    },
    viewButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    noItemText: {
      fontSize: 16,
      color: '#fff',
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff',
    },
    modalContent: {
      backgroundColor: '#1E1E1E',
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
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
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
    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    indicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#C0C0C0',
      marginHorizontal: 5,
    },
    indicatorActive: {
      backgroundColor: '#fff',
    },
    listTitle: {
      fontSize: 24,
      color: '#fff',
      fontFamily: 'Azonix',
      textAlign: 'center',
      marginBottom: 10,
    },
    fullContainer: {
      width: '100%',
      padding: 20,
    },
    fullItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    fullImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      borderWidth: 3,
    },
    fullItemText: {
      fontSize: 16,
      color: '#fff',
    },
  });