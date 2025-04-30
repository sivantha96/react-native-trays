import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useRef } from 'react';

const AnimatedButton = ({
  title,
  icon,
  style,
  textStyle,
  onPress,
}: {
  title: string;
  icon?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Pressable
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={onPress}
      style={styles.buttonContainer}
    >
      <Animated.View style={[styles.button, { transform: [{ scale }] }, style]}>
        {icon && (
          <View style={styles.iconContainer}>
            <Image source={icon} style={styles.icon} resizeMode="contain" />
          </View>
        )}

        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 19,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
  },
  buttonText: {
    color: '#020202',
    fontSize: 18,
    fontWeight: '600',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: 25,
    height: 25,
    objectFit: 'contain',
    marginRight: 15,
  },
});
