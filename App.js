import React, { Component } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const alohaPic = require('./images/ukulele.png')

export default class App extends Component {
  splashLogic = () => {
    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 2000);
  }

  state = {
    isPlaying: false,
    playbackInstance: null,
    volume: 1.0,
    currentTrackIndex: 0,
    isBuffering: false,
  }
  
  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadAudio();
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({
      isPlaying: !isPlaying
    });
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
    const source = require('./music/ukulele.mp3')
		const status = {
			shouldPlay: this.state.isPlaying,
			volume: this.state.volume,
    };
    playbackInstance
      .setOnPlaybackStatusUpdate(
        this.onPlaybackStatusUpdate
      );
    await playbackInstance.loadAsync(source, status, false);
    this.setState({
      playbackInstance
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Aloha Music</Text>
        </View>
        <View style={styles.picContainer}>
          <Image source={alohaPic} style={styles.pic}/>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
            {this.state.isPlaying ?
              <Feather name='pause' size={32} color="#000"/> :
              <Feather name='play' size={32} color="#000"/>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
    color: "#563822",
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  headerContainer: {
    width: 300,
    backgroundColor: "#da9547",
    alignContent: 'center',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
  },
  picContainer: {
    padding: 40,
  },
  pic: {
    height: 500,
    width: 300,
  }
});