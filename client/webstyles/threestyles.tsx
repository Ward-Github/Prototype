import { StyleSheet } from "react-native";

export const lightTheme = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
    },
    rectangle: {
        width: '95%', 
        height: '95%', 
        backgroundColor: '#ffffff', 
        justifyContent: 'flex-start',
        alignItems: 'flex-start', 
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        color: '#21304f',
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Azonix',
    },
    input: {
        height: 40,
        color: '#333',
        backgroundColor: '#f0f4f8',
        borderRadius: 5,
        paddingLeft: 10,
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
});

export const darkTheme = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#041B2A',
    },
    rectangle: {
        width: '95%', 
        height: '95%', 
        backgroundColor: '#0F2635', 
        justifyContent: 'flex-start',
        alignItems: 'flex-start', 
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Azonix',
    },
    input: {
        height: 40,
        color: '#fff',
        backgroundColor: '#0F3B5A',
        borderRadius: 5,
        paddingLeft: 10,
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
});
