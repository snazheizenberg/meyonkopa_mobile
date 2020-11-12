import React from "react";
import { View, StyleSheet, TextInput} from "react-native";
import {  Button, Text, Toast } from 'native-base';
import Loading from 'react-native-whc-loading';
import AsyncStorage from '@react-native-community/async-storage';
import services from "./../services";




export default class Login extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
       email: "",
       password: ""
    }
  }

  signIn = async() => {
		if(this.state.email === '' ){
			Toast.show({
				text: "Email required",
				position: "bottom"
			})
		}else if(this.state.password === ''){
			Toast.show({
				text: "Password required",
				position: "bottom"
			})
		}else {
			this.refs.loading.show()
			services.axios.post(services.endpoints.LOGIN,{
				email: this.state.email,
				password:  this.state.password
			})
			.then((res) => {
				if(res){
					console.log(res)
					this.refs.loading.close()
					AsyncStorage.setItem('User', JSON.stringify(res.data.data))
					AsyncStorage.setItem('isAuth', 'true')
					services.axios.defaults.headers.common['Authorization'] = res.data.data.id
					this.props.navigation.navigate('OtherAgeGroup')
				}
			}).catch((err) => {
				this.refs.loading.close()
				if(err.response){
					this.refs.loading.close()
					Toast.show({
		                text: err.response.data.error.message,
		                position: "bottom",
		                type: 'danger',
		                textStyle: {
    						textAlign: 'center'
  						}
		            })
					console.log(err.response.data.error.message)
					console.log(err)
				}
			})
		}
	}
  
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
  			<Loading ref="loading" backgroundColor='transparent' indicatorColor='white' />

        <View>
          <TextInput placeholder="EMAIL" 
          style={styles.input} 
          keyboardType={'email-address'}
          returnKeyType='done'
          autoCapitalize='none'
          onChangeText = {(email) => this.setState({email})}
          value = { this.state.email }/>
          <TextInput
            placeholder="PASSWORD"
            style={styles.input}
            secureTextEntry
            onChangeText = {(password) => this.setState({password})}
            value = { this.state.password }
          />
          <View style={{marginBottom: 20}}>
            <Button
              bordered
              warning
              style={{borderRadius: 50, width: 150, marginLeft: 100}}
              // onPress={() => this.props.navigation.navigate('OtherAgeGroup')}
              onPress={this.signIn}>
              <Text style={{marginLeft: 35}}>Login</Text>
            </Button>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#707070', fontSize: 15, marginHorizontal: 10}}>
              Don't have an account?
            </Text>
            <View>
              <Text
                style={{color: '#05389D'}}
                onPress={() => this.props.navigation.navigate('Register')}>
                REGISTER
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    input: {
        height: 50, 
        borderColor: '#BCBCBC', 
        borderWidth: 1, 
        backgroundColor: "#F9F9F9", 
        width: 330, 
        paddingHorizontal: 20, 
        borderRadius: 50,
        marginBottom: 20
    }
})