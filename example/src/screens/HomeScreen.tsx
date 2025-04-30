import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { useTrays } from 'react-native-trays';
import { appStyles } from '../styles/appStyles';
import { trayStyles } from '../styles/trayStyles';
import { TrayEnum, type TrayProps } from '../config/trayRegistry';

export const HomeScreen: React.FC = () => {
  // Use multiple stacks
  const mainTrays = useTrays<TrayProps>('main');
  const secondaryTrays = useTrays<TrayProps>('secondary');
  const modalTrays = useTrays<TrayProps>('modal');
  const familyTrays = useTrays<TrayProps>('family');

  // Generate sample data for tall tray
  const generateItems = () => {
    return Array(20)
      .fill(0)
      .map((_, i) => `Item ${i + 1} - Tap to select`);
  };

  return (
    <ScrollView contentContainerStyle={appStyles.container}>
      <Text style={appStyles.header}>React Native Trays Demo</Text>

      <Text style={appStyles.subheader}>Family Stack (Default Animations)</Text>
      <View style={appStyles.buttonGroup}>
        <Button
          title="Wallet"
          onPress={() => familyTrays.push(TrayEnum.WalletDetails, {})}
        />
      </View>

      <Text style={appStyles.subheader}>Main Stack (Default Animations)</Text>
      <View style={appStyles.buttonGroup}>
        <Button
          title="Short Tray"
          onPress={() =>
            mainTrays.push(TrayEnum.Short, {
              title: 'Simple Notification',
              message: 'This is a short tray with minimal content',
            })
          }
        />
        <View style={trayStyles.buttonSpacer} />
        <Button
          title="Form Tray"
          onPress={() =>
            mainTrays.push(TrayEnum.Form, {
              onSubmit: (text: string) => {
                Alert.alert('Form Submitted', `Submitted: ${text}`);
                mainTrays.pop();
              },
            })
          }
        />
      </View>

      <Text style={appStyles.subheader}>
        Secondary Stack (Slide Animations)
      </Text>
      <View style={appStyles.buttonGroup}>
        <Button
          title="Image Tray"
          onPress={() =>
            secondaryTrays.push(TrayEnum.Image, {
              imageUrl:
                'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
              caption: 'Beautiful landscape from Unsplash',
              // Add function to open another tray from inside this one
              onShowForm: () => {
                secondaryTrays.push(TrayEnum.Form, {
                  onSubmit: (text: string) => {
                    Alert.alert(
                      'Form Replaced',
                      `Replaced and submitted: ${text}`
                    );
                    secondaryTrays.pop();
                  },
                });
              },
            })
          }
        />
        <View style={trayStyles.buttonSpacer} />
        <Button
          title="Replace with Form"
          onPress={() =>
            secondaryTrays.replace(TrayEnum.Form, {
              onSubmit: (text: string) => {
                Alert.alert('Form Replaced', `Replaced and submitted: ${text}`);
                secondaryTrays.pop();
              },
              onClose: () => secondaryTrays.pop(),
            })
          }
        />
      </View>

      <Text style={appStyles.subheader}>Modal Stack (Fade Animations)</Text>
      <View style={appStyles.buttonGroup}>
        <Button
          title="Tall List Tray"
          onPress={() =>
            modalTrays.push(TrayEnum.Tall, {
              items: generateItems(),
              onClose: () => modalTrays.pop(),
              // Add function to dismiss all trays from inside this one
              onDismissAll: () => {
                mainTrays.dismissAll();
                secondaryTrays.dismissAll();
                modalTrays.dismissAll();
              },
            })
          }
        />
        <View style={trayStyles.buttonSpacer} />
        <Button
          title="Dismiss All Trays"
          onPress={() => {
            mainTrays.dismissAll();
            secondaryTrays.dismissAll();
            modalTrays.dismissAll();
          }}
        />
      </View>

      <Text style={appStyles.subheader}>API Testing Playground</Text>
      <Text style={appStyles.description}>
        Test all tray stack operations with different combinations
      </Text>

      {/* PUSH OPERATIONS */}
      <View style={appStyles.testSection}>
        <Text style={appStyles.testTitle}>Push Operations</Text>
        <View style={appStyles.buttonGroup}>
          <Button
            title="Push Short → Form"
            onPress={() => {
              // First push a short tray
              mainTrays.push(TrayEnum.Short, {
                title: 'First Tray (Short)',
                message: 'Push another tray to see stacking behavior',
              });
              // Then push a form tray on top
              mainTrays.push(TrayEnum.Form, {
                onSubmit: (text: string) => {
                  Alert.alert('Second Tray', `You entered: ${text}`);
                  mainTrays.pop();
                },
              });
            }}
          />
          <View style={trayStyles.buttonSpacer} />
          <Button
            title="Triple Stack"
            onPress={() => {
              // Push three different types of trays in sequence to test deep stacking
              // First: Short tray
              mainTrays.push(TrayEnum.Short, {
                title: 'Stack Level 1',
                message: 'This is the bottom tray in the stack',
              });

              // Second: Image tray
              mainTrays.push(TrayEnum.Image, {
                imageUrl:
                  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                caption: 'Stack Level 2 - A colorful gradient',
                onShowForm: () => {},
              });

              // Third: Tall tray
              mainTrays.push(TrayEnum.Tall, {
                items: [
                  'Stack Level 3 (top)',
                  'This is the top-most tray',
                  'Try popping to see the ones below',
                ],
                onClose: () => mainTrays.pop(),
                onDismissAll: () => mainTrays.dismissAll(),
              });
            }}
          />
        </View>

        <View style={appStyles.buttonGroup}>
          <Button
            title="Cross-Stack Push"
            onPress={() => {
              // Push to different stacks to see how they interact
              mainTrays.push(TrayEnum.Short, {
                title: 'Main Stack',
                message: 'This tray is in the main stack',
              });

              secondaryTrays.push(TrayEnum.Short, {
                title: 'Secondary Stack',
                message: 'This tray is in the secondary stack',
              });

              modalTrays.push(TrayEnum.Short, {
                title: 'Modal Stack',
                message: 'This tray is in the modal stack',
              });

              // Show an alert explaining what's happening
              setTimeout(() => {
                Alert.alert(
                  'Cross-Stack Test',
                  'Trays are now open in all three stacks simultaneously. Each has different animation styles.',
                  [{ text: 'OK', style: 'default' }]
                );
              }, 1000);
            }}
          />
        </View>
      </View>

      {/* POP OPERATIONS */}
      <View style={appStyles.testSection}>
        <Text style={appStyles.testTitle}>Pop Operations</Text>
        <View style={appStyles.buttonGroup}>
          <Button
            title="Push Multiple & Pop"
            onPress={() => {
              // Push three trays in sequence
              const commonProps = {};

              // First tray
              mainTrays.push(TrayEnum.Short, {
                ...commonProps,
                title: 'First Tray',
                message: 'This is the first tray in the stack',
              });

              // Second tray
              mainTrays.push(TrayEnum.Short, {
                ...commonProps,
                title: 'Second Tray',
                message:
                  'This is the second tray. Click Pop to go back to first.',
              });

              // Add a button inside the second tray to pop
              setTimeout(() => {
                Alert.alert(
                  'Pop Testing',
                  'Click Pop to return to the first tray',
                  [
                    { text: 'Pop', onPress: () => mainTrays.pop() },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }, 500);
            }}
          />
          <View style={trayStyles.buttonSpacer} />
          <Button
            title="Pop to Root"
            onPress={() => {
              // Push multiple trays with different types
              const trays = [
                {
                  type: TrayEnum.Short,
                  props: {
                    title: 'Root Tray',
                    message:
                      'This is the root tray (will remain after pop to root)',
                    onClose: () => mainTrays.pop(),
                  },
                },
                {
                  type: TrayEnum.Form,
                  props: {
                    onSubmit: () => {},
                    onClose: () => mainTrays.pop(),
                  },
                },
                {
                  type: TrayEnum.Image,
                  props: {
                    imageUrl:
                      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                    caption: 'Top level tray',
                    onClose: () => mainTrays.pop(),
                    onShowForm: () => {},
                  },
                },
              ];

              // Push all trays in sequence
              trays.forEach(({ type, props }) => {
                mainTrays.push(type, props);
              });

              // Add a pop to root button after a delay
              setTimeout(() => {
                Alert.alert(
                  'Pop to Root',
                  'You have pushed 3 trays. What would you like to do?',
                  [
                    {
                      text: 'Pop to Root',
                      onPress: () => {
                        // Pop twice to leave only the root tray
                        mainTrays.pop();
                        mainTrays.pop();
                      },
                    },
                    {
                      text: 'Dismiss All',
                      onPress: () => mainTrays.dismissAll(),
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }, 500);
            }}
          />
        </View>

        <View style={appStyles.buttonGroup}>
          <Button
            title="Pop with Animation"
            onPress={() => {
              // Push a tray first
              modalTrays.push(TrayEnum.Tall, {
                items: [
                  'This demonstrates pop with animation',
                  'The tray will automatically pop after 2 seconds',
                  'Watch the fade-out animation',
                ],
                onClose: () => modalTrays.pop(),
                onDismissAll: () => {},
              });

              // Auto-pop after delay to demonstrate animation
              setTimeout(() => {
                modalTrays.pop();

                // Show explanation
                setTimeout(() => {
                  Alert.alert(
                    'Animation Complete',
                    'The tray was popped with the fade animation defined in the modal stack config.',
                    [{ text: 'OK' }]
                  );
                }, 1000);
              }, 2000);
            }}
          />
        </View>
      </View>

      {/* REPLACE OPERATIONS */}
      <View style={appStyles.testSection}>
        <Text style={appStyles.testTitle}>Replace Operations</Text>
        <View style={appStyles.buttonGroup}>
          <Button
            title="Replace by Key"
            onPress={() => {
              // First push a tray
              secondaryTrays.push(TrayEnum.Short, {
                title: 'Original Tray',
                message: 'This tray will be replaced by key',
              });

              // Then replace it after a delay
              setTimeout(() => {
                secondaryTrays.replace(TrayEnum.Short, {
                  title: 'Replaced Tray',
                  message: 'This tray replaced the previous one by key',
                  onClose: () => secondaryTrays.pop(),
                });
              }, 1500);
            }}
          />
          <View style={trayStyles.buttonSpacer} />
          <Button
            title="Replace by ID"
            onPress={() => {
              // Generate a unique ID
              const uniqueId = `tray-${Date.now()}`;

              // First push a tray with this ID
              modalTrays.push(TrayEnum.Tall, {
                items: ['This is the original tray with ID: ' + uniqueId],
                onClose: () => modalTrays.pop(),
              });

              // Store the ID in the tray's state
              Alert.alert(
                'Replace by ID Test',
                `Tray ID: ${uniqueId}

Click Replace to update this tray by its ID`,
                [
                  {
                    text: 'Replace',
                    onPress: () => {
                      // Replace the tray by its ID
                      modalTrays.replaceById(uniqueId, {
                        items: [
                          'This tray was REPLACED by its ID: ' + uniqueId,
                          'The replacement worked!',
                          ...generateItems().slice(0, 5),
                        ],
                        onClose: () => modalTrays.pop(),
                      });
                    },
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          />
        </View>

        <View style={appStyles.buttonGroup}>
          <Button
            title="Replace With Animation"
            onPress={() => {
              // Push a tray to the main stack
              mainTrays.push(TrayEnum.Form, {
                onSubmit: () => {},
              });

              // After a delay, replace it with a different type
              setTimeout(() => {
                // Show alert before replacement
                Alert.alert(
                  'Replace Animation',
                  'The form tray will now be replaced with an image tray. Watch the animation!',
                  [
                    {
                      text: 'Replace Now',
                      onPress: () => {
                        mainTrays.replace(TrayEnum.Image, {
                          imageUrl:
                            'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                          caption:
                            'This tray replaced a form tray with animation',
                          onClose: () => mainTrays.pop(),
                          onShowForm: () => {},
                        });
                      },
                    },
                  ]
                );
              }, 1000);
            }}
          />
          <View style={trayStyles.buttonSpacer} />
          <Button
            title="Replace All Instances"
            onPress={() => {
              // Push multiple instances of the same tray type
              const pushMultiple = () => {
                // Push 3 short trays
                for (let i = 0; i < 3; i++) {
                  secondaryTrays.push(TrayEnum.Short, {
                    title: `Short Tray ${i + 1}`,
                    message: `This is short tray instance #${i + 1}`,
                  });
                }

                // Show alert explaining the test
                setTimeout(() => {
                  Alert.alert(
                    'Multiple Instances',
                    'You have pushed 3 Short Trays. Now you can replace all of them at once.',
                    [
                      {
                        text: 'Replace All Short Trays',
                        onPress: () => {
                          // Replace ALL instances of Short tray with a Form tray
                          secondaryTrays.replace(TrayEnum.Short, {
                            onSubmit: (text) => {
                              Alert.alert(
                                'Replaced',
                                `All Short trays were replaced with this Form. You entered: ${text}`
                              );
                              secondaryTrays.pop();
                            },
                            onClose: () => secondaryTrays.pop(),
                          });
                        },
                      },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  );
                }, 500);
              };

              // First clear any existing trays
              secondaryTrays.dismissAll();

              // Then push the multiple trays
              setTimeout(pushMultiple, 500);
            }}
          />
        </View>
      </View>

      {/* DISMISS OPERATIONS */}
      <View style={appStyles.testSection}>
        <Text style={appStyles.testTitle}>Dismiss Operations</Text>
        <View style={appStyles.buttonGroup}>
          <Button
            title="Dismiss by Key"
            onPress={() => {
              // Push multiple trays of the same type
              mainTrays.push(TrayEnum.Short, {
                title: 'Short Tray 1',
                message: 'This will be dismissed by key',
              });

              mainTrays.push(TrayEnum.Form, {
                onSubmit: () => {},
              });

              // Add an alert to dismiss by key
              setTimeout(() => {
                Alert.alert('Dismiss Test', 'Choose which trays to dismiss', [
                  {
                    text: 'Dismiss Short Trays',
                    onPress: () => mainTrays.dismiss(TrayEnum.Short),
                  },
                  {
                    text: 'Dismiss Form Trays',
                    onPress: () => mainTrays.dismiss(TrayEnum.Form),
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }, 500);
            }}
          />
          <View style={trayStyles.buttonSpacer} />
          <Button
            title="Dismiss by ID"
            onPress={() => {
              // Generate unique IDs
              const id1 = `tray1-${Date.now()}`;
              const id2 = `tray2-${Date.now()}`;

              // Push trays with these IDs
              secondaryTrays.push(TrayEnum.Short, {
                title: `Tray ID: ${id1}`,
                message: 'Click to dismiss this specific tray',
              });

              secondaryTrays.push(TrayEnum.Short, {
                title: `Tray ID: ${id2}`,
                message: 'Click to dismiss this specific tray',
              });
            }}
          />
        </View>

        <View style={appStyles.buttonGroup}>
          <Button
            title="Dismiss All With Callback"
            onPress={() => {
              // Push trays to all stacks
              mainTrays.push(TrayEnum.Short, {
                title: 'Main Stack Tray',
                message: 'This tray will be dismissed with all others',
              });

              secondaryTrays.push(TrayEnum.Form, {
                onSubmit: () => {},
              });

              modalTrays.push(TrayEnum.Image, {
                imageUrl:
                  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                caption: 'Modal Stack Tray',
                onShowForm: () => {},
              });

              // Show alert to dismiss all with callback
              setTimeout(() => {
                Alert.alert(
                  'Dismiss All Test',
                  'All trays across all stacks will be dismissed with a callback',
                  [
                    {
                      text: 'Dismiss All Trays',
                      onPress: () => {
                        // Dismiss all trays
                        mainTrays.dismissAll();
                        secondaryTrays.dismissAll();
                        modalTrays.dismissAll();

                        // Show callback confirmation after dismissal
                        setTimeout(() => {
                          Alert.alert(
                            'Dismissal Complete',
                            'All trays have been dismissed across all stacks',
                            [{ text: 'OK' }]
                          );
                        }, 500);
                      },
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }, 1000);
            }}
          />
          <View style={trayStyles.buttonSpacer} />
          <Button
            title="Selective Dismiss"
            onPress={() => {
              // Create a mixed stack of trays
              const pushMixedTrays = () => {
                // Push different types of trays to the same stack
                const trays = [
                  {
                    type: TrayEnum.Short,
                    props: {
                      title: 'Short Tray 1',
                      message: 'This is a short tray in the mixed stack',
                      onClose: () => modalTrays.pop(),
                    },
                  },
                  {
                    type: TrayEnum.Short,
                    props: {
                      title: 'Short Tray 2',
                      message: 'This is another short tray in the stack',
                      onClose: () => modalTrays.pop(),
                    },
                  },
                  {
                    type: TrayEnum.Form,
                    props: {
                      onSubmit: () => {},
                      onClose: () => modalTrays.pop(),
                    },
                  },
                  {
                    type: TrayEnum.Tall,
                    props: {
                      items: ['This is a tall tray in the mixed stack'],
                      onClose: () => modalTrays.pop(),
                      onDismissAll: () => {},
                    },
                  },
                ];

                // Push all trays to the modal stack
                trays.forEach(({ type, props }) => {
                  modalTrays.push(type, props);
                });

                // Show alert for selective dismissal
                setTimeout(() => {
                  Alert.alert(
                    'Selective Dismiss',
                    'You can dismiss specific tray types while keeping others',
                    [
                      {
                        text: 'Dismiss Short Trays Only',
                        onPress: () => modalTrays.dismiss(TrayEnum.Short),
                      },
                      {
                        text: 'Dismiss Form Trays Only',
                        onPress: () => modalTrays.dismiss(TrayEnum.Form),
                      },
                      {
                        text: 'Dismiss Tall Trays Only',
                        onPress: () => modalTrays.dismiss(TrayEnum.Tall),
                      },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  );
                }, 500);
              };

              // First clear any existing trays
              modalTrays.dismissAll();

              // Then push the mixed trays after a delay
              setTimeout(pushMixedTrays, 500);
            }}
          />
        </View>
      </View>

      <Text style={appStyles.footer}>
        Tap the backdrop to dismiss trays (except in secondary stack)
      </Text>
    </ScrollView>
  );
};
