import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [gameStage, setGameStage] = useState('start');
  const [buttonSize, setButtonSize] = useState(50);
  const [buttonPosition, setButtonPosition] = useState({ x: width/2 - 25, y: height/2 - 25 });
  const [clickCount, setClickCount] = useState(0);
  const [clickMessage, setClickMessage] = useState('');
  const maxClicks = 15;
  const confettiRef = useRef<any>(null); // Using any to bypass type checking

  const messages: string | any[] = [
     ];

  const getRandomPosition = (currentSize: number) => {
    const safeZoneHeight = 100; // Adjust this value based on the height of the message area
    const maxX = width - currentSize;
    const maxY = height - currentSize - safeZoneHeight;
    const minY = safeZoneHeight; // Start positioning below the safe zone
  
    return {
      x: Math.random() * maxX,
      y: Math.random() * (maxY - minY) + minY,
    };
  };

  const handleStartPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGameStage('growing');
    setButtonPosition(getRandomPosition(buttonSize));
    //setClickMessage("click if true");
  };

  const handleButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Vibration.vibrate(50);

    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount < messages.length) {
      setClickMessage(messages[newCount]);
    } else {
      //setClickMessage(`Click ${newCount + 1}!`);
    }

    const newSize = buttonSize + 20;
    setButtonSize(newSize);
    setButtonPosition(getRandomPosition(newSize));

    if (newCount >= maxClicks) {
      setGameStage('finalQuestion');
      setButtonPosition({
        x: width/2 - newSize/2,
        y: height/2 - newSize/2
      });
      setClickMessage("");
    }
  };

  const handleFinalQuestionPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Vibration.vibrate(100);
    setGameStage('conclusion');
    confettiRef.current?.start();
  };

  return (
    <View style={styles.container}>
      {gameStage === 'start' ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartPress}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>UwU</Text>
        </TouchableOpacity>
      ) : gameStage === 'conclusion' ? (
        <View style={styles.conclusionContainer}>
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{ x: width/2, y: 0 }}
            explosionSpeed={500}
            fallSpeed={3000}
            colors={['#BA1200', '#6BA9E3', '#6BE36D', '#E36B8B', '#F2E2BA']}
          />
          <Text style={styles.conclusionText}>congrats ure a hater</Text>
          <TouchableOpacity
            style={styles.conclusionButton}
            onPress={() => {
              setGameStage('start'); // Reset to the initial stage
              setButtonSize(50); // Reset button size
              setButtonPosition({ x: width / 2 - 25, y: height / 2 - 25 }); // Reset button position
              setClickCount(0); // Reset click count
              setClickMessage(''); // Clear the click message
            }}
          >
            <Text style={styles.conclusionButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {clickMessage && (
            <Text style={styles.clickMessage}>{clickMessage}</Text>
          )}
          <TouchableOpacity
            style={[
              styles.gameButton,
              {
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize/2,
                left: buttonPosition.x,
                top: buttonPosition.y,
                backgroundColor: gameStage === 'finalQuestion' ? 'darkred' : 'red'
              }
            ]}
            onPress={gameStage === 'finalQuestion' ? handleFinalQuestionPress : handleButtonPress}
            activeOpacity={0.7}
          >
            {gameStage === 'finalQuestion' && (
              <Text style={styles.buttonText}>DO YOU HATE ME?</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickMessage: {
    position: 'absolute',
    top: 50,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5252',
    textAlign: 'center',
    padding: 10,
  },
  startButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -50 }],
    padding: 40,
    backgroundColor: '#FF6B6B',
    borderRadius: 80,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    fontSize: 30,
  },
  conclusionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  conclusionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FF5252',
  },
  conclusionButton: {
    padding: 20,
    backgroundColor: '#D32F2F',
    borderRadius: 15,
    elevation: 5,
  },
  conclusionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});