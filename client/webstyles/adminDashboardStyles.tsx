import { StyleSheet } from 'react-native';

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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  reservationAccordion: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    maxHeight: 300,
    overflow: 'hidden',
  },
  feedbackAccordion: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    maxHeight: 300,
    overflow: 'hidden',
  },
  reservationList: {
    paddingHorizontal: 20,
  },
  reservationItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reservationText: {
    fontSize: 16,
    color: '#333',
  },
  feedbackList: {
    paddingHorizontal: 20,
  },
  feedbackItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  listText: {
    fontSize: 16,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  feedbackImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  feedbackContent: {
    flex: 1,
  },
  resolveIcon: {
    padding: 10,
  },
  imageModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  imageModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  fullSizeImage: {
    width: 300,
    height: 300,
  },
  loadingContainer: {
    alignItems: 'center',
  },
});

export const darkTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041B2A',
  },
  profileHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E1E1E1',
    marginTop: 20,
    marginHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  reservationAccordion: {
    backgroundColor: '#0F2635',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    maxHeight: 300,
    overflow: 'hidden',
  },
  feedbackAccordion: {
    backgroundColor: '#0F2635',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    maxHeight: 300,
    overflow: 'hidden',
  },
  reservationList: {
    paddingHorizontal: 20,
  },
  reservationItem: {
    backgroundColor: '#0F2635',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reservationText: {
    fontSize: 16,
    color: '#E1E1E1',
  },
  feedbackList: {
    paddingHorizontal: 20,
  },
  feedbackItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 10,
  },
  feedbackUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E1E1E1',
  },
  feedbackText: {
    fontSize: 14,
    color: '#999',
  },
  feedbackTime: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#E1E1E1',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  listText: {
    fontSize: 16,
    color: '#E1E1E1',
  },
  searchInput: {
    backgroundColor: '#0F2635',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  feedbackImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  feedbackContent: {
    flex: 1,
  },
  resolveIcon: {
    padding: 10,
  },
  imageModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  imageModalContent: {
    backgroundColor: '#0F2635',
    padding: 20,
    borderRadius: 10,
  },
  fullSizeImage: {
    width: 300,
    height: 300,
  },
  loadingContainer: {
    alignItems: 'center',
  },
});
