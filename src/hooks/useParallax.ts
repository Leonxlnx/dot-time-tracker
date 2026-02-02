import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Animated, Platform } from 'react-native';

interface ParallaxValues {
    x: Animated.Value;
    y: Animated.Value;
}

export const useParallax = (intensity: number = 12): ParallaxValues => {
    const x = useRef(new Animated.Value(0)).current;
    const y = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;

        const startListening = async () => {
            try {
                await Accelerometer.setUpdateInterval(50); // 20fps

                subscription = Accelerometer.addListener((data) => {
                    // Smooth interpolation to target values
                    Animated.spring(x, {
                        toValue: data.x * intensity,
                        damping: 20,
                        stiffness: 100,
                        useNativeDriver: true,
                    }).start();

                    Animated.spring(y, {
                        toValue: data.y * intensity,
                        damping: 20,
                        stiffness: 100,
                        useNativeDriver: true,
                    }).start();
                });
            } catch (error) {
                console.log('Accelerometer not available:', error);
            }
        };

        startListening();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [intensity]);

    return { x, y };
};
