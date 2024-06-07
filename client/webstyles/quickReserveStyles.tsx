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
        alignItems: 'center', 
        paddingTop: 20,
    },
    innerRectangle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        backgroundColor: '#dfe6ed',
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginRight: 20,
    },
    text: {
        fontSize: 28,
        fontFamily: 'Azonix',
        color: '#21304f',
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
        alignItems: 'center', 
        paddingTop: 20,
    },
    innerRectangle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        backgroundColor: '#0F3B5A',
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginRight: 20,
    },
    text: {
        fontSize: 28,
        fontFamily: 'Azonix',
        color: '#E1E1E1',
    },
});
