/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { LoginManager } from 'react-native-fbsdk'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



type Props = {};
export default class App extends Component<Props> {

  _onLoginFbPress = async () => {
    this.setState({ loading: true });

    let res;
    try {
      res = await LoginManager.logInWithReadPermissions([
        'public_profile',
        'email',
      ]);
    } catch (error) {
      console.log('====================================');
      console.log('error', error);
      console.log('====================================');
    }

    if (res.grantedPermissions && !res.isCancelled) {
      const data = await AccessToken.getCurrentAccessToken();

      if (data) {
        const serverResponse = await this.props.loginMutation({
          variables: {
            provider: 'FACEBOOK',
            token: data.accessToken,
          },
        });

        const { token } = serverResponse.data.login;

        try {
          await AsyncStorage.setItem(authToken, token);

          this.setState({ loading: false });

          startMainApp();
        } catch (error) {
          throw error;
        }
      }
    }
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this._onLoginFbPress}
          style={styles.fbLoginBtn}>   
          <Text>Login</Text>     
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  fbLoginBtn: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
