import { StyleSheet } from 'react-native';

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
  profileHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#21304f',
    marginTop: 20,
    marginHorizontal: 20,
  },
  inputContainer: {
    marginVertical: 20,
    width: '90%',
  },
  text: {
    fontSize: 18,
    color: '#21304f',
    marginBottom: 10,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#21304f',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  selectInput: {
    color: '#21304f',
  },
  dropdown: {
    backgroundColor: '#ffffff',
  },
  sliderContainer: {
    width: '90%',
    alignItems: 'stretch',
    marginVertical: 20,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#21304f',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#21304f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  icon: {
    marginRight: 20,
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
  profileHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E1E1E1',
    marginTop: 20,
    marginHorizontal: 20,
  },
  inputContainer: {
    marginVertical: 20,
    width: '90%',
  },
  text: {
    fontSize: 18,
    color: '#E1E1E1',
    marginBottom: 10,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#0F3B5A',
  },
  selectInput: {
    color: '#E1E1E1',
  },
  dropdown: {
    backgroundColor: '#0F3B5A',
  },
  sliderContainer: {
    width: '90%',
    alignItems: 'stretch',
    marginVertical: 20,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#E1E1E1',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#21304f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  icon: {
    marginRight: 20,
    color: '#E1E1E1',
  },
});
