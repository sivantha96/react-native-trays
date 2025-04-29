import { StyleSheet } from 'react-native';

export const trayStyles = StyleSheet.create({
  // Tray content styles
  trayContent: {
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  shortTray: {
    minHeight: 100,
  },
  mediumTray: {
    minHeight: 200,
  },
  tallTray: {
    minHeight: 400,
  },
  trayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trayMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Form elements
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  // List elements
  scrollView: {
    width: '100%',
    maxHeight: 300,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  // Image elements
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  caption: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // Close button styles
  trayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  formCloseButton: {
    backgroundColor: 'transparent',
  },
  imageCloseButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  bottomCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    alignSelf: 'center',
  },
  bottomCloseText: {
    fontSize: 14,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonSpacer: {
    width: 16,
  },
});
